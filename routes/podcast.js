var express = require('express');
var router = express.Router();

const url = 'mongodb+srv://apitest:apitest@cluster0.6ssywfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));

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

    // Generate reviewId
    const reviewId = new ObjectId();

    // Create review object
    const newReview = {
      reviewId,
      Podcast,
      Rating: rating,
      Comment,
      Username,
      UserID: ObjectId(UserID),
      LikeCount: 0,
      LikedBy: []
    };

    // Insert new review into collection
    const result = await collection.insertOne(newReview);

    // Respond with success message
    res.status(201).json({ message: "Review added successfully", reviewId });
  } catch (error) {
    console.error("Error writing review:", error);
    res.status(500).json({ error: "An error occurred while writing review" });
  }
});


// Receives reviewID as input, and returns the review information as a JSON response
router.post('/getReview', async (req, res) => {
  try {
    const { reviewId } = req.body;

    if (!reviewId) {
      return res.status(400).json({ error: "Review ID is required" });
    }

    await client.connect();

    const db = client.db("Podcast");
    const collection = db.collection('Review');

    // Search for the review by review ID
    const query = { _id: ObjectId(reviewId) };
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
    const { reviewId, Rating, Comment } = req.body;

    if (!reviewId) {
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

    const reviewToUpdate = await collection.findOne({ _id: ObjectId(reviewId) });

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

    const result = await collection.updateOne({ _id: ObjectId(reviewId) }, { $set: updatedFields });

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
    const { reviewId } = req.body;

    if (!reviewId) {
      return res.status(400).json({ error: "Review ID is required" });
    }

    await client.connect();

    const db = client.db("Podcast");
    const collection = db.collection('Review');

    const result = await collection.deleteOne({ _id: ObjectId(reviewId) });

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

// Receives podcast name string as input, and returns an json array with every review for that podcast
router.post('/podcastReviews', async (req, res) => {
  try {
    const { podcast } = req.body;

    if (!podcast) {
      return res.status(400).json({ error: "Podcast name is required" });
    }

    await client.connect();

    const db = client.db("Podcast");
    const collection = db.collection('Review');

    // Perform a case-insensitive search for reviews with the same podcast name
    const query = { Podcast: { $regex: new RegExp(podcast, 'i') } };
    const reviews = await collection.find(query).toArray();

    if (reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for the specified podcast" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error searching reviews:", error);
    res.status(500).json({ error: "An error occurred while searching reviews" });
  }
});

// Receives a user's _id as input, and returns every review made by that user
router.post('/userReviews', async (req, res) => {
  try {
    const { UserID } = req.body;

    if (!UserID) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await client.connect();

    const db = client.db("Podcast");
    const collection = db.collection('Review');

    const query = { UserID: ObjectId(UserID) };
    const userReviews = await collection.find(query).toArray();

    if (userReviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for the specified user" });
    }

    res.status(200).json(userReviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ error: "An error occurred while fetching user reviews" });
  }
});

// Receives the podcast name as input, and returns the average score for the podcast
router.post('/averageScore', async (req, res) => {
  try {
    const { podcast } = req.body;

    if (!podcast) {
      return res.status(400).json({ error: "Podcast name is required" });
    }

    await client.connect();

    const db = client.db("Podcast");
    const collection = db.collection('Review');

    // Calculate the average score of all reviews for the specified podcast
    const query = { Podcast: { $regex: new RegExp(podcast, 'i') } };
    const reviews = await collection.find(query).toArray();

    if (reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for the specified podcast" });
    }

    const totalScores = reviews.reduce((acc, review) => acc + review.Rating, 0);
    const averageScore = totalScores / reviews.length;

    res.status(200).json({ averageScore });
  } catch (error) {
    console.error("Error calculating average score:", error);
    res.status(500).json({ error: "An error occurred while calculating average score" });
  }
});

// This endpoint functions as a like toggle for reviews. Receives a reviewId and UserID as input. If the UserId is not in the
// LikedBy array, it adds it to the array and it increments LikeCount by 1. If the UserId is in the LikedBy array,
// it removes it from the arrat and decrements LikeCount by 1
router.post('/likeToggle', async (req, res) => {
  try {
    const { reviewId, UserID } = req.body;

    // Check if reviewId and userId are provided
    if (!reviewId || !UserID) {
      return res.status(400).json({ error: "Review ID and UserID are required" });
    }

    await client.connect();

    const db = client.db("Podcast");
    const collection = db.collection('Review');

    // Find the review by reviewId
    const query = { reviewId: ObjectId(reviewId) };
    const review = await collection.findOne(query);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if userId is already in LikedBy array
    const likedIndex = review.LikedBy.indexOf(ObjectId(UserID));
    if (likedIndex === -1) {
      // If userId is not in LikedBy array, increment LikeCount by 1 and add userId to LikedBy array
      await collection.updateOne({ _id: ObjectId(reviewId) }, { $inc: { LikeCount: 1 }, $push: { LikedBy: ObjectId(UserID) } });
    } else {
      // If userId is already in LikedBy array, decrement LikeCount by 1 and remove userId from LikedBy array
      await collection.updateOne({ _id: ObjectId(reviewId) }, { $inc: { LikeCount: -1 }, $pull: { LikedBy: ObjectId(UserID) } });
    }

    // Respond with success message
    res.status(200).json({ message: "Like/Unlike operation performed successfully" });
  } catch (error) {
    console.error("Error performing Like/Unlike operation:", error);
    res.status(500).json({ error: "An error occurred while performing Like/Unlike operation" });
  }
});

// Some sample function definitions for using the Listen Notes API to get podcast data
router.post('/search', function(req, res, next) {
  res.send('This may return a podcast name, description, photo, podcast ID, etc.');
});

router.post('/recommendations', function(req, res, next) {
  res.send('Maybe we can have a feature to recommend podcasts based on the podcasts that the user has positive reviews on.');
});

module.exports = router;