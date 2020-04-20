const { MongoClient } = require('mongodb');


const dbFunction = async (dbName) => {

  const client = new MongoClient('mongodb://localhost:27017', 
    {
      useUnifiedTopology: true,
  });

  await client.connect();
  console.log('connecto');

  const db = client.db(dbName);
  await db.collection('one').insertOne({type: 'doggo', subtype: 'woofer'});


  client.close();
  console.log('disconnecto');

};





dbFunction('exercise_one');