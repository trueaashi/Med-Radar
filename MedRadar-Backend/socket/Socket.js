const Server = require("socket.io").Server;
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_HOSPITAL,
      process.env.FRONTEND_USER,
      process.env.FRONTEND_ADMIN,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// userId: socketId
const adminSocketMapping = {};
const hospitalSocketMapping = {};

const getHospitalSocketId = (hospitalId) => {
  return hospitalSocketMapping[hospitalId];
};

// Sockets
io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  socket.on("admin-join", ({ adminId }) => {
    if (!(adminId in adminSocketMapping)) {
      adminSocketMapping[adminId] = socket.id;
    }
  });

  socket.on("hospital-join", ({ hospitalId }) => {
    if (!(adminId in adminSocketMapping)) {
      hospitalSocketMapping[hospitalId] = socket.id;
    }
  });

  socket.on("create-approve-request", ({ hospitalId }) => {
    Object.entries(adminSocketMapping).forEach(([adminId, socketId]) => {
      io.to(socketId).emit("approve-request-notification", {
        peerId: socket.id,
        hospitalId: hospitalId,
      });
    });
  });

  socket.on("approval-done", ({ hospitalId }) => {
    io.to(hospitalSocketMapping[hospitalId]).emit("request-approved", {
      message: "Now you are approved!",
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    Object.entries(adminSocketMapping).forEach(([adminId, socketId]) => {
      if (socketId === socket.id) {
        delete adminSocketMapping[adminId];
        return;
      }
    });
    Object.entries(hospitalSocketMapping).forEach(([hospitalId, socketId]) => {
      if (socketId === socket.id) {
        delete hospitalSocketMapping[hospitalId];
        return;
      }
    });
  });
});

module.exports = { io, server, app, getHospitalSocketId };
