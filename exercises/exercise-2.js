const { MongoClient } = require('mongodb');
const assert = require('assert');

const createGreeting = async (req, res) => {
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  try{
    await client.connect();
    console.log('connected');

    const db = client.db('exercise_one');
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


const getGreeting = async (req, res) => {
  const _id = req.params._id;
  // console.log('_id', _id);
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try{
    await client.connect();
    console.log('connected');

    const db = client.db('exercise_one');
    db.collection('greetings').findOne({ _id }, (err, result) => {
      result
        ? res.status(200).json({ status: 200, _id, data: result })
        : res.status(404).json({ status: 404, _id, data: 'Not Found' });
      client.close();
    });
    
  } catch (err) {
    console.log('error', err);
  };
  // res.status(200).json(req.params._id);

};

const getManyGreetings = async (req, res) => {
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  try{
    await client.connect();
    console.log('connecto');

    const db = client.db('exercise_one');
    db.collection('greetings')
      .find()
      .toArray((err, result) => {
      if (result.length) {
        // console.log('result.length', result.length);
        let start = parseFloat(req.query.start);
        let limit = parseFloat(req.query.limit);
        // console.log('start', start);
        // console.log('limit', limit);
        const sliceStart = (start && start < result.length)? start -1 : 0 ;
        // console.log('sliceStart', sliceStart);
        const sliceLimit = (limit && limit <= result.length)
          ? (sliceStart + limit) 
          : (sliceStart + 24) ;
        // console.log('sliceLimit', sliceLimit);
        const data = result.slice(sliceStart, sliceLimit );
        res.status(200).json({ status: 200, data });

      } else{
        res.status(404).json({ status: 404, data: 'Not Found' });
      }
      

      client.close();
      console.log('disconnecto');
    });
      
  } catch (err) {
    console.log('error', err);
  };
};




module.exports = {createGreeting, getGreeting, getManyGreetings};