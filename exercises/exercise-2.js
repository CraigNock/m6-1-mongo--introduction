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
  let parameter = req.params._id;
  // console.log('parameter', parameter);
  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });
  //note needs lang to have first letter capitalized
  parameter = (parameter.length > 2)
    ? ( parameter.replace(/^\w/, c => c.toUpperCase()) ) 
    : parameter ;

  try{
    await client.connect();
    console.log('connected');

    const db = client.db('exercise_one');
  
    db.collection('greetings')
      .findOne({$or:[{ _id: parameter.toUpperCase() }, {lang: parameter}]}, (err, result) => {
        result
          ? res.status(200).json({ status: 200, parameter, data: result })
          : res.status(404).json({ status: 404, parameter, data: 'Not Found' });
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
        res.status(200).json({ 
          status: 200, 
          start,
          limit,
          data 
        });

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



const deleteGreeting = async (req, res) => {
  const _id = req.params._id;
  console.log('_id', _id);
  const client = new MongoClient('mongodb://localhost:27017', 
    {
      useUnifiedTopology: true,
  });
  
  try {
    await client.connect();
    console.log('connecto');
    const db = client.db('exercise_one');
    const r = await db.collection('greetings').deleteOne({ _id: _id.toUpperCase() });
    assert.equal(1, r.deletedCount);//this tests if 1 == the deletedcount

    //note! status 204 cannot return a body so we sneak a 200 to return a confirmation
    res.status(200).json({
      status: 204,
      _id,
    });

  } catch (err) {
    console.log('err', err);
    res.status(400).json({
      status: 400,
      error: err.message,
    })
  };

  client.close();
  console.log('disconnecto');
};

const updateGreeting = async (req, res) => {
  const _id = (req.params._id).toUpperCase();
  const query = { _id };
  const hello = req.body.hello ? req.body.hello : '';
  const newValues = { $set: { hello } };
  console.log('query ', query, 'newValues ', newValues);
  
  const client = new MongoClient('mongodb://localhost:27017', 
    {
      useUnifiedTopology: true,
  });
  
  if (req.body.hello) {
    console.log('yes');
    try {
      await client.connect();
      console.log('connecto');
      const db = client.db('exercise_one');
      const r = await db.collection('greetings').updateOne(query, newValues);
      assert.equal(1, r.matchedCount);
      assert.equal(1, r.modifiedCount);

      res.status(200).json({
        status: 200,
        _id,
      });
    } catch (err) {
      console.log('err', err);
      res.status(400).json({
        status: 400,
        error: err.message,
      })
    };
  } else {
    res.status(400).json({
      status: 400,
      error: 'not a valid input',
    })
  };
  
  // res.status(200).json({ status: 200, _id, ...req.body });
  client.close();
  console.log('disconnecto');
};



module.exports = { createGreeting, getGreeting, getManyGreetings, deleteGreeting, updateGreeting };