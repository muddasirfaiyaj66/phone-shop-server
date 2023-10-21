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
    const cartCollection = client.db('cartDB').collection('cart');
  
    app.post('/phones', async (req, res) => {
      const newPhone = req.body;
      const result = await phonesCollection.insertOne(newPhone)
      res.send(result)
    })
    app.delete("/phones/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await phonesCollection.deleteOne(query)
      res.send(result)
    })
    app.get('/phones/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: id }
      const result = await phonesCollection.findOne(query)
      res.send(result)
    })
    app.put('/phones/:id', async (req, res) => {
      const id = req.params.id;
      const updatePhone = req.body;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      console.log(id);
      
      const phone = {
        $set: {
          name: updatePhone.name,
          brand_name: updatePhone.brand_name,
          ram: updatePhone.ram,
          storage: updatePhone.storage,
          price: updatePhone.price,
          image: updatePhone.image,
          rating: updatePhone.rating,
          details: updatePhone.details,
          operating_system: updatePhone.operating_system,
          camera: updatePhone.camera,
        },
      };
      const result = await phonesCollection.updateOne(filter, phone, options);
      res.send(result);
    })
    app.get('/phones', async (req, res) => {
      const result = await phonesCollection.find().toArray();
     
      res.send(result);
    });
    
    
   
   
    
    
   
    
    // cart collection 
    app.post('/cart', async (req, res) => {
      const cartData = req.body;
    
      const result = await cartCollection.insertOne(cartData)
      res.send(result)
    })
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id};
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
    
    app.get('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: id }
      const result = await cartCollection.findOne(query)
      res.send(result)
    })
   
    app.get('/cart', async (req, res) => {
      const cursor = cartCollection.find()
      const cart = await cursor.toArray()
    
      res.send(cart)
    
    })
   
    
   
    

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();    
  }
}





run().catch(console.dir);




app.get('/', (req, res) => {
  res.send("Server start successfully")
})


app.listen(port, () => {
  // console.log(`server is running on ${port}`)
})


