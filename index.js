const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


//mongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.zb7yt6s.mongodb.net/?retryWrites=true&w=majority`;



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
   

    const usersCollection = client
    .db("UniVerse")
    .collection("users");
    const blogsCollection = client
    .db("UniVerse")
    .collection("blogs");
    const noticeCollection = client
    .db("UniVerse")
    .collection("notice");
  


    //  users realated api is here
    app.post("/users",  async (req, res) => {
        const user = req.body;
        const query = { email: user.email };
  
        const excitingUser = await usersCollection.findOne(query);
        console.log("existing User", excitingUser);
  
        if (excitingUser) {
          return res.send({ message: "user exists" });
        }
        const result = await usersCollection.insertOne(user);
        return res.send(result);
      });

    app.get("/users", async (req, res) => {
        const result = await usersCollection.find().toArray();
        return res.send(result);
      });


      // Blog related api 

      app.get("/blogs", async (req, res) => {
        try {
          const result = await blogsCollection.find().toArray();
          return res.send(result);
        }
        catch (error) {
          console.error('Error fetching users using the native driver:', error);
          res.status(500).json({ error: 'Server error' });
        }
      });
      
      app.post("/blogs", async (req, res) => {
        try {
          const newBlogs = req.body;
        
          const result = await blogsCollection.insertOne(newBlogs);
          return res.send(result);
        }
        catch (error) {
          console.error('Error fetching users using the native driver:', error);
          res.status(500).json({ error: 'Server error' });
        }
      });
      app.delete("/blogs/:id", async (req, res) => {
        try {
          const id = req.params.id;
        
          const filter = { _id: new ObjectId(id) };
          const result = await blogsCollection.deleteOne(filter);
          return res.send(result);
        }
        catch (err) {
          res.status(500).json(err)
        }
      });

      // notice related 
      app.get("/notice", async (req, res) => {
        try {
          const result = await noticeCollection.find().toArray();
          return res.send(result);
        }
        catch (error) {
          console.error('Error fetching users using the native driver:', error);
          res.status(500).json({ error: 'Server error' });
        }
      });
      
      app.post("/notice", async (req, res) => {
        try {
          const newNotice = req.body;
        
          const result = await noticeCollection.insertOne(newNotice);
          return res.send(result);
        }
        catch (error) {
          console.error('Error fetching users using the native driver:', error);
          res.status(500).json({ error: 'Server error' });
        }
      });

    
     // Connect the client to the server	(optional starting in v4.7)
     await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Universe running");
});

app.listen(port, () => {
  console.log(`Universe port ${port}`);
});