const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors')

const ObjectId = require('mongodb').ObjectId;

const app = express();

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmgka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('stCar');
        const productsCollection = database.collection('products');
        const usersCollection = database.collection('users');
        const ordersCollection = database.collection('orders');
        const reviewsCollection = database.collection('reviews');

        // GET API ************************************************ Get****************************

        // Get all products
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        // Get all orders
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
        // Get all reviewss
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
        // Get all users
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });


        // Get single product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await productsCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(user);
        });

        // User admin or not
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });



        // Kaj kortche na 
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };

            console.log(email);
            console.log(query);
            const user = await ordersCollection.find({ userEmail: email });
            console.log('load user with id: ', user);
            res.send(user);
            // res.send('Orders');
        });


        // POST API *************************************************Post ******************************************
        // Post Single products
        app.post('/products', async (req, res) => {
            const newService = req.body;
            const result = await productsCollection.insertOne(newService);
            // console.log('got new user', newService);
            // console.log('added user', result);
            res.json(result);
        });

        //Post Single order
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder);
            // console.log('got new user', newOrder);
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

        //Post Single review
        app.post('/reviews', async (req, res) => {
            const newReview = req.body;
            console.log(newReview);
            const result = await reviewsCollection.insertOne(newReview);
            // console.log('got new user', newOrder);
            // console.log('added user', result);
            res.json(result);
        });











        //UPDATE API ********************************************* Update**************************************

        // Role change of user
        app.put('/users/admin', async (req, res) => {
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
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        //  Update Order status 
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            // console.log('updating req', updatedUser)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = { $set: { status: updatedOrder.orderstatus } };
            const result = await ordersCollection.updateOne(filter, updateDoc, options)
            // console.log('updating', id)
            res.json(result)
        });



        // Update Single Order 
        // app.put('/orders/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const updatedUser = req.body;
        //     // console.log('updating req', updatedUser)
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             userName: updatedUser.userName,
        //             serviceName: updatedUser.serviceName,
        //             address: updatedUser.address,
        //             phone: updatedUser.phone,
        //             status: updatedUser.status

        //         },
        //     };
        //     const result = await ordersCollection.updateOne(filter, updateDoc, options)
        //     // console.log('updating', id)
        //     res.json(result)
        // });





        // // DELETE  API **************************************** Delete *************************************

        //Delete Single Order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);


            res.json(result);
        });

        //Delete Single Product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);

            // console.log('deleting user with id ', result);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running ST Cars');
});
app.get('/morning', (req, res) => {
    res.send('Morning');
});
app.get('/hello', (req, res) => {
    res.send('Hello ST Cars');
});


app.listen(port, () => {
    console.log('ST Cars running at', port);
});

// done all
