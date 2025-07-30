if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const port = 8081;
//SETTING EJS

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));

// connecting with mongodb
let atlasDb_URL = process.env.ATLASDB_URL;
main()
  .then(() => console.log("Successfully connected to database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(atlasDb_URL);
}

const store = MongoStore.create({
  mongoUrl: atlasDb_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // 24hrs
});

const webSession = session({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
  },
});

app.use(webSession);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.userComment = req.flash("comment");
  res.locals.userRating = req.flash("rating");
  res.locals.user = req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//MIDDLEWARES
app.all("*", (req, res, next) => {
  throw new ExpressError(404, "Page not found");
});

app.use((err, req, res, next) => {
  let { status = 400, message = "unexpected error occured" } = err;
  res.status(status).render("./listings/error.ejs", { err });
  // next(err);
});

app.listen(port, () => {
  console.log(`app is listening to port ${port}`);
});