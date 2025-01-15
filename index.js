require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4jm04.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    app.get('/', (req, res) => { 
        res.send('API is running...');
    })
    try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
        
        const userCollection = client.db('tourists').collection('users');
        const touristStory = client.db('tourists').collection('touristStory');
        
        //  to save user data
        app.post('/user', async (req, res) => { 
            const cartItem = req.body;
            const query = { email: cartItem.email }
            const existingUser = await userCollection.findOne(query)
            if (existingUser) {
              return res.status(409).send({ message: "User already exists" });
            }
            const result = await userCollection.insertOne(cartItem);
            res.send(result)
        })
        
        // to get all user data
        app.get('/users', async (req, res) => { 
            const result = await userCollection.find().toArray();
            res.send(result)
        })
      
      
      // to post tourst add stories
      app.post('/add-stories', async (req, res) => { 
        const story = req.body;
        const result = await touristStory.insertOne(story);
        res.send(result)
      })

      // to get tourist story
      app.get('/stories', async (req, res) => { 
        const result = await touristStory.find().toArray();
        res.send(result)
      })
      
      // to get a single story
      app.get('/story/:id', async (req, res) => { 
        const id = ObjectId(req.params.id);
        const result = await touristStory.findOne({_id: id});
        res.send(result)
      })
      
      // to update a story
      app.put('/story/:id', async (req, res) => { 
        const id = ObjectId(req.params.id);
        const updatedStory = req.body;
        const result = await touristStory.updateOne({_id: id}, {$set: updatedStory});
        res.send(result)
      })
      
      // to delete a story
        
  } finally {
  }
}
run().catch(console.dir);


app.listen(port);

