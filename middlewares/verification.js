const jwt = require('jsonwebtoken');

// Middleware function to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized, missing token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized, invalid token" });
        } else {
            // Token is valid, continue with the next middleware
            req.userID = decoded.UserID;
            next();
        }
    });
}

module.exports = verifyToken;