const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'user-registry';
const collectionName = 'users';
module.exports.insert = insert;
module.exports.find = find;

// inserted user details into database
async function insert(
    connectionURL,
    databaseName,
    collectionName,
    _data) {
    return new Promise(function (resolve, reject) {
        try {
            // Use connect method to connect to the server
            MongoClient.connect(connectionURL, {
                useNewUrlParser: true, useUnifiedTopology: true
            }, function (err, client) {
                const _db = client.db(databaseName);

                insertDocument(_db, collectionName, _data, function (err, docs) {
                    client.close();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(docs);
                    }
                });
            });
        } catch (error) {
            console.log('Error getting the resource.' + error);
            reject(error);
        }
    });
}

const insertDocument = function (_db, collectionName, _data, callback) {
    const _collection = _db.collection(collectionName);

    _collection.insertOne(_data, function (err, result) {
        if (err) {
            console.log('Error creating document in the database' + err);
            callback(err);
        } else {
            console.log('Created the document.');
            // console.log(result);
            callback(null, result);
        }
    });
};

// retrieves the user details from database
async function find(_connectionURL,
    databaseName,
    collectionName,
    _query) {
    return new Promise(function (resolve, reject) {
        try {
            // Use connect method to connect to the server
            MongoClient.connect(connectionURL, {
                useNewUrlParser: true, useUnifiedTopology: true
            }, function (err, client) {
                const _db = client.db(databaseName);
                findDocuments(_db, collectionName, _query, function (err, docs) {
                    client.close();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(docs);
                    }
                });
            });
        } catch (error) {
            console.log('Error finding documents.' + error);
            reject(error);
        }
    });
}

const findDocuments = function (_db, collectionName, _query, callback) {
    const _collection = _db.collection(collectionName);
    _collection.findOne({
        where: _query,
    }, function (err, docs) {
        if (!err) {
            console.log('Found the documents.' + docs);
            callback(null, docs);
        } else {
            console.log('Error finding documents in the database' + err);
            callback(err);
        }
    });
};
