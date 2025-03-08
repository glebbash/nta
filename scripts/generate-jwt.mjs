import jwt from "jsonwebtoken";

const [_node, _script, userId, signingKey] = process.argv;
if (!signingKey) {
  console.error("Usage: node generate-jwt.ts <user-id> <signing-key>");
  process.exit(1);
}

const payload = { sub: userId };
const options = { expiresIn: "100y" };
const token = jwt.sign(payload, signingKey, options);

console.log(token);
