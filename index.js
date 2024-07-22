const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./connection.js");
const URL = require("./models/url");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/url-shortner").then(() => console.log("MongoDB is connected!"));

//setting ejs as view engine for rendering
app.set("view engine", "ejs");
//giving path to ejs engine for views
app.set("views", path.resolve("./views"));

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//route
app.use("/url", urlRoute);
app.use("/", staticRoute);

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
