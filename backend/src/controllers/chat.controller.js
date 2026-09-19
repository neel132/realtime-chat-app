const chatService = require("../services/chat.service");

function getUsers(req, res) {
    const users = chatService.getUsers();
    res.json({
        success: true,
        users: users
    })
}

function getMessages(req, res) {
    const messages = chatService.getMessages();

    res.json({
        success: true,
        messages: messages
    })
}

function sendMessage(req, res) {
    const {text} = req.body;
    if(!text || !text.trim()) {
        return res.status(400).json({
            success: false,
            message: "Message is required"
        })
    }
    const message = chatService.createMessage(req.user, text.trim());
    res.status(201).json({
        success: true,
        message: message
    })
}

module.exports = {
    getUsers,
    getMessages,
    sendMessage,
}