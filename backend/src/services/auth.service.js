const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {users} = require("../data/database");

const JWT_SECRET = "classroom-secret-key";

async function registerUser(name, email, password) {
    const existingUser = users.find(user => user.email === email);
    if(existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
        id: users.length + 1,
        password: hashedPassword,
        name,
        email
    }
    users.push(user);
    return {
        id: user.id,
        name: user.name,
        email: user.email
    }
}

async function loginUser(email, password) {
    const user = users.find(user => user.email === email);
    if(!user) {
        throw new Error("Invalid email or password")
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if(!passwordMatched) {
        throw new Error("Invalid email or password")
    }
    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email
        },
        JWT_SECRET,
        {
            expiresIn: "1h"
        }
    )

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    }
}

function verifyToken(token) {
    return jwt.verify(
        token,
        JWT_SECRET
    )
}

module.exports = {
    registerUser,
    loginUser,
    verifyToken
}