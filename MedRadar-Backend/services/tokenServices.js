const jwt = require("jsonwebtoken");
const { JWT_SECRET, REFRESH_SECRET } = require("../config");
class tokenServices {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: "1y",
    });
    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token) {
    try{
      return jwt.verify(token, JWT_SECRET);
    }catch(error){  
      return false;
    }
  }

  async verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
  }
}
module.exports = new tokenServices();
