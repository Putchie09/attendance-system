import { createUser } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
    try {
        const { name, password, role_id } = req.body;

        if (!name || !password || !role_id) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // encrypt password
        const password_hash = await bcrypt.hash(password, 10);

        const userId = await createUser({ name, password_hash, role_id });
        // Return the created user ID
        res.status(201).json({ message: "User registered", userId });
    
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};