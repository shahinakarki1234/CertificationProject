const jwt = require("jsonwebtoken");
const config = require("./config");

const checkLoggedIn = function (req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({ auth: false, token: "no token provided" });

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err)
      return res
        .status(500)
        .send({ auth: false, token: "failed to authenticate token" });

    req.user = decoded;
    next();
  });
};

module.exports = checkLoggedIn;
