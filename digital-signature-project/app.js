const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Serve static files from the 'public' directory
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route to handle file uploads and signature generation
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  const privateKey = fs.readFileSync("private_key.pem", "utf8");
  const fileBuffer = fs.readFileSync(file.path);
  const sign = crypto.createSign("SHA256");
  sign.update(fileBuffer);
  sign.end();

  const signature = sign.sign(privateKey, "hex");

  fs.unlinkSync(file.path); // Clean up uploaded file

  res.send({ signature });
});

// Route to handle signature verification
app.post("/verify", upload.single("file"), (req, res) => {
  const file = req.file;
  const { signature } = req.body;

  if (!file || !signature) {
    return res.status(400).send("File and signature are required");
  }

  const publicKey = fs.readFileSync("public_key.pem", "utf8");
  const fileBuffer = fs.readFileSync(file.path);
  const verify = crypto.createVerify("SHA256");
  verify.update(fileBuffer);
  verify.end();

  const isVerified = verify.verify(publicKey, signature, "hex");

  fs.unlinkSync(file.path); // Clean up uploaded file

  res.send({ isVerified });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
