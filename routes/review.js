const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utility/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLogin, isReviewAuthor } = require("../middleware.js");
const controllersReview = require("../controllers/reviews.js");

//post review route:-
router.post("/", isLogin, validateReview, wrapAsync(controllersReview.createReview));

//delete review route:-
router.delete("/:reviewId", isLogin, isReviewAuthor, wrapAsync(controllersReview.destroyReview));

module.exports = router;