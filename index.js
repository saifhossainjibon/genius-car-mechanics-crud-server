const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { application } = require('express');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4vhi1hx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanics");
        const servicesCollection = database.collection("services");
        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        })
        // GET single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log("gwtting single id", id);
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.send(service);
        })
        // POST API 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hitting', service)
            const result = await servicesCollection.insertOne(service);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        })
        //DELET API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result);
            console.log("gwtting delete service", id);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World! welcome  saifhossainjibon');
})

app.listen(port, () => {
    console.log(`Server listening on port`, port);
});