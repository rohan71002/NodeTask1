const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000;
const userSchema = {
  firstName: String,
  lastName: String,
  mobile: String,
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String
  },
  loginId: String,
  password: String,
  creationTime: Date,
  lastUpdatedOn: Date
};

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection string (replace with your corrected MongoDB Atlas connection string)
const mongoURI = 'mongodb+srv://rohan712:rohan%40712@cluster0.anrfpxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Assuming MongoDB is running on the specified IP and default port 27017
app.use('/styles', express.static(path.join(__dirname, 'styles')));
let client; // Declare client outside the try block

// Serve the signup page
app.get('/', (req, res) => {
  // Use path.join to construct the absolute path to the signup.html file
  const signupPagePath = path.join(__dirname, 'signup.html');
  res.sendFile(signupPagePath);
});


// Handle signup form submission
app.post('/signup', async (req, res) => {
  const userSchema = req.body;
  console.log(userSchema);

  try {
    // Connect to MongoDB
    client = new MongoClient(mongoURI);
    await client.connect();

    // Access the database and collection
    const database = client.db('node');
    const collection = database.collection('signup');

    // Insert user data into the collection
    await collection.insertOne(userSchema); 

    res.send('Signup Successful');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    // Close the MongoDB connection
    if (client) {
      await client.close();
    }
  }
});
app.get('/userlist', async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoURI);
    const db = client.db('node');
    const collection = db.collection('signup');

    const users = await collection.find().toArray();
    res.render('display', { users });
    client.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});