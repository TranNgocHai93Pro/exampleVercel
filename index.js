const express = require('express')
const { ObjectId } = require('mongodb')
const {MongoClient} = require('mongodb')
// const url = 'mongodb://localhost:27017/bookStore'
let url = 'mongodb+srv://tranngochai:hai123@cluster0.myhmqqh.mongodb.net/?retryWrites=true&w=majority'
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

const app = express()
let PORT = process.env.PORT || 9001
app.use(express.json())// update data dang json
let db
connectToDb ((err) => {
    if(!err){
        app.listen(PORT,() => {
            console.log(`Server is running on Port ${PORT}`)
        })
        db = getDb()
    }else{
        console.log('Could not fetch Database')
    }
})
app.get('/books', (req,res) => {
    let books = []
    db.collection('books')
        .find()
        .sort({ author: 1})
        .forEach(book => books.push(book))
        .then(() => res.status(200).json(books))
        .catch(() => {
            res.status(500).json({error : 'Fetch Database Fail'})
        })
})
// get single book
app.get('/books/:id',(req,res) => {
    if ( ObjectId.isValid(req.params.id)){
        db.collection('books')
            .findOne({_id : new ObjectId(req.params.id)})
            .then(book => {
                if (book) {
                    res.status(200).json(book)
                } else {
                    res.status(500).json({ error: 'no found' })
                }
            })
            .catch(() => {
                res.status(500).json({ error : 'No found'})
            })
    }else{
        res.status(500).json({ error : 'id is invalid'})
    }
})

app.delete('/books/:id',(req,res) => {
    if ( ObjectId.isValid(req.params.id)){
        db.collection('books')
            .deleteOne({_id : new ObjectId(req.params.id)})
            .then(result => {
                    res.status(200).json(result)
            })
            .catch(() => {
                res.status(500).json({ error : 'Dont Delete book'})
            })
    }else{
        res.status(500).json({ error : 'id is invalid'})
    }
})
//update 
app.patch('/books/:id',(req,res) => {
    let updates = req.body;
    console.log(req.body)
    if ( ObjectId.isValid(req.params.id)){
        db.collection('books')
            .updateOne({_id : new ObjectId(req.params.id)},{$set: updates})
            .then(result => {
                    res.status(200).json(result)
            })
            .catch(() => {
                res.status(500).json({ error : 'Dont Update Fail'})
            })
    }else{
        res.status(500).json({ error : 'id is invalid'})
    }
})

// db.books.updateOne({_id: ObjectId("6430de3514554e73d07e631d")},{$set: {rating:8}})





app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-style': 'text/html' })
    res.end('<h1>Home Page</h1>')
})

//request.query

// const url = 'http:.//localhost:3000/homepage/search?page=1&title=Jone&sort=asc'
// query include key and value pair to be used to queries, key={page,title,sort}, value={nodejs,Jone,asc}
app.get('/books',(req,res) => {
    const numberPage = parseInt(req.query.page)  || 1;
    const PAGE_SIZE = 10;
    db.collection('books')
        .find()
        .limit(pageSize)
        .skip((numberPage - 1)*pageSize)
        .then( result => res.status(200).json(result))
})

//post
app.post('/books',(req,res)=> {
    let book = req.body;
    db.collection('books')
        .insertOne(book)
        .then( result => {
            res.status(201).json(result)
        })
        .catch( () => {
            res.status(500).json({error : 'Could not Post database' })
        })
})

let x= 10;
