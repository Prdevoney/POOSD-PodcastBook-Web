var express = require('express');
var router = express.Router();

const { validateUser, validate } = require('../middlewares/validator');
const bcrypt = require('bcrypt');

const url = 'mongodb+srv://apitest:apitest@cluster0.6ssywfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));

const jwt = require('jsonwebtoken');
const { generateOTP, mailTransport, generateEmailTemplate, plainEmailTemplate } = require('../mail');
const { ObjectId } = require('mongodb');

// API for registering a new user
router.post('/register', validateUser, validate, async (req, res) => {
    try {
        const { Email, Username, Password } = req.body;

        await client.connect();

        const db = client.db("Podcast");
        const collection = db.collection('User');

        // Check if the username already exists
        const existingUser = await collection.findOne({ Username: { $regex: new RegExp('^' + Username + '$', 'i') } });

        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Checking for password requirements
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (!passwordRegex.test(Password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number."
            });
        }

        // Create user object
        const newUser = {
            Email,
            Username,
            Password,
            Followers: [],
            Following: [],
            verified: false
        };

        //hash password before saving into database
        const hashPassword = await bcrypt.hash(newUser.Password, 8);
        newUser.Password = hashPassword;

        // Insert new user into collection
        const result = await collection.insertOne(newUser);

        //verification
        const OTP = generateOTP();
        // Create user object
        const VerificationToken = {
            owner: newUser._id,
            token: OTP,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 3600000),
        };

        //hash token before saving into database
        const hashToken = await bcrypt.hash(VerificationToken.token, 8);
        VerificationToken.token = hashToken;

        //insert verification token
        const verificationToken = await db.collection('VerificationTokens').insertOne(VerificationToken);
        //delete verification token from database after 1 hr
        setTimeout(async () => {
            await db.collection('VerificationTokens').deleteOne({ _id: VerificationToken.owner });
        }, 3600000);

        mailTransport().sendMail({
            from: 'emailverification@email.com',
            to: newUser.Email,
            subject: "Verify your email account",
            html: generateEmailTemplate(OTP),

        })
        // Respond with success message
        res.status(201).json({ message: "User registered successfully", UserID: result.insertedId });
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
        //compare with hashed password
        const isMatched = await bcrypt.compareSync(Password, user.Password);
        if (!isMatched) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        //create json web token
        const token = jwt.sign({ UserID: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // If username and password match, respond with success message
        res.status(200).json({ message: "Login successful", UserID: user._id, token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "An error occurred while logging in" });
    }
});

router.post('/verifyEmail', async (req, res) => {
    try {
        const { UserID, otp } = req.body;

        if (!UserID || !otp) {
            return res.status(400).json({ error: "Invalid request, missing parameters" });
        }

        if (!ObjectId.isValid(UserID)) {
            return res.status(400).json({ error: "Invalid UserID" });
        }

        await client.connect();
        const db = client.db("Podcast");
        const collection = db.collection('User');

        const user = await collection.findOne({ _id: ObjectId.createFromHexString(UserID) });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        if (user.verified) {
            return res.status(400).json({ error: "This account is already verified" });
        }

        const token = await db.collection('VerificationTokens').findOne({ owner: user._id });
        if (!token) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatched = await bcrypt.compareSync(otp, token.token);
        if (!isMatched) {
            return res.status(400).json({ error: "Please provide valid token" });
        }



        await collection.findOneAndUpdate({ _id: user._id }, { $set: { verified: true } });
        await db.collection('VerificationTokens').findOneAndDelete({ owner: user._id });

        mailTransport().sendMail({
            from: 'emailverification@email.com',
            to: user.Email,
            subject: "Your account is Verified",
            html: plainEmailTemplate(),
        })

        // Respond with success message
        res.status(201).json({ message: "User verified successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "An error occurred while verifying user" });
    }
});

router.put('/updatePassword', async (req, res) => {
    try {
        const { id, Password } = req.body;

        // Check if _id and password are provided
        if (!id || !Password) {
            return res.status(400).json({ error: "_id and Password parameters are required" });
        }

        // Check password requirements
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        if (!passwordRegex.test(Password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number."
            });
        }

        await client.connect();

        const db = client.db("Podcast");
        const collection = db.collection('User');

        // Check if the user exists
        const user = await collection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Hash the new password
        const hashPassword = await bcrypt.hash(Password, 8);

        // Update password
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: { Password: hashPassword } });

        // Respond with success message
        res.status(200).json({ message: "User password updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "An error occurred while updating user" });
    }
});

router.delete('/deleteUser', async (req, res) => {
    try {
        const { id } = req.body;

        // Check if _id is provided
        if (!id) {
            return res.status(400).json({ error: "_id parameter is required" });
        }

        await client.connect();

        const db = client.db("Podcast");
        const collection = db.collection('User');

        // Check if the user exists
        const user = await collection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Delete the user
        await collection.deleteOne({ _id: new ObjectId(id) });

        // Respond with success message
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "An error occurred while deleting user" });
    }
});


