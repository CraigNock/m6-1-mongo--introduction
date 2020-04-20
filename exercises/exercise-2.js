const { MongoClient } = require('mongodb');
const assert = require('assert');

const createGreeting = async (req, res) => {
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  
  try{
    await client.connect();
    console.log('connected');

    const db = client.db('exercise_one')
    const r = await db.collection('greetings').insertOne(req.body);
    assert.equal(1, r.insertedCount);

    // console.log(req.body);

    res.status(201).json({status: 201, data: req.body});

  } catch (err) {
    console.log(err.stack);
    res.status(500).json({status: 500, data:req.body, message: err.message});
  };
  
  client.close();
  console.log('disconnecto');

};


module.exports = {createGreeting};