import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from "../utils/generateJwtToken.js";

export const signUp = async (req, res) => {
    try {
        const { password, email } = req.body;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format', success: false });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.', success: false });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists', success: false });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        // Save user and generate token
        const savedUser = await newUser.save();
        const token = generateTokenAndSetCookie(savedUser._id, res);

        res.status(201).json({
            success: true,
            user: { ...savedUser._doc, password: '', token },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password presence
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid credentials', success: false });
        }

        // Compare passwords
        const isCorrectPassword = await bcryptjs.compare(password, user.password);
        if (!isCorrectPassword) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }

        // Generate token and return success response
        const token = generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            success: true,
            user: { ...user._doc, password: '', token },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

export async function logout (req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: 'logged out successfully' , success: true });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}

export const authCheck = async (req, res) => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

export const generatePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }
     
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);
    
        const user = await User.findOneAndUpdate({ email }, { password: hashedPassword });

        if (!user) {
            return res.status(404).json({ message: "Email is incorrect.", success: false });
        }
     
        res.status(200).json({ message: "Password is changed successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
