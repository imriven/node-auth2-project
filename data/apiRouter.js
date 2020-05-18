const express = require("express");
const UserRouter = require("./userRouter.js");
const db = require("./userDb");
const bcrypt = require("bcryptjs");
const router = express.Router();



router.post("/register", (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;
  db.add(credentials)
    .then(res.status(201).send())
    .catch( err => res.status(500).json({ error: "error registering user" }));
});

router.post("/login", (req, res) => {
  const credentials = req.body;
  db.getByUsername(credentials.username)
    .then((user) => {
      if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
        return res.status(401).json({ error: "Incorrect credentials" });
      } else {
        req.session.username = credentials.username
        res.status(200).json({ message: "logged in!" });  
      }
    })
    .catch(err =>  res.status(500).json({ error: "error logging in" }));
});

router.use("/users", UserRouter);
module.exports = router;
