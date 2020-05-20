const express = require("express");
const db = require("./userDb");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");

router.use(protected);

router.get("/", (req, res) => {
  db.getByDepartment(req.user.department)
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json({ error: "cannot get users" }));
});

function protected(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secrets.jwtSecret, (err, user) => {
      if (err) {
        return res.status(403).send();
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).send();
  }
}

module.exports = router;
