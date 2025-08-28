const connectedUsers = new Map(); // userId -> Set of socketIds
const socketToUser = new Map(); // socketId -> userId
const connectedAdmins = new Set(); // Set of admin socketIds

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    socket.on("register", ({ userId, role }) => {
      // Add socket to user's set
      if (!connectedUsers.has(userId)) {
        connectedUsers.set(userId, new Set());
      }
      connectedUsers.get(userId).add(socket.id);
      socketToUser.set(socket.id, userId);

      if (role === "admin") {
        connectedAdmins.add(socket.id);
      }
    });

    socket.on("disconnect", () => {
      const userId = socketToUser.get(socket.id);

      if (userId && connectedUsers.has(userId)) {
        connectedUsers.get(userId).delete(socket.id);
        if (connectedUsers.get(userId).size === 0) {
          connectedUsers.delete(userId);
        }
      }

      socketToUser.delete(socket.id);
      connectedAdmins.delete(socket.id);

      console.log(`Socket ${socket.id} disconnected`);
    });
  });

  // Making global for use in routes
  global.connectedUsers = connectedUsers;
  global.connectedAdmins = connectedAdmins;
  global.socketToUser = socketToUser;
};
