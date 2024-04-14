const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const url = 'mongodb+srv://apitest:apitest@cluster0.6ssywfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);

exports.isResetTokenValid = async (req, res, next) => {
    const { token, id } = req.query;

    if (!token || !id ) {
        return res.status(400).json({ error: "Invalid Request" });
    }

    if(!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid Request" });
    }

    await client.connect();
    const db = client.db("Podcast");
    const userCollection = db.collection('User');
    const tokenCollection = db.collection('ResetTokens');

    const user = await userCollection.findOne({_id: ObjectId.createFromHexString(id)});
    if (!user) {
        return res.status(400).json({error: "User not found"});
    }

    const resetToken = await tokenCollection.findOne({owner: user._id})
    if (!resetToken) {
        return res.status(400).json({error: "Reset Token not found"});
    }
    
    if (!Object.is(token, resetToken.token)) {
        return res.status(401).json({ error: "Reset token is not valid" });
    }

    req.user = user;
    next();
}   