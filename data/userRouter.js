const express = require('express');
const db = require("./userDb")
const router = express.Router();

router.use(protected)
router.get("/", (req, res) => {
    db.get()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({error:"cannot get users"}))
})

function protected(req, res, next) {
    console.log("called")
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: 'you shall not pass!!' });
    }
}



module.exports = router