const {users, messages} = require("../data/database");

function getUsers() {
    return users.map(user => {
        return {
            id: user.id,
            name: user.name,
            email: user.email
        }
    })
}

function getMessages() {
    return messages;
}

function createMessage(user, text) {
    const message = {
        id: messages.length + 1,
        userId: user.id,
        username: user.name,
        text: text,
        time: new Date().toISOString()
    };
    messages.push(message);
    return message;
}

module.exports = {
    getUsers,
    getMessages,
    createMessage
}