// Endpoint for toggling follow/unfollow status between a user and a target user.
router.post('/followUnfollowToggle', async (req, res) => {
    try {
        // Extract UserID and targetUserID from the request body
        const { UserID, targetUserID } = req.body;

        // Connect to the MongoDB client
        await client.connect();

        // Get reference to the MongoDB database and the 'User' collection
        const db = client.db("Podcast");
        const collection = db.collection('User');

        // Find the user by UserID
        const user = await collection.findOne({ _id: new ObjectId(UserID) });

        // Return an error response if user not found
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find the target user by targetUserID
        const targetUser = await collection.findOne({ _id: new ObjectId(targetUserID) });

        // Return an error response if target user not found
        if (!targetUser) {
            return res.status(404).json({ error: "Target user not found" });
        }

        // Check if the user is already following the target user
        const isFollowing = user.Following.includes(targetUserID);

        // If user is already following the target user, unfollow
        if (isFollowing) {
            // Remove the target user from the user's Following array
            await collection.updateOne(
                { _id: new ObjectId(UserID) },
                { $pull: { Following: targetUserID } }
            );

            // Remove the user from the target user's Followers array
            await collection.updateOne(
                { _id: new ObjectId(targetUserID) },
                { $pull: { Followers: UserID } }
            );

            // Respond with success message and updated following status
            res.status(200).json({ message: "User unfollowed successfully", following: false });
        } else {
            // If user is not following the target user, follow
            // Add the target user to the user's Following array
            await collection.updateOne(
                { _id: new ObjectId(UserID) },
                { $addToSet: { Following: targetUserID } }
            );

            // Add the user to the target user's Followers array
            await collection.updateOne(
                { _id: new ObjectId(targetUserID) },
                { $addToSet: { Followers: UserID } }
            );

            // Respond with success message and updated following status
            res.status(200).json({ message: "User followed successfully", following: true });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error toggling follow/unfollow:", error);
        res.status(500).json({ error: "An error occurred while toggling follow/unfollow" });
    }
});

// Endpoint for retrieving a users followers with pagination
router.post('/getFollowers', async (req, res) => {
    try {
        const { UserID, page = 1, limit = 10 } = req.body; // Default to page 1 and limit 10 if not provided

        // Ensure that limit is parsed as an integer
        const parsedLimit = parseInt(limit, 10);

        if (isNaN(parsedLimit) || parsedLimit <= 0) {
            return res.status(400).json({ error: "Limit must be a positive integer" });
        }

        await client.connect();

        const db = client.db("Podcast");
        const collection = db.collection('User');

        // Find the user by UserID
        const user = await collection.findOne({ _id: new ObjectId(UserID) });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * parsedLimit;

        // Retrieve followers' information with pagination
        const followerIds = user.Followers.map(id => new ObjectId(id));
        const followersInfo = await collection.find({ _id: { $in: followerIds } })
            .skip(skip)
            .limit(parsedLimit)
            .toArray();

        res.status(200).json({ followers: followersInfo, page, limit: parsedLimit });
    } catch (error) {
        console.error("Error fetching followers:", error);
        res.status(500).json({ error: "An error occurred while fetching followers" });
    }
});

// Endpoint for retrieving users whom the specified user is following with pagination
router.post('/getFollowing', async (req, res) => {
    try {
        const { UserID, page = 1, limit = 10 } = req.body; // Default to page 1 and limit 10 if not provided

        // Ensure that limit is parsed as an integer
        const parsedLimit = parseInt(limit, 10);

        if (isNaN(parsedLimit) || parsedLimit <= 0) {
            return res.status(400).json({ error: "Limit must be a positive integer" });
        }

        await client.connect();

        const db = client.db("Podcast");
        const collection = db.collection('User');

        // Find the user by UserID
        const user = await collection.findOne({ _id: new ObjectId(UserID) });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * parsedLimit;

        // Retrieve following users' information with pagination
        const followingIds = user.Following.map(id => new ObjectId(id));
        const followingInfo = await collection.find({ _id: { $in: followingIds } })
            .skip(skip)
            .limit(parsedLimit)
            .toArray();

        res.status(200).json({ following: followingInfo, page, limit: parsedLimit });
    } catch (error) {
        console.error("Error fetching following:", error);
        res.status(500).json({ error: "An error occurred while fetching following" });
    }
});

router.post('/FollowUser', async (req, res) => {
    try {
      const { UserID, targetUserID } = req.body;
  
      // Check for required fields
      if ( !UserID || !targetUserID) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      
      await client.connect();
  
      const db = client.db("Podcast");
      const collection = db.collection('User');


      const user = await collection.findOne({ _id: new ObjectId(UserID) });

      const targetuser = await collection.findOne({ _id: new ObjectId(targetUserID) });

      console.log("Searching for user", user);

      console.log("Searching for target user", targetuser);

      collection.updateOne({_id: new ObjectId(UserID)}, { $push: { Following: new ObjectId(targetUserID)}});

      collection.updateOne({_id: new ObjectId(targetUserID)}, { $push: { Followers: new ObjectId(UserID)}});

      // Respond with success message
      res.status(201).json({ message: "Follow added successfully", user });
    } catch (error) {
      console.error("Error Following user:", error);
      res.status(500).json({ error: "An error occurred while Following user" });
    }
  });

  router.post('/UnFollowUser', async (req, res) => {
    try {
      const { UserID, targetUserID } = req.body;
  
      // Check for required fields
      if ( !UserID || !targetUserID) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      
      await client.connect();
  
      const db = client.db("Podcast");
      const collection = db.collection('User');


      const user = await collection.findOne({ _id: new ObjectId(UserID) });

      const targetuser = await collection.findOne({ _id: new ObjectId(targetUserID) });

      console.log("Searching for user", user);

      console.log("Searching for target user", targetuser);

      collection.updateOne({_id: new ObjectId(UserID)}, { $pull: { Following: new ObjectId(targetUserID)}});

      collection.updateOne({_id: new ObjectId(targetUserID)}, { $pull: { Followers: new ObjectId(UserID)}});

      // Respond with success message
      res.status(201).json({ message: "Unfollow successfully", user });
    } catch (error) {
      console.error("Error Following user:", error);
      res.status(500).json({ error: "An error occurred while Following user" });
    }
  });

router.post('/SearchUser', async (req, res) => {
    try {
        // Extract username and password from request body
        const {MyUser, Username} = req.body;
        console.log("Searching for user", Username);
        await client.connect();

        const db = client.db("Podcast");
        const collection = db.collection('User');

        const users = await collection.find({ Username: {$ne: MyUser, $regex: new RegExp(Username, 'i')}}).toArray();

        // const results = await db.collection('Cards').find({"Card":{$regex:_search+'.*', $options:'r'}}).toArray();

        if (!users) {
            return res.status(404).json({ error: "User not found" });
        } else {
            return res.status(200).json(users);
        }

    } catch (error) {
        console.error("Error fetching following:", error);
        res.status(500).json({ error: "An error occurred could not find user should not reach here hopefully" });
    }
});

module.exports = router;