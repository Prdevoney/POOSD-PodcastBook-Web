var express = require('express');
var router = express.Router();

const url = 'mongodb+srv://apitest:apitest@cluster0.6ssywfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));


// API for registering a new user
router.post('/register', async (req, res) => {
    try {
        const { Email, Username, Password } = req.body;

        // Check for empty fields
        if (!Email || !Username || !Password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        await client.connect();

        const db = client.db("Podcast");
        const collection = db.collection('User');

        // Check if the username already exists
        const existingUser = await collection.findOne({ Username: { $regex: new RegExp('^' + Username + '$', 'i') } });
        
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Create user object
        const newUser = {
            Email,
            Username,
            Password,
            Followers: [],
            Following: []
        };

        // Insert new user into collection
        const result = await collection.insertOne(newUser);

        // Respond with success message
        res.status(201).json({ message: "User registered successfully", userId: result.insertedId });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "An error occurred while registering user" });
    }
});


// API for logging in a user
router.post('/login', async (req, res) => {
    try {
      console.log("login");
        // Extract username and password from request body
        const { Username, Password } = req.body;

        // Check for empty fields
        if (!Username || !Password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        await client.connect();

        const db = client.db("Podcast");
        const collection = db.collection('User');

        // Check if the user exists (case-insensitive search)
        const user = await collection.findOne({ Username: { $regex: new RegExp('^' + Username + '$', 'i') } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the password matches
        if (user.Password !== Password) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        // If username and password match, respond with success message
        res.status(200).json({ message: "Login successful", userId: user._id });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "An error occurred while logging in" });
    }
});

module.exports = router;
