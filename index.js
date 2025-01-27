require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require('stripe')(process.env.STRIP_SECRATE_KEY)
const app = express();
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 7000;
const jwt = require('jsonwebtoken')

app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: ['http://localhost:5173', 'https://tourism-management-1e7fd.web.app'],
  credentials: true,
}))


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4jm04.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  jwt.verify(token, process.env.SECRETE_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token is not valid' });
    req.user = decoded;
    next();
  })
}

async function run() {
    app.get('/', (req, res) => { 
        res.send('API is running...');
    })
    try {
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
        
        const userCollection = client.db('tourists').collection('users');
        const touristStory = client.db('tourists').collection('touristStory');
        const guideCollection = client.db('tourists').collection('guide');
        const packageCollection = client.db('tourists').collection('package');
        const guideBooking = client.db('tourists').collection('guideBooking');
        const paymentCollection = client.db('tourists').collection('payment');
        
      // to genarete jwt token
      app.post('/jwt', async (req, res) => {
        const email = req.body;
        const token = jwt.sign(email, process.env.SECRETE_KEY, { expiresIn: '36d' })
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', 
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      })
        .send({sucess: true})
      })
      
         // if token invalid then logout
         app.get('/logout', async (req, res) => {
          try {
            res.clearCookie('token', {
              maxAge: 0, // Clear the cookie immediately
              secure: process.env.NODE_ENV === 'production', // Secure cookie in production
              sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
              // If your cookie had a path or domain set, include them here
              domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : 'localhost',
            }).send({ success: true });
          } catch (error) {
            console.error('Error clearing cookie:', error);
            res.status(500).send({ success: false, message: 'Failed to log out' });
          }
        });
        
      
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
      app.get('/user/:email', verifyToken, async (req, res) => { 
        const mainEmail = req.params.email;
        const decodedEmail = req.user?.email
        if (decodedEmail !== mainEmail ){
          return res.status(401).send('unauthorized to access this data')
        }

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
  
      // to get all guides
      app.get('/all-guides', async (req, res) => {
            const result = await userCollection.aggregate([
                { $match: { role: "guide" } }, 
                { $sample: { size: 6 } }      
            ]).toArray();
            res.send(result);
    });
    
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
      
      // app.patch('/update-guide/:email', async (req, res) => {
      //   const email = req.params.email;
      
      //   await userCollection.updateOne(
      //     { email },
      //     { $set: { role: "guide" } }
      //   );
      
      //   // to delete the guide from the guide collection
      //   await guideCollection.deleteOne({ email });
      
      //   const updatedUser = await userCollection.findOne({ email });
      //   res.send(updatedUser);
      // });
      // to update a single story
      const { ObjectId } = require('mongodb');

      app.patch('/update/:id', async (req, res) => {
          const id = req.params.id;
          const { title, storyText, images } = req.body;
      
          if (!ObjectId.isValid(id)) {
              return res.status(400).send({ message: "Invalid story ID" });
          }
      
          // Update the story
          await touristStory.updateOne(
              { _id: new ObjectId(id) },
              { $set: { title, storyText, images } }
          );
      
          // Retrieve the updated story
          const updatedStory = await touristStory.findOne({ _id: new ObjectId(id) });
          res.send(updatedStory);
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
      app.get('/packages/all',verifyToken, async (req, res) => {
          const result = await packageCollection.find().toArray();
          res.send(result);
      });
      
      // to get a single package item
      app.get('/package/:id', async (req, res) => { 
        const id = new ObjectId(req.params.id);
        const result = await packageCollection.findOne({_id: id});
        res.send(result)
      })
      
      // to post the guide booking data
      app.post('/guide-booking', async (req, res) => { 
        const booking = req.body
        const result = await guideBooking.insertOne(booking);
        res.send(result)
      })
      
      // to get all guide booking data
      app.get('/guide-bookings', async (req, res) => { 
        const result = await guideBooking.find().toArray();
        res.send(result)
      })

      
      // to get a single guide booking data
      app.get('/guide-booking/:email', async (req, res) => { 
        const page = parseInt(req.query.page)
        const size = parseInt(req.query.size)
        const userEmail = req.params.email;
        const query = {email: userEmail}
        const result = await guideBooking.find(query)
          .skip(page * size)
          .limit(size)
          .toArray()
        res.send(result)
      })

      // to calculate the number of pages
      app.get('/countGuide/:email', async (req, res) => { 
        const userEmail = req.params.email
        const query = {email: userEmail}
        const result = await guideBooking.countDocuments(query)
        res.send({result})
      })


      // to get a single guide booking data by id
      app.get('/guide-bookings/:id', async (req, res) => { 
        const id = new ObjectId(req.params.id);
        const result = await guideBooking.findOne({_id: id});
        res.send(result)
      })

      // to delete booking data
      app.delete('/guide-booking/:id', async (req, res) => { 
        const id = new ObjectId(req.params.id);
        const result = await guideBooking.deleteOne({_id: id});
        res.send(result)
      })
      

      // to update the status of the guide booking
      app.patch('/update-status/:id', async (req, res) => {
        const id = req.params.id;
        const { statas } = req.body;
      
          await guideBooking.updateOne(
            { _id: new ObjectId(id) },
            { $set: { statas: 'rejected' } }
          );
      
          const updatedBooking = await guideBooking.findOne({ _id: new ObjectId(id) });
          res.send(updatedBooking);
      });

      // to update the accepted 
      app.patch('/update-accepted/:id', async (req, res) => {
        const id = req.params.id;
        const { statas } = req.body;
      
          await guideBooking.updateOne(
            { _id: new ObjectId(id) },
            { $set: { statas: "accepted" } }
          );
      
          const updatedBooking = await guideBooking.findOne({ _id: new ObjectId(id) });
          res.send(updatedBooking);
      });
      
          // strip payment information
    app.post('/stripe-payment', async (req, res) => { 
      const { price } = req.body
      const amount = parseInt(price * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card']
      });

      res.send({
        clientSecret: paymentIntent.client_secret
      })
    })
      
      // to store the payment information
      app.post('/payment', async (req, res,) => {
        const payment = req.body;
        const result = await paymentCollection.insertOne(payment)

        // to change the status 
        res.send(result)
      })

      // to get all payment information
      app.get('/payments', async (req, res) => { 
        const result = await paymentCollection.find().toArray();
        res.send(result)
      })
      
      // to get a single payment information
      app.get('/payment/:id', async (req, res) => { 
        const id = new ObjectId(req.params.id);
        const result = await paymentCollection.findOne({_id: id});
        res.send(result)
      })

      // to update the statas
      app.patch('/update-guide-status/:id', async (req, res) => {
        const id = req.params.id;
        const { statas } = req.body;
      
          await guideBooking.updateOne(
            { _id: new ObjectId(id) },
            { $set: { statas: 'in-review' } }
          );
      
          const updatedPayment = await guideBooking.findOne({ _id: new ObjectId(id) });
          res.send(updatedPayment);
      
      });
      
      // to get all guides for a specific package
      app.get('/package-guides/:id', async (req, res) => { 
        const id = new ObjectId(req.params.id);
        const result = await guideCollection.find({ packageId: id }).toArray();
        res.send(result)
      })
      
      // to search user data by name
      app.get('/searchName', async (req, res) => { 
        const { search } = req.body;
        const option = {}
        if (search) {
          option = {name: {$regex: search, $options: "i"}}
        }

        const result = await userCollection.find(option).toArray();
        res.send(result)
      })


// for pagination
 // for pagination
 app.get('/pagination', async (req, res) => {
  const page = parseInt(req.query.page)
  const size = parseInt(req.query.size)

  const result = await userCollection.find()
    .skip(page * size)
    .limit(size)
    .toArray();

  res.send(result)
})

// for total product count
app.get('/totalCount', async (req, res) => { 
  const result = await userCollection.estimatedDocumentCount()
  res.send({result})
})

      
    } catch (error) {
        
  } finally {
  }
}
run().catch(console.dir);


app.listen(port);

