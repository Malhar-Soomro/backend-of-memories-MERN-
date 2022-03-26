import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRouter from "./routes/posts.js";

const app = express();


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/posts", postRouter);

app.get("/", (req, res) => {
    res.status(200).send("responded")
});


const MONGO_URI = "mongodb://malhar:malhar1122@cluster0-shard-00-00.0mdmt.mongodb.net:27017,cluster0-shard-00-01.0mdmt.mongodb.net:27017,cluster0-shard-00-02.0mdmt.mongodb.net:27017/Memories?ssl=true&replicaSet=atlas-de05qz-shard-0&authSource=admin&retryWrites=true&w=majority"

const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, console.log(`server is running on port: ${PORT}`)))
    .catch((err) => console.log(err.message));

// mongoose.set("useFindAndModify", false);
