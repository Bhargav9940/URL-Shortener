const { getUser } = require("../service/auth");

function forLoggedInUser(req, res, next) {
    const userUid = req.cookies?.uid;
    //if req have cookie defined then only read uid else return undefined.

    if(!userUid) return res.redirect("/login");
    const user = getUser(userUid);
    if(!user) return res.redirect("/login");

    req.user = user;
    next();
} 

function checkAuth(req, res, next) {
    const userUid = req.cookies?.uid;

    const user = getUser(userUid);

    req.user = user;
    next();
}


module.exports = {
    forLoggedInUser,
    checkAuth,
};

