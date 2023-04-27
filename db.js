


const {MongoClient} = require('mongodb')
// const url = 'mongodb://localhost:27017/bookStore'
const url = 'mongodb+srv://tranngochai:hai123@cluster0.myhmqqh.mongodb.net/?retryWrites=true&w=majority'
let dbConnection
const connectToDb = (callback) => {
    MongoClient.connect(url)
        .then(client => {
            dbConnection = client.db();
            console.log('Connected to Server')
            return callback()
        })
        .catch((err) => {
            return callback(err)
        })
}
const getDb = () => dbConnection

module.exports = { connectToDb, getDb}

