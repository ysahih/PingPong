"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwtToken = void 0;
const jwt = require("jsonwebtoken");
function generateJwtToken(payload) {
    const sec = 'essadike';
    const exp = '1d';
    return jwt.sign(payload, sec, { expiresIn: exp });
}
exports.generateJwtToken = generateJwtToken;
//# sourceMappingURL=jwtToken.js.map