if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
// const ejs = require("ejs");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
// const wrapAsync = require("./utility/wrapAsync.js");
const ExpressError = require("./utility/expressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

// const mongoUrl = 'mongodb://127.0.0.1:27017/wonderlust';
const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
};
main().then(() => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
})
const app = express();
const port = 8080;
app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
});
app.get("/", (req, res) => {
    res.redirect("/listings");
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.use(express.json());


const store = mongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", () => {
    console.log("error in mongo session store.", error);
})
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 13,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
    }
};
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//async error handler
app.use((err, req, res, next) => {
    let { status = 500, message = "Some Error" } = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs", { message });
});
// app.get("/listing", async (req, res) => {
//     let newListing = new Listing({
//         title: "My Villa",
//         description: "By the mountain",
//         price: 15000,
//         location: "Deoghar,Jharkhand",
//         country: "India",
//     })
//     await newListing.save();
//     console.log(newListing);
//     res.send("save successful");
// })