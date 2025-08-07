const notifications = require("../models/notifications");

async function notifyUser(io, userId, payload) {
  const dbNotif = await notifications.create({
    userId,
    message: payload.message,
    type: payload.type,
  });

  const sockets = global.connectedUsers.get(userId);
  if (sockets) {
    for (const socketId of sockets) {
      io.to(socketId).emit("notification", dbNotif);
    }
  }
}

async function notifyAllAdmins(io, payload) {
  for (const socketId of global.connectedAdmins) {
    const userId = global.socketToUser?.get(socketId);
    if (!userId) continue;

    const dbNotif = await notifications.create({
      userId,
      message: payload.message,
      type: payload.type,
    });

    io.to(socketId).emit("notification", dbNotif);
  }
}

module.exports = { notifyUser, notifyAllAdmins };
