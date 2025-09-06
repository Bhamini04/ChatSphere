import { saveMessage, getMessagesByChatId } from "../controllers/messageController.js";

export default function initSockets(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a chat room
    socket.on("join_chat", async (chatId) => {
      socket.join(chatId);
      console.log(`${socket.id} joined chat ${chatId}`);

      try {
        const messages = await getMessagesByChatId(chatId) || [];
        socket.emit("chat_history", messages);
      } catch (err) {
        console.error("Failed to fetch chat history", err.message);
        socket.emit("chat_history", []);
      }
    });

    // Broadcast username update
    socket.on("user_updated", ({ userId, newUsername }) => {
      console.log(`User updated: ${userId} => ${newUsername}`);
      io.emit("user_updated", { userId, newUsername });
    });


    //deleting messages
    socket.on("delete_message", async ({ chatId, msgId }) => {
  await deleteMessage(chatId, msgId); // Implement this in your DB
  io.to(chatId).emit("message_deleted", { msgId });
});


    // Receive new message, save and broadcast
    socket.on("send_message", async ({ chatId, message }) => {
      if (!message || !message.sender) {
        console.error("Message or sender is undefined");
        return;
      }

      try {
        await saveMessage(chatId, message);
        io.to(chatId).emit("receive_message", message);
      } catch (err) {
        console.error("Failed to save message", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
