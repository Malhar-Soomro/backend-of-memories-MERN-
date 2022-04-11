import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {

    const postMessage = await PostMessage.find();
    res.status(200).json(postMessage);

}

export const createPost = async (req, res) => {
    const post = req.body;

    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
    await newPost.save();
    res.status(201).json(newPost);


}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const updatedPost = req.body;

    //is the post with this id present or not
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("no post with this id");
    }


    const newPost = await PostMessage.findByIdAndUpdate(_id, { ...updatedPost, _id }, { new: true });
    return res.status(200).json(newPost);


}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("no post with this id");
    }
    await PostMessage.findByIdAndDelete(id);
    return res.status(200).json("post deleted");


}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: "unauthenticated" })

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("no post with this id");
    }

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
        post.likes.push(req.userId);
    }
    else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }



    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })
    res.status(200).json(updatedPost)


}