import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.query.token) {
            token = req.query.token;
        } else if (req.body.token) {
            token = req.body.token;
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error in protected middleware:', error);
        res.status(500).json({ message: 'Server error' });
    }
}