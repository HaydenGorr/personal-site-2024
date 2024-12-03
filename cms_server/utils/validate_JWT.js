import jwt from 'jsonwebtoken';

export async function validate_JWT(token) {
    if (!token) {
        return {success: false, message: "No token provided", errorcode: 401};
    }

    try {
        const decoded = await jwt.verify(token, process.env.SECRETKEY);
        const userId = await decoded.userId;

        return {success: true, message: "User is authenticated", errorcode: 200, userId: userId};
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return {success: false, message: "Invalid token", errorcode: 401};
        }
        return {success: false, message: "Internal server error", errorcode: 500};
    }
}
