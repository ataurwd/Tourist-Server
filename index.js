require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 7000;

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
        const guideCollection = client.db('tourists').collection('guide');
        const packageCollection = client.db('tourists').collection('package');
        
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
      
      // to find a spacified user base on email
      app.get('/user/:email', async (req, res) => { 
        const mainEmail = req.params.email;
        const query = { email: mainEmail }
        const result = await userCollection.find(query).toArray();
        res.send(result)
      })
      
      // get user by id
      app.get('/users/:id', async (req, res) => { 
        const id = new ObjectId(req.params.id);
        const result = await userCollection.findOne({_id: id});
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

      app.get('/storie/:email', async (req, res) => { 
        const mainEmail = req.params.email;
        const query = { email: mainEmail }
        const result = await touristStory.find(query).toArray();
        res.send(result)
      })
      
      // to get a single story
      app.get('/story/:id', async (req, res) => { 
        const id = new ObjectId(req.params.id);
        const result = await touristStory.findOne({_id: id});
        res.send(result)
      })
      

      // to update a single story
      app.patch('/update/:id', async (req, res) => {
        const id = req.params.id;
        const { title, storyText, removeImages, addImages } = req.body;
      
        try {
          const update = {};
          if (title) update.title = title;
      
          if (storyText) update.storyText = storyText;
      
          if (removeImages && removeImages.length > 0) {
            await touristStory.updateOne(
              { _id: new ObjectId(id) },
              { $pull: { images: { $in: removeImages } } }
            );
          }
      
          if (addImages && addImages.length > 0) {
            await touristStory.updateOne(
              { _id: new ObjectId(id) },
              { $push: { images: { $each: addImages } } }
            );
          }
      
          if (Object.keys(update).length > 0) {
            await touristStory.updateOne(
              { _id: new ObjectId(id) },
              { $set: update }
            );
          }
      
          const updatedStory = await touristStory.findOne({ _id: new ObjectId(id) });
          res.send(updatedStory);
      
        } catch (error) {
          console.error('Error updating story:', error);
          res.status(500).send({ error });
        }
      });
      
      // to delete a story
      app.delete('/story/:id', async (req, res) => { 
        const id = new ObjectId(req.params.id);
        const result = await touristStory.deleteOne({_id: id});
        res.send(result)
      })

      // to post the join as a guild data
      app.post('/guide', async (req, res,) => {
        const guide = req.body;
        const { email } = guide;
        const isExist = await guideCollection.findOne({ email })
        if (isExist) {
            return res.status(409).send({ message: "User already exists" });
        }
        const result = await guideCollection.insertOne(guide)
        res.send(result)
      })

      // to get all guild data
      app.get('/guides', async (req, res) => { 
        const result = await guideCollection.find().toArray();
        res.send(result)
      })
      

// Update the role from tourist to guide
app.patch('/update-guide/:email', async (req, res) => {
  const email = req.params.email;

  await userCollection.updateOne(
    { email },
    { $set: { role: "guide" } }
  );

  // to delete the guide from the guide collection
  await guideCollection.deleteOne({ email });

  const updatedUser = await userCollection.findOne({ email });
  res.send(updatedUser);
});
      
      
      // to delete candidata item
app.delete('/guide/:id', async (req, res) => { 
  const id = new ObjectId(req.params.id);
  const result = await guideCollection.deleteOne({_id: id});
  res.send(result)
})
      
      // to post add package item
      app.post('/add-package', async (req, res) => { 
        const packageItem = req.body;
        const result = await packageCollection.insertOne(packageItem);
        res.send(result)
      })
      
      // to get all package item
      app.get('/packages', async (req, res) => {
        try {
          const result = await packageCollection.aggregate([{ $sample: { size: 3 } }]).toArray();
          res.send(result);
        } catch (error) {
          console.error("Error fetching random packages:", error);
          res.status(500).send({ message: "Internal Server Error" });
        }
      });

      // to get normally all packages
      app.get('/packages/all', async (req, res) => {
          const result = await packageCollection.find().toArray();
          res.send(result);
      });
      
      // to get a single package item
      app.get('/package/:id', async (req, res) => { 
        const id = new ObjectId(req.params.id);
        const result = await packageCollection.findOne({_id: id});
        res.send(result)
      })
      
      // to update a single package item
      
      
    } catch (error) {
        
  } finally {
  }
}
run().catch(console.dir);


app.listen(port);

