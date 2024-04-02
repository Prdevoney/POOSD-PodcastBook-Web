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
router.post('/writeReview', async (req, res) => {
    try {
      const { Podcast, Rating, Comment, Username, UserID } = req.body;
  
      // Check for required fields
      if (!Podcast || !Rating || !Comment || !Username || !UserID) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Convert Rating to integer
      const rating = parseInt(Rating);
  
      // Validate Rating
      if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
      }
  
      await client.connect();
  
      const db = client.db("Podcast");
      const collection = db.collection('Review');
  
      // Create review object
      const newReview = {
        Podcast,
        Rating: rating,
        Comment,
        Username,
        UserID: new ObjectId(UserID),
        LikeCount: 0,
        LikedBy: [],
        createdAt: new Date()
      };
  
      // Insert new review into collection
      const result = await collection.insertOne(newReview);
  
      // Respond with success message
      res.status(201).json({ message: "Review added successfully", ReviewID: result.insertedId });
    } catch (error) {
      console.error("Error writing review:", error);
      res.status(500).json({ error: "An error occurred while writing review" });
    }
  });
  
  
  // Receives ReviewID or Podcast name string and UserID as input, and returns the review information as a JSON response
  router.post('/getReview', async (req, res) => {
    try {
      const { ReviewID, Podcast, UserID } = req.body;
  
      if (!ReviewID && !(Podcast && UserID)) {
        return res.status(400).json({ error: "Review ID or Podcast name with UserID is required" });
      }
  
      await client.connect();
  
      const db = client.db("Podcast");
      const collection = db.collection('Review');
  
      let query;
      if (ReviewID) {
        query = { _id: new ObjectId(ReviewID) };
      } else {
        query = { Podcast, UserID: new ObjectId(UserID) };
      }
  
      // Search for the review by review ID or Podcast name with UserID
      const review = await collection.findOne(query);
  
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
  
      res.status(200).json(review);
    } catch (error) {
      console.error("Error fetching review:", error);
      res.status(500).json({ error: "An error occurred while fetching review" });
    }
  });
  
  router.put('/editReview', async (req, res) => {
    try {
      const { ReviewID, Rating, Comment } = req.body;
  
      if (!ReviewID) {
        return res.status(400).json({ error: "Review ID is required" });
      }
  
      if (!Rating && !Comment) {
        return res.status(400).json({ error: "At least one field (Rating or Comment) must be provided for editing" });
      }
  
      // Convert Rating to integer if provided
      let rating;
      if (Rating) {
        rating = parseInt(Rating);
        // Validate Rating
        if (isNaN(rating) || rating < 1 || rating > 5) {
          return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
        }
      }
  
      await client.connect();
  
      const db = client.db("Podcast");
      const collection = db.collection('Review');
  
      const reviewToUpdate = await collection.findOne({ _id: new ObjectId(ReviewID) });
  
      if (!reviewToUpdate) {
        return res.status(404).json({ error: "Review not found" });
      }
  
      const updatedFields = {};
  
      if (Rating) {
        updatedFields.Rating = rating;
      }
  
      if (Comment) {
        updatedFields.Comment = Comment;
      }
  
      const result = await collection.updateOne({ _id: new ObjectId(ReviewID) }, { $set: updatedFields });
  
      if (result.modifiedCount === 1) {
        return res.status(200).json({ message: "Review updated successfully" });
      } else {
        return res.status(500).json({ error: "Failed to update review" });
      }
    } catch (error) {
      console.error("Error editing review:", error);
      res.status(500).json({ error: "An error occurred while editing review" });
    }
  });
  
  router.delete('/deleteReview', async (req, res) => {
    try {
      const { ReviewID } = req.body;
  
      if (!ReviewID) {
        return res.status(400).json({ error: "Review ID is required" });
      }
  
      await client.connect();
  
      const db = client.db("Podcast");
      const collection = db.collection('Review');
  
      const result = await collection.deleteOne({ _id: new ObjectId(ReviewID) });
  
      if (result.deletedCount === 1) {
        return res.status(200).json({ message: "Review deleted successfully" });
      } else {
        return res.status(404).json({ error: "Review not found" });
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "An error occurred while deleting review" });
    }
  });
  
  // Receives page and limit (for pagination) and Podcast name string as input, and returns an json array with every review for that Podcast
  // limit is the number of reviews wanted per page, and page is the number of the corresponding page being requested
  router.post('/podcastReviews', async (req, res) => {
    try {
      const { Podcast, page = 1, limit = 10 } = req.body;
  
      if (!Podcast) {
        return res.status(400).json({ error: "Podcast name is required" });
      }
  
      // Parse page and limit as integers
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
  
      // Check if page and limit are valid positive integers
      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        return res.status(400).json({ error: "Invalid page or limit value" });
      }
  
      await client.connect();
  
      const db = client.db("Podcast");
      const collection = db.collection('Review');
  
      // Perform a case-insensitive search for reviews with the same Podcast name
      const query = { Podcast: { $regex: new RegExp(Podcast, 'i') } };
  
      // Count total reviews
      const totalReviews = await collection.countDocuments(query);
  
      // Fetch reviews with pagination
      const reviews = await collection.find(query)
                                      .skip((pageNumber - 1) * limitNumber)
                                      .limit(limitNumber)
                                      .toArray();
  
      if (reviews.length === 0) {
        return res.status(404).json({ error: "No reviews found for the specified Podcast" });
      }
  
      res.status(200).json({ reviews, totalReviews, currentPage: pageNumber });
    } catch (error) {
      console.error("Error searching reviews:", error);
      res.status(500).json({ error: "An error occurred while searching reviews" });
    }
  });
  
  // Receives page and limit (for pagination) and UserID as input, and returns an json array with every review by that user
  // limit is the number of reviews wanted per page, and page is the number of the corresponding page being requested
  router.post('/userReviews', async (req, res) => {
    try {
      const { UserID, page = 1, limit = 10 } = req.body;
  
      if (!UserID) {
        return res.status(400).json({ error: "User ID is required" });
      }
  
      // Parse page and limit as integers
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
  
      // Check if page and limit are valid positive integers
      if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        return res.status(400).json({ error: "Invalid page or limit value" });
      }
  
      await client.connect();
  
      const db = client.db("Podcast");
      const collection = db.collection('Review');
  
      const query = { UserID: new ObjectId(UserID) };
  
      // Count total user reviews
      const totalUserReviews = await collection.countDocuments(query);
  
      // Fetch user reviews with pagination
      const userReviews = await collection.find(query)
                                          .skip((pageNumber - 1) * limitNumber)
                                          .limit(limitNumber)
                                          .toArray();
  
      if (userReviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for the specified user" });
      }
  
      res.status(200).json({ userReviews, totalUserReviews, currentPage: pageNumber });
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      res.status(500).json({ error: "An error occurred while fetching user reviews" });
    }
  });
  
  // Receives the Podcast name as input, and returns the average score for the Podcast
  router.post('/averageScore', async (req, res) => {
    try {
      const { Podcast } = req.body;
  
      if (!Podcast) {
        return res.status(400).json({ error: "Podcast name is required" });
      }
  
      await client.connect();
  
      const db = client.db("Podcast");
      const collection = db.collection('Review');
  
      // Calculate the average score of all reviews for the specified Podcast
      const query = { Podcast: { $regex: new RegExp(Podcast, 'i') } };
      const reviews = await collection.find(query).toArray();
  
      if (reviews.length === 0) {
        return res.status(404).json({ error: "No reviews found for the specified Podcast" });
      }
  
      const totalScores = reviews.reduce((acc, review) => acc + review.Rating, 0);
      const averageScore = totalScores / reviews.length;
  
      // Round the average score to the nearest integer
      const roundedAverageScore = Math.round(averageScore);
  
      res.status(200).json({ averageScore: roundedAverageScore });
    } catch (error) {
      console.error("Error calculating average score:", error);
      res.status(500).json({ error: "An error occurred while calculating average score" });
    }
  });
  
  // This endpoint functions as a like toggle for reviews. Receives a ReviewID and UserID as input. If the UserID is not in the
  // LikedBy array, it adds it to the array and it increments LikeCount by 1. If the UserID is in the LikedBy array,
  // it removes it from the arrat and decrements LikeCount by 1
  router.post('/likeToggle', async (req, res) => {
    try {
      const { ReviewID, UserID } = req.body;
  
      // Check if ReviewID and UserID are provided
      if (!ReviewID || !UserID) {
        return res.status(400).json({ error: "Review ID and UserID are required" });
      }
  
      await client.connect();
  
      const db = client.db("Podcast");
      const collection = db.collection('Review');
  
      // Find the review by ReviewID
      const review = await collection.findOne({ _id: new ObjectId(ReviewID) });
  
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
  
      // Check if UserID is already in LikedBy array
      const userExistsInLikedBy = await collection.findOne({
        _id: new ObjectId(ReviewID),
        LikedBy: new ObjectId(UserID)
      });
  
      if (!userExistsInLikedBy) {
        // If UserID is not in LikedBy array, increment LikeCount by 1 and add UserID to LikedBy array
        await collection.updateOne({ _id: new ObjectId(ReviewID) }, { $inc: { LikeCount: 1 }, $push: { LikedBy: new ObjectId(UserID) } });
      } else {
        // If UserID is already in LikedBy array, decrement LikeCount by 1 and remove UserID from LikedBy array
        await collection.updateOne({ _id: new ObjectId(ReviewID) }, { $inc: { LikeCount: -1 }, $pull: { LikedBy: new ObjectId(UserID) } });
      }
  
      // Respond with success message
      res.status(200).json({ message: "Like/Unlike operation performed successfully" });
    } catch (error) {
      console.error("Error performing Like/Unlike operation:", error);
      res.status(500).json({ error: "An error occurred while performing Like/Unlike operation" });
    }
  });
  
  // Endpoint to get chronological feed of reviews using pagination, based on a users Following array
  router.post('/feed', async (req, res) => {
    try {
          // Extract UserID, page, and limit from request body, defaults to page = 1 and limit = 10 if they are not given
          const { UserID, page = 1, limit = 10 } = req.body;
    
          // Check if UserID is provided
          if (!UserID) {
              return res.status(400).json({ error: "UserID is required" });
          }
     
           // Parse page and limit as integers
           const parsedPage = parseInt(page);
           const parsedLimit = parseInt(limit);
     
           // Check if page and limit are valid integers
           if (isNaN(parsedPage) || isNaN(parsedLimit)) {
               return res.status(400).json({ error: "page and limit must be integers" });
           }
     
           // Find the user based on UserID
           
           const user = await client.db("Podcast").collection('User').findOne({ Username: UserID });
           // If user not found, return error
           if (!user) {
               return res.status(404).json({ error: "User not found" });
           }
     
           // Extract IDs of users that the current user is following
           const followingIds = user.Following.map(id => new ObjectId(id));
     
           // Fetch reviews written by users in the following list
           const reviews = await client.db("Podcast").collection('Review')
               .find({ UserID: { $in: followingIds } }) // Query to find reviews by following users
               .sort({ createdAt: -1 }) // Sort reviews by createdAt in descending order (chronological)
               .skip((parsedPage - 1) * parsedLimit) // Skip reviews for pagination
               .limit(parsedLimit) // Limit number of reviews per page
               .toArray(); // Convert reviews to array
     
           res.status(200).json(reviews);
       } catch (error) {
           console.error("Error fetching feed:", error);
           res.status(500).json({ error: error.message }); // Return the actual error message
       }
    });
  

module.exports = router;

