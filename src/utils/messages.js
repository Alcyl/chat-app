const now = new Date();
const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: now.getTime()
    }
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: now.getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}