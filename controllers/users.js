import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        //find the user
        const existingUser = await User.findOne({ email });

        //check the user exist or not   
        if (!existingUser) res.status(404).json({ message: "User doesn't exist" });

        //match the typed password with already stored password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, "test", { expiresIn: "1h" });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

export const signUp = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    try {
        //find the user
        const existingUser = await User.findOne({ email });
        //check if the user already exist 
        if (existingUser) return res.status(400).json({ message: "User already exist" });
        //match the password and confirm password
        if (password !== confirmPassword) return res.status(400).json({ message: "Password don't match" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({
            name: `${firstName} ${lastName}`, email, password: hashedPassword
        });
        const token = jwt.sign({ email: result.email, id: result._id }, "test", { expiresIn: "1h" });

        res.status(200).json({ result, token });

    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" })

    }



}