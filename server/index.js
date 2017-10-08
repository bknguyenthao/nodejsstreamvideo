const io = require("socket.io")(3000);
let arrUser = [];

// Handle connection event
io.on("connection", socket => {
    socket.on("NGUOI_DUNG_DANG_KY", user => {
        // Add more attribute for socket object to handle disconnect event
        socket.peerId = user.peerId;

        // Check user exist
        let isExistUser = false;
        for (let i = 0; i < arrUser.length; i++) {
            if (arrUser[i].username === user.usename) {
                isExistUser = true;
                break;
            }
        }
        if (isExistUser) return socket.emit("DANG_KY_THAT_BAI");

        arrUser.push(user);
        // Send for one user
        socket.emit("DANH_SACH_ONLINE", arrUser);
        // Send for all user except user just register
        socket.broadcast.emit("CO_NGUOI_DUNG_MOI", user);
    })

    // Handle disconnect event
    socket.on("disconnect", () => {
        let index = 0;
        for (let i = 0; i < arrUser.length; i++) {
            if (arrUser[i].id === socket.peerId) {
                index = i;
                break;
            }
        }
        arrUser.splice(index, 1);
        socket.broadcast.emit("AI_DO_NGAT_KET_NOI", socket.peerId);
    })
})