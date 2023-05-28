// Import necessary dependencies
const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();
const User = require("./models/user");
const Post = require("./models/post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");


// Middleware setup
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());
app.use(express.static('uploads'))
const uploadMiddleware = multer({ dest: "uploads/" });

// Constants for password hashing and token generation
const salt = bcrypt.genSaltSync(10);
const SecretKey = "njknc1o22339kfem2m332cfvn";

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://ochukoangozi:96q6W4S3hoXZTMXh@cluster0.ybvmlox.mongodb.net/?retryWrites=true&w=majority"
);

// Route for user registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Route for user login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const okay = bcrypt.compareSync(password, userDoc.password);
  if (okay) {
    // User is logged in
    jwt.sign({ username, id: userDoc.id }, SecretKey, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Wrong LOGIN info");
  }
});

// Route for user profile
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, SecretKey, {}, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

// Route for user logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("okay");
});

app.post("/post", uploadMiddleware.single("postImage"), async (req, res) => {
  const { title, summary, post } = req.body;
  const { filename } = req.file;
  const ext = req.file.originalname.split(".").pop();
  // Create a new filename with the extension
  const newFilename = `${filename}.${ext}`;
  fs.renameSync(`uploads/${filename}`, `uploads/${newFilename}`);
  const { token } = req.cookies;

  jwt.verify(token, SecretKey, {}, async (err, data) => {
    if (err) throw err;
    const newPost = await Post.create({
      title,
      summary,
      post,
      postImage: newFilename,
      author: data.id
    });
    res.json({ newPost });
  });

  // Create a new post object using the Post model

});

app.put("/post/:id", uploadMiddleware.single("postImage"), async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.cookies;
    const { title, summary, post } = req.body;
    let newFilename = "";

    if (req.file) {
      const { filename } = req.file;
      const ext = req.file.originalname.split(".").pop();
      // Create a new filename with the extension
      newFilename = `${filename}.${ext}`;
      fs.renameSync(`uploads/${filename}`, `uploads/${newFilename}`);
    }

    jwt.verify(token, SecretKey, {}, async (err, data) => {
      if (err) throw err;

      const postInfo = await Post.findById(id);
      if (!postInfo) {
        return res.status(404).json({ error: "Post not found" });
      }

      const isAuthor = postInfo.author.toString() === data.id;
      if (!isAuthor) {
        return res.status(400).json({ error: "You are not the author" });
      }

      postInfo.title = title;
      postInfo.summary = summary;
      postInfo.post = post;
      postInfo.postImage = newFilename ? newFilename : postInfo.postImage;

      await postInfo.save();

      res.json({ postInfo });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update post" });
  }
});




app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', ['username']).sort({createdAt: -1}).limit(20);
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  // Use the retrieved id to fetch the post from the database
  try {
    const post = await Post.findById(id).populate('author', ['username']);
    // Perform any necessary operations with the post data
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});


// Start the server
app.listen(4000);
