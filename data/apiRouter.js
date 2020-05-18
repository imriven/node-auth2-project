const express = require("express");
const UserRouter = require("./userRouter.js");
const db = require("./userDb");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

router.post("/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;
  db.add(user)
    .then(id => res.status(201).send())
    .catch( err => res.status(500).json({ error: "error registering user" }));
});

router.post("/login", (req, res) => {
  const credentials = req.body;
  db.getByUsername(credentials.username)
    .then((user) => {
      if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
        return res.status(401).json({ error: "Incorrect credentials" });
      } else {
        const token = generateToken(user);
        res.status(200).json({ token });  
      }
    })
    .catch(err =>  res.status(500).json({ error: "error logging in" }));
});

function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    username: user.username,
   department: user.department
  };

  const options = {
    expiresIn: '1d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}

router.use("/users", UserRouter);
module.exports = router;
