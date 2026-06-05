const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@practicemongodb.zhvbu.mongodb.net/?appName=PracticeMongoDB`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const getCollections = () => {
  const db = client.db('tourists');
  return {
    users: db.collection('users'),
    stories: db.collection('touristStory'),
    guides: db.collection('guide'),
    packages: db.collection('package'),
    bookings: db.collection('guideBooking'),
    payments: db.collection('payment'),
  };
};

module.exports = { client, getCollections };
