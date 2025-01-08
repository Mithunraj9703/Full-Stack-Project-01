const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utility/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controllersUser = require("../controllers/users.js");

router.route("/signup")
    .get(controllersUser.signupForm)
    .post(wrapAsync(controllersUser.signupUser));

router.route("/login")
    .get(controllersUser.loginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), controllersUser.loginUser);

router.get("/logout", controllersUser.logoutUser);

// router.get("/signup", controllersUser.signupForm)

// router.post("/signup", wrapAsync(controllersUser.signupUser));

// router.get("/login", controllersUser.loginForm);

// router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), controllersUser.loginUser);


module.exports = router;