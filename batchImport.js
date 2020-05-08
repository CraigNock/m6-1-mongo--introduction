const { MongoClient } = require('mongodb');
const fs = require('file-system');
const assert = require('assert');


const greets = JSON.parse(fs.readFileSync('data/greetings.json'));

const batchImport = async () => {
  console.log('greets', greets);

  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  try {
    client.connect();
    console.log('connecto');

    const db = client.db('exercise_one')
    const r = await db.collection('greetings').insertMany(greets);
    assert.equal(greetings.length, r.insertedCount);
    console.log('donezos');

  } catch (err) { 
    console.log('err', err);
  }

  client.close();
  console.log('disconnecto');
};


batchImport();