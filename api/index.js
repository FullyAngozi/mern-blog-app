// Import necessary dependencies
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/user");
const Post = require("./models/post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
const config = require("./config.js");

// Middleware setup
app.use(express.json());
app.use(cors({ credentials: true, origin: "https://angoblog.netlify.app" }));
app.use(cookieParser());
app.use(express.static("uploads"));
const uploadMiddleware = multer({ dest: "uploads/" });

// Constants for password hashing and token generation
const salt = bcrypt.genSaltSync(10);
const SecretKey = config.SecretKey;

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI);

// Route for user registration
app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

// Route for user login
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      res.status(400).json("Wrong LOGIN info");
      return;
    }

    const okay = bcrypt.compareSync(password, userDoc.password);
    if (okay) {
      const token = jwt.sign({ username, id: userDoc.id }, SecretKey, {});
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    } else {
      res.status(400).json("Wrong LOGIN info");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occurred during login" });
  }
});

// Route for user profile
app.get("/profile", (req, res) => {
  const token = req.cookies.token;

  try {
    const data = jwt.verify(token, SecretKey, {});
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error occurred while verifying token" });
  }
});

// Route for user logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("okay");
});

app.post("/post", uploadMiddleware.single("postImage"), async (req, res) => {
  try {
    const title = req.body.title;
    const summary = req.body.summary;
    const post = req.body.post;
    const filename = req.file.filename;
    const ext = req.file.originalname.split(".").pop();
    const newFilename = `${filename}.${ext}`;
    await fs.rename(`uploads/${filename}`, `uploads/${newFilename}`);
    const token = req.cookies.token;

    try {
      const data = jwt.verify(token, SecretKey, {});
      const newPost = await Post.create({
        title,
        summary,
        post,
        postImage: newFilename,
        author: data.id,
      });
      res.json({ newPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while creating the post." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while creating the post." });
  }
});

app.put("/post/:id", uploadMiddleware.single("postImage"), async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.cookies.token;
    const title = req.body.title;
    const summary = req.body.summary;
    const post = req.body.post;
    let newFilename = "";

    if (req.file) {
      const filename = req.file.filename;
      const ext = req.file.originalname.split(".").pop();
      newFilename = `${filename}.${ext}`;
      await fs.rename(`uploads/${filename}`, `uploads/${newFilename}`);
    }

    try {
      const data = jwt.verify(token, SecretKey, {});
      const postInfo = await Post.findById(id);
      if (!postInfo) {
        res.status(404).json({ error: "Post not found" });
        return;
      }

      const isAuthor = postInfo.author.toString() === data.id;
      if (!isAuthor) {
        res.status(400).json({ error: "You are not the author" });
        return;
      }

      postInfo.title = title;
      postInfo.summary = summary;
      postInfo.post = post;
      postInfo.postImage = newFilename ? newFilename : postInfo.postImage;

      await postInfo.save();

      res.json({ postInfo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update post" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.get("/post/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const post = await Post.findById(id).populate("author", ["username"]);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

app.get("/", (req, res) => {
  res.json("hello");
});

// Start the server
app.listen(config.PORT);
