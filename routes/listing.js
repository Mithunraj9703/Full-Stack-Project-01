const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLogin, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' });

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLogin, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

//new route:-
router.get("/new", isLogin, listingController.newForm);

router.route("/:id")
    .get(wrapAsync(listingController.show))
    .put(isLogin, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLogin, isOwner, wrapAsync(listingController.deleteListing));

//edit route:-
router.get("/:id/edit", isLogin, isOwner, wrapAsync(listingController.editForm));

//index route:-
// router.get("/", wrapAsync(listingController.index));

//show route:-
// router.get("/:id", wrapAsync(listingController.show));

//create route:-
// router.post("/", isLogin, validateListing, wrapAsync(listingController.createListing));

//update route:-
// router.put("/:id", isLogin, isOwner, validateListing, wrapAsync(listingController.updateListing));

//delete route:-
// router.delete("/:id", isLogin, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;