import jwt from "jsonwebtoken";

const data = {
    name: "utsav",
    age: 18,
    email: "utsav@gmail.com",
};

const key = "123";
const generateAccessToken = (payload) => {
    return jwt.sign(payload, key);
};
const verfiyRefeshToken = (token) => {
    return jwt.verify(token, key);
};
const decodeRefershToken = (token) => {
    return jwt.decode(token);
};

const refershToken = generateAccessToken(data);
console.log(verfiyRefeshToken(refershToken));
console.log(decodeRefershToken(refershToken));
