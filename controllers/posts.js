import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";


export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    }
    catch (error) {
        console.log(error);
    }
}

export const getPosts = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 6;
        // to get the starting index of every page
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        console.log(error);
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query
    try {

        //Title, title, TITLE --> i in regular expresssion
        const title = new RegExp(searchQuery, "i");
        console.log("tags--> ", tags)
        console.log("tags.split(", ")-->", tags.split(","))
        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(",") } }] });
        // console.log(posts)
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error })
    }

}

export const createPost = async (req, res) => {
    const post = req.body;

    try {
        const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
        await newPost.save();
        // console.log("newPost-->", newPost);
        // console.log("{newPost}-->", { newPost });
        res.status(201).json(newPost);

    } catch (error) {
        console.log(error);
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const updatedPost = req.body;

    try {
        //is the post with this id present or not
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).send("no post with this id");
        }


        const newPost = await PostMessage.findByIdAndUpdate(_id, { ...updatedPost, _id }, { new: true });
        return res.status(200).json(newPost);

    } catch (error) {
        console.log(error);
    }


}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    try {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send("no post with this id");
        }
        await PostMessage.findByIdAndDelete(id);
        return res.status(200).json("post deleted");
    } catch (error) {

    }


}

export const likePost = async (req, res) => {
    const { id } = req.params;

    try {
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
    } catch (error) {
        console.log(error)
    }
}