const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors')

const ObjectId = require('mongodb').ObjectId;

const app = express();

const port = process.env.PORT || 5000;

// https://guarded-thicket-98440.herokuapp.com/morning


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmgka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('stBlogs');
        const blogsCollection = database.collection('blogs');
        const usersCollection = database.collection('users');

        // GET API ************************************************ Get****************************

        // Get all blogs
        app.get('/blogs', async (req, res) => {
            const cursor = blogsCollection.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        });

        // Get all users
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });


        // Get single product
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await blogsCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(user);
        });




        // POST API *************************************************Post ******************************************
        // Post Single blogs
        app.post('/blogposts', async (req, res) => {
            const newService = req.body;
            const result = await blogsCollection.insertOne(newService);
            console.log('got new user', newService);
            // console.log('added user', result);
            res.json(result);
        });


        //UPDATE API ********************************************* Update**************************************


        app.put('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            // console.log('updating req', updatedUser)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = { $set: { status: updatedOrder.orderstatus } };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)

            res.json(result)
        });


        // // DELETE  API **************************************** Delete *************************************

        //Delete Single Product
        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await blogsCollection.deleteOne(query);
            res.json(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running ST Blogs');
});
app.get('/travel', (req, res) => {
    res.send('Good Morning Everyone');
});
app.get('/hello', (req, res) => {
    res.send('Hello ST Blogs');
});


app.listen(port, () => {
    console.log('ST Blogs running at', port);
});


