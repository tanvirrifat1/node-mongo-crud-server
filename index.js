const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// user :tanvirUser2
// pass: 


const uri = "mongodb+srv://tanvirUser2:mfmXFkYBcWhW1Pzn@cluster0.afkplob.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



app.get('/', (req, res) => {
    res.send('hello from node mongo curd server')
})

async function run() {
    try {
        const userCollection = client.db('nodeMongoCrud').collection('users');

        app.get('/users', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user)
            res.send(result)
        });

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, option)
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('trying to delete', id)
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
            console.log(result)
        })

    }
    finally {

    }
}

run().catch(err => console.log(err))

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})