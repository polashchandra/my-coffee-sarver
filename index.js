const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const cors=require('cors');
const port=process.env.PORT ||8000;
//midle ware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i92bcq8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const coffeecalection = client.db("coffeeDB").collection("coffee")
    
    app.get('/coffee',async(req,res)=>{
      const quary=coffeecalection.find();
      const result= await quary.toArray();
      res.send(result)
    })
    app.get("/coffee/:id",async(req,res)=>{
      const id=req.params.id;
      const quary={_id:new ObjectId(id)}
      const result=await coffeecalection.findOne(quary)
      res.send(result)
    })

    app.post('/coffee' ,async (req,res)=>{
      const newcoffee=req.body
      console.log(newcoffee);
      const result=await coffeecalection.insertOne(newcoffee)
      res.send(result)
    })

    app.delete('/coffee/:id',async(req,res)=>{
      const id=req.params.id;
      const quary={_id:new ObjectId(id)}
      const result=await coffeecalection.deleteOne(quary)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  ;
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("hellow welcome to my cafe shop")
})
app.listen(port,()=>{
    console.log(`this is port unbilibale${port}`);
})