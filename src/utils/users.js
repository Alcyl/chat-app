const users = [];

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Vallidate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Vallidate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user);
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id);
    // const index = users.findIndex((user) => user.id === id)
    // if (index !== -1) {
    //     return console.log(users[index]);
    // } else {
    //     return undefined;
    // }
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)    
    // users.forEach(user => {
    //     if (user.room === room) {
    //         return console.log(user);
    //     }
    // });
    // return console.log([]);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}