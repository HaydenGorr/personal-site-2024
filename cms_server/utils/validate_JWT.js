const jwt = require('jsonwebtoken');

const secretKey = 'your-secret-key';

async function validate_JWT(token) {
    if (!token) {
        return {success: false, message: "No token provided", errorcode: 401};
    }

    try {
        const decoded = await jwt.verify(token, secretKey);
        const userId = await decoded.userId;

        console.log("U authenticated")
        return {success: true, message: "User is authenticated", errorcode: 200, userId: userId};
    } catch (error) {
        console.log("U UNauthenticated", error)
        if (error instanceof jwt.JsonWebTokenError) {
            return {success: false, message: "Invalid token", errorcode: 401};
        }
        return {success: false, message: "Internal server error", errorcode: 500};
    }
}

module.exports = {
    validate_JWT
};
  