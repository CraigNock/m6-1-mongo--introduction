const { MongoClient } = require('mongodb');
const fs = require('file-system');

const greets = JSON.parse(fs.readFileSync('data/greetings.json'));

const batchImport = async => {
  console.log('greets', greets);

  const client = new MongoClient('mongodb://localhost:27017', {
    useUnifiedTopology: true,
  });

  try {
    client.connect();
    console.log('connecto');




  } catch (err) { 
    console.log('err', err);
  }

  client.close();
  console.log(disconnecto);
};


batchImport();