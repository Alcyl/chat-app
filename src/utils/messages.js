const now = new Date();
const generateMessage = (text) => {
    return {
        text,
        createdAt: now.getTime()
    }
}

const generateLocationMessage = (url) => {
    return {
        url,
        createdAt: now.getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}