const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kwgfltq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandCollection = client.db('brandDB').collection('brand');
    const userCollection = client.db('brandDB').collection('userBrand');



   app.get('/card', async(req, res) => {
    const cursor = brandCollection.find();
    const result = await cursor.toArray();
    res.send(result);
   })

   app.put('/card/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = { upsert: true };
    const updatedCard = req.body;
    const card = {
      $set: {
        name: updatedCard.name,
        brand: updatedCard.brand,
        image: updatedCard.image,
        carbrand: updatedCard.carbrand,
        price: updatedCard.price,
        description: updatedCard.description,
        rating: updatedCard.rating,
      }
    }
    const result = await brandCollection.updateOne(filter, card, options)
    res.send(result);
   })

   app.get('/card/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await brandCollection.findOne(query);
    res.send(result)
   })

    app.post('/card', async(req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await brandCollection.insertOne(newProduct);
        res.send(result)
    })


        app.get('/userCard', async(req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/userCard/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await userCollection.deleteOne( query);
            res.send(result);
        })

        app.post('/userCard', async(req, res) => {
            const userProduct = req.body;
            console.log(userProduct);
            const result = await userCollection.insertOne(userProduct);
            res.send(result)
        })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
})