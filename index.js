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
        // Get all blogs
        app.get('/user/blogs', async (req, res) => {

            console.log('hit');
            const query = { status: 'Approved' };
            const cursor = blogsCollection.find(query);
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
            console.log('blog id', id);
            const query = { _id: ObjectId(id) };
            const user = await blogsCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(user);
        });

        // User admin or not
        app.get('/users/:email', async (req, res) => {

            console.log('admin checking');
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            console.log(user);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
                console.log(' admin hit and true');
            }
            res.json({ admin: isAdmin });
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

        //Post Single user
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            // console.log('got new user', newOrder);
            // console.log('added user', result);
            res.json(result);
        });


        //UPDATE API ********************************************* Update**************************************




        // Role change of user
        app.put('/users/admin', async (req, res) => {
            console.log('email pass er jnno put hit');
            const user = req.body;
            const filter = { email: user.email };
            console.log(filter);
            // const options = { upsert: true };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });
        // Google sign er jnno
        app.put('/users', async (req, res) => {

            console.log(' googoler jnno put hit');
            const user = req.body;
            console.log(' googoler jnno put hit', user);
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/blogs/:id', async (req, res) => {
            const id = req.params.id;

            const filter = { _id: ObjectId(id) };
            console.log('updating blog', filter);
            const options = { upsert: true };
            const updateDoc = { $set: { status: 'Approved' } };
            const result = await blogsCollection.updateOne(filter, updateDoc, options)

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
    console.log('object');
});
app.get('/hello', (req, res) => {
    res.send('Hello ST Blogs');
});


app.listen(port, () => {
    console.log('ST Blogs running at', port);
});

// sesh  
