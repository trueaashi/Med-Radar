const crypto = require("crypto");
const { HASH_SECRET } = require("../config");
class HashService {
  hashPassword(data) {
    return crypto.createHmac("sha256", HASH_SECRET).update(data).digest("hex");
  }
}
module.exports = new HashService();
