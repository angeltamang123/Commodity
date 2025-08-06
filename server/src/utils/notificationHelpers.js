const notifications = require("../models/notifications");

async function notifyUser(io, userId, payload) {
  // Save to DB
  const dbNotif = await Notification.create({
    userId,
    message: payload.message,
    type: payload.type,
  });

  // Emit to all sockets of that user
  const sockets = global.connectedUsers.get(userId);
  if (sockets) {
    for (const socketId of sockets) {
      io.to(socketId).emit("notification", dbNotif);
    }
  }
}

async function notifyAllAdmins(io, payload) {
  const adminNotifs = [];

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
