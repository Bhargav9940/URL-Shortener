const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./connection.js");
const { forLoggedInUser, checkAuth } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const URL = require("./models/url");
const app = express();
const PORT = 8001;

const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
const staticRoute = require("./routes/staticRouter");

connectToMongoDB("mongodb://localhost:27017/url-shortner").then(() => console.log("MongoDB is connected!"));

//setting ejs as view engine for rendering
app.set("view engine", "ejs");
//giving path to ejs engine for views
app.set("views", path.resolve("./views"));

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
// cookie-parser is middleware that simplifies handling cookies. It parses incoming cookies from client requests and makes them accessible in the req. cookies object.

//route
//forLoggedInUser is middleware that executes every time below route is choosen and then go urlRoute
app.use("/url", forLoggedInUser, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);


app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    //returns document
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: { visitHistory: {
            timestamp: Date.now()
        }}
    });
    if(!entry) return res.status(404).send("URL not found!");
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));


//stateful auth have one disadvantage that is every time server restarts, it forgets previous states, user need to again login.y
