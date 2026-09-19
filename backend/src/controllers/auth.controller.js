const authService = require("../services/auth.service");

async function register(req, res, next) {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required",
            })
        }
        const user = await authService.registerUser(name, email, password);
        res.status(201).json({
            success: true,
            message: "Registeration successful",
            user: user,
        })
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }

        const result = await authService.loginUser(user, password);
        res.json({
            success: true,
            message: "Login successful",
            token: result.token,
            user: result.user
        });
    } catch(error) {
        res.status(401).json({
            success: false,
            message: error.message
        })
    }
}

function me(req, res) {
    res.json({
        success: true,
        user: req.user
    })
}

module.exports = {
    register,
    login,
    me,
}