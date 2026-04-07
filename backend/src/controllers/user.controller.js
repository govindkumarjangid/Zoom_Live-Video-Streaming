import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ message: 'All fields are requried' });

    const existingUser = await User.findOne({ email });

    if (existingUser)
        return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email }, message: 'User registered successfully' });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'All fields are requried' });

    const user = await User.findOne({ email });

    if (!user)
        return res.status(400).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
        return res.status(400).json({ message: 'Invalid email or password' });

    if (isPasswordValid) {
        let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.token = token;
        await user.save();
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email }, message: 'User logged in successfully' });

    }
})