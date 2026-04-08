import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const registerUser = asyncHandler(async (req, res) => {

    const { name, username, password } = req.body;

    if (!name || !username || !password)
        return res.status(400).json({ message: 'All fields are requried' });

    const usernameRegex = /^(?=.*[@#_.-])[a-zA-Z0-9@#_.-]{3,20}$/;

    if (!usernameRegex.test(username))
        return res.status(400).json({ message: 'Username contain at least one special character (@, #, _, ., -)' });

    if (password.length < 6)
        return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existingUser = await User.findOne({ username });

    if (existingUser)
        return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, username, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, username: newUser.username }, message: 'User registered successfully' });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: 'All fields are requried' });

    const user = await User.findOne({ username });

    if (!user)
        return res.status(400).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
        return res.status(400).json({ message: 'Invalid email or password' });

    if (isPasswordValid) {
        let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.token = token;
        await user.save();
        res.status(200).json({ token, user: { id: user._id, name: user.name, username: user.username }, message: 'User logged in successfully' });

    }
})