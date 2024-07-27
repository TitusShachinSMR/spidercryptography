const crypto = require("crypto");
const fs = require("fs");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

fs.writeFileSync("private_key.pem", privateKey);
fs.writeFileSync("public_key.pem", publicKey);

console.log("Keys generated and saved to private_key.pem and public_key.pem");
