const express = require("express");
const { APP_PORT, CLIENT_ID, CLIENT_SECRET } = require("./config");
// const app = express();

const myModule = require("./socket/Socket");
const server = myModule.server;
const app = myModule.app;

const cors = require("cors");
const PORT = APP_PORT || 5500;
const connectDB = require("./config/database");
const errorHandler = require("./middlewares/errorHandler");
const cloudinaryConfig = require("./config/cloudinary");
// importing modules required for Google Auth
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const User = require("./models/User");
// connectint database
connectDB();
cloudinaryConfig();
// Cookie Setup
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: [
      // process.env.FRONTEND_HOSPITAL,
      // process.env.FRONTEND_USER,
      // process.env.FRONTEND_ADMIN,
      "http://localhost:3001",
      "http://localhost:3000",
      "http://localhost:3002",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// setup session
app.use(
  session({
    secret: "YOUR SECRET KEY",
    resave: false,
    saveUninitialized: true,
  })
);

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: "/user/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// calling routes
const hospitalRouter = require("./routes/hospitalRoutes");
const userRouter = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/hospital", hospitalRouter);
app.use("/user", userRouter);
app.use("/admin", adminRoutes);

app.use(errorHandler);
server.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
