const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors())
app.use(express.json())


//craft-store
//XsHm0dNF1RSuBQJ1




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ecoeol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const craftCollection = client.db('craftDB').collection('crafts')

    app.post('/crafts',async(req,res)=>{
        const newItem = req.body;
        const result = await craftCollection.insertOne(newItem)
        res.send(result)
    })

    app.get('/crafts',async(req,res)=>{
        const cursor = craftCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/crafts/:email',async(req,res)=>{
        const email = req.params.email;
        const result = await craftCollection.find({email: email}).toArray();
        res.send(result)
    })

    app.delete('/crafts/:email/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("Art and Craft Store running")
})

app.listen(port,()=>{
    console.log(`Art and Craft running on port: ${port}`);
})
