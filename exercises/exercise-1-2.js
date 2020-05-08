const { MongoClient } = require('mongodb');

const getCollection = async (req, res) => {
  const name = req.params.dbName;
  const collection = req.params.collection;

  const client = new MongoClient('mongodb://localhost:27017', 
  {
    useUnifiedTopology: true,
  });
//connect
  await client.connect();
  console.log('connecto');

  const db = client.db(name);

  db.collection(collection)
    .find()
    .toArray((err, data) => {
      if (err) {
        res.status(404).json({status: 404, data: 'not found',});
      } else {
        res.status(200).json({status:200, data: data,});
        //disconnect
        client.close();
        console.log('disconnecto');
      }
    });

  //testing thingy (localhost:8000/ex-1/exercise_one/one in insomnia)
  // res.status(200).json({
  //   status: 200,
  //   connection: 'successful!',
  // });

};

module.exports = {getCollection};