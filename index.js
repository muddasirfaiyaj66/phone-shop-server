const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rrl4awm.mongodb.net/?retryWrites=true&w=majority`;

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

    await client.connect();
    const phonesCollection = client.db('phonesDB').collection('phones');
    app.get('/phones',async(req,res)=>{
      const cursor = phonesCollection.find();
      const result = await cursor.toArray();
      res.send(result); 
    })
    app.post('/phones', async(req,res) =>{
      const newPhones = req.body;
      const result = await phonesCollection.insertOne(newPhones);
      res.send(result);
      
    })
    app.get('/phones/:brand_name', async(req,res)=>{
      const brandName= req.params.brand_name;
      const cursor = phonesCollection.find({"brand_name": brandName})
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/phones/:brand_name/:id', async(req,res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result =await phonesCollection.findOne(query);
      res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Phone server start')
})

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})