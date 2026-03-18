let ioInstance;

export const initSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("joinRestaurant", (restaurantId) => {
      socket.join(restaurantId);
      console.log("Joined room:", restaurantId);
    });
  });
};

export const emitNewOrder = (restaurantId, order) => {
  if (ioInstance) {
    ioInstance.to(restaurantId).emit("newOrder", order);
  }
};

export const emitOrderStatus = (restaurantId, updatedOrder) => {
  if (ioInstance) {
    ioInstance.to(restaurantId).emit("orderUpdated", updatedOrder);
  }
};
export const emitOrderUpdate = (restaurantId, updatedOrder) => {
  if (ioInstance) {
    ioInstance.to(restaurantId).emit("orderUpdated", updatedOrder);
  }
};