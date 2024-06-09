var jwt = require("jsonwebtoken");

const authenticate = async function (req, res, next) {
  const token = req.cookies.access_token;
  

  if (!token) {
    return res.status(404).send({"result":"you are not authenticated"});
  }

  jwt.verify(token, "kishor", (err, user) => {
    if (err) {
      return res.status(404).send("invalid Token");
    }

    if (user.isAdmin) {
      return next(); // if there is no next middleware then it throws an error , if there is any middleware it call the next middle ware
    }
    if (!user.isAdmin) {
      return res.send("you are not an admin");
    }
  });
};

module.exports = { authenticate };
