var express = require('express');
var router = express.Router();

const { validateUser, validate } = require('../middlewares/validator');
const bcrypt = require('bcrypt');

const url = 'mongodb+srv://apitest:apitest@cluster0.6ssywfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));

const jwt = require('jsonwebtoken');
const { generateOTP, mailTransport, generateEmailTemplate, plainEmailTemplate, generatePasswordResetTemplate, resetSuccessfullTemplate } = require('../utils/mail');
const { ObjectId } = require('mongodb');
const { createRandomBytes } = require('../utils/helper');
const { isResetTokenValid } = require('../middlewares/user');

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
            createdAt : new Date(),
            expiresAt : new Date(Date.now() + 3600000),
        };

        //hash token before saving into database
        const hashToken = await bcrypt.hash(VerificationToken.token, 8);
        VerificationToken.token = hashToken;

        //insert verification token
        const verificationToken = await db.collection('VerificationTokens').insertOne(VerificationToken);
        //delete verification token from database after 1 hr
        setTimeout(async () => {
            await db.collection('VerificationTokens').deleteOne({_id: VerificationToken.owner});
        }, 3600000);

        mailTransport().sendMail({
            from: 'emailverification@email.com',
            to: newUser.Email,
            subject: "Verify your email account",
            html: generateEmailTemplate(OTP),

        })
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
        //compare with hashed password
        const isMatched = await bcrypt.compareSync(Password, user.Password);
        if (!isMatched) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        //create json web token
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // If username and password match, respond with success message
        res.status(200).json({ message: "Login successful", userId: user._id, token});
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "An error occurred while logging in" });
    }
});

router.post('/verifyEmail', async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            return res.status(400).json({ error: "Invalid request, missing parameters"});
        }

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid userId" });
        }
        
        await client.connect();
        const db = client.db("Podcast");
        const collection = db.collection('User');
        
        const user = await collection.findOne({_id: ObjectId.createFromHexString(userId)});

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        if (user.verified) {
            return res.status(400).json({ error: "This account is already verified" });
        }
       
        const token = await db.collection('VerificationTokens').findOne({owner: user._id});
        if (!token) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatched = await bcrypt.compareSync(otp, token.token);
        if (!isMatched) {
            return res.status(400).json({ error: "Please provide valid token" });
        }


       
        await collection.findOneAndUpdate({_id: user._id},{$set: {verified: true}});
        await db.collection('VerificationTokens').findOneAndDelete({owner: user._id});

        mailTransport().sendMail({
            from: 'emailverification@email.com',
            to: user.Email,
            subject: "Your account is Verified",
            html: plainEmailTemplate(),
        })

        // Respond with success message
        res.status(201).json({ message: "User verified successfully"});
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "An error occurred while verifying user" });
    }
});

router.post('/forgotPassword', async (req, res) => {

    const { Email } = req.body;

    if (!Email) {
        return res.status(400).json({ error: "Please provide a valid email" });
    }

    await client.connect();
    const db = client.db("Podcast");
    const collection = db.collection('User');
    const user = await collection.findOne({ Email: Email });

    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }

    const token = await db.collection('ResetTokens').findOne({owner: user._id});
    if (token) {
        return res.status(400).json({ error: "For security reasons, you must wait 1 hour for a new link" });
    }

   const ranbytes = await createRandomBytes();
   const resetToken = {
        owner: user._id,
        token: ranbytes,
        createdAt : new Date(),
        expiresAt : new Date(Date.now() + 3600000),
   }

   await db.collection('ResetTokens').insertOne(resetToken);

   mailTransport().sendMail({
        from: 'security@email.com',
        to: user.Email,
        subject: "Password Reset",
        html: generatePasswordResetTemplate(`http://localhost:3000/resetPassword?token=${ranbytes}&id=${user._id}`),
    });

    res.json({success: true, message: 'Password reset link is sent to your email.'});

});

router.post('/resetPassword', isResetTokenValid, async(req, res) => {

    //uses function in middleware folder user.js
    //get password from req.body from middleware 
    const { Password } = req.body;

    await client.connect();
    const db = client.db("Podcast");
    const collection = db.collection('User');
    
    //find that user
    const user = await collection.findOne({_id: req.user._id});
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }


    const isMatched = await bcrypt.compareSync(Password, user.Password);
    if (isMatched) {
        return res.status(401).json({ error: "New password must be different" });
    }

    //recheck password parameters, only adding length for placeholder API change later----------------------------
    if (Password.trim().length < 8 ) {
        return res.status(401).json({error: "Password must be over 8 characters"});
    }

    //update password and hash
    const hashPassword = await bcrypt.hash(Password, 8);
    user.Password = hashPassword;

    await collection.findOneAndUpdate({_id: user._id},{$set: {Password: user.Password}});
    
    //delete reset token after using
    await db.collection('ResetTokens').findOneAndDelete({owner: user._id});

    mailTransport().sendMail({
        from: 'security@email.com',
        to: user.Email,
        subject: "Password Reset Successfully",
        html: resetSuccessfullTemplate(),
    });

    res.json({success: true, message: 'Password was successfully reset.'});


});


module.exports = router;
