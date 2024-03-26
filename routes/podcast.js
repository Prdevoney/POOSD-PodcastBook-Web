var express = require('express');
var router = express.Router();

const url = 'mongodb+srv://apitest:apitest@cluster0.6ssywfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));

const { ObjectId } = require('mongodb');

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

// Some sample function definitions for using the Listen Notes API to get Podcast data
router.post('/search', function(req, res, next) {
  res.send('This may return a Podcast name, description, photo, Podcast ID, etc.');
});

router.post('/recommendations', function(req, res, next) {
  res.send('Maybe we can have a feature to recommend Podcasts based on the Podcasts that the user has positive reviews on.');
});

module.exports = router;