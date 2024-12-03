import jwt from 'jsonwebtoken'

export const create_jwt_token = async (_id: number): Promise<string> => {
    return jwt.sign(
        { userId: _id }, 
        process.env.SECRETKEY as string, 
        { expiresIn: '1h' }
    );  
}