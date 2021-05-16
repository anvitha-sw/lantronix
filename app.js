var express = require('express');
const bodyparser = require('body-parser');
const app = express();
const mongoClient = require("./database");
let nodemailer = require('nodemailer');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'user-registry';
const collectionName = 'users';

module.exports = app

app.post('/user/register', async function (req, res) {
    if (!(req.body.username && req.body.firstname && req.body.lastname && req.body.email && req.body.password)) {
        res.status(400).send('Invalid request');
    }
    let dbentry = await insertNew('users', req.body);
    sendmail(req.body.email);
    console.log('OUTPUT : ' + dbentry);
    res.status(200).json({
        message: "A verification mail has been sent to your registered mail."
    });
});


app.post('/user/login', async function (req, res) {
    if (!(req.body.username && req.body.password)) {
        res.status(400).send('Invalid request');
    }
    let dbentry = await find('users', req.body);
    res.status(200).json({
        user: dbentry
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

// below method is to insert the data obtained in /user/register method
async function insertNew(_dbCollection, _data) {
    try {
        // set db model from the type
        _dbCollection = 'users';
        let _status = await mongoClient.insert(connectionURL, databaseName, collectionName, _data);
        console.log(`_status: ${_status}`);
        return _status;
    } catch (err) {
        console.log('Error from insertNew: ' + JSON.stringify(err));
        return err;
    }
}

// below is to query the db to fetch the data based on username and password
async function find(_dbCollection, _data) {
    try {
        // set db model from the type
        _dbCollection = 'users';
        let _query = { username: _data.username, password: _data.password };
        let _status = await mongoClient.find(connectionURL, databaseName, collectionName, _query);
        console.log(`_status: ${_status}`);
        return _status;
    } catch (err) {
        console.log('Error from find: ' + err);
        return err;
    }
}

var poolConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'xxxxxx', // valid email
        pass: 'xxxxxx' // password
    }
};

var transporter = nodemailer.createTransport(poolConfig);

async function sendmail(email) {
    try {

        let messageToSend = '<b>Hello,</b><br/>' +
            '<br/>' +
            'This is to verify your email as registered with Lantrix' +
            '<br/><br/>' +
            'Thanks,<br/>' +
            'Lantrix'

        var mailOptions = {
            from: "Lantrix<athivna.4u@gmail.com>",
            to: email,
            subject: `Welcome to Lantrix`,
            html: messageToSend
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    } catch (error) {
        console.log('Message delivery Failure ' + error);
    }
};