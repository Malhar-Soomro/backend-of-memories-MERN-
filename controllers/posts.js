import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
    try {
        const postMessage = await PostMessage.find();
        res.status(200).json(postMessage);
    }
    catch (err) {
        res.status(404).send(err.message);
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage(post);

    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message })
    }

}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const updatedPost = req.body;

    //is the post with this id present or not
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("no post with this id");
    }

    try {
        const newPost = await PostMessage.findByIdAndUpdate(_id, updatedPost, { new: true });
        return res.status(200).json(newPost);
    }
    catch (error) {
        return res.status(404).send(error.message);
    }

}