const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// only admin can register new users
router.post("/register", register);
router.post("/register", auth, role("admin"), register);


// public login
router.post("/login", login);

// check token & get logged user
router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
