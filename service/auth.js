const jwt = require("jsonwebtoken");
const secret = "Bharg$135";
//whoever have this secret, is able to generate token

function setUser(user) {
    //creating a token
    //return jwt.sign(payload, secret);
    return jwt.sign({
        _id: user._id,
        email: user.email,
    }, secret);
}

function getUser(token) {
    if(!token) return null;
    //verifying a token
    try {
        return jwt.verify(token, secret);
    }
    catch(error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
};