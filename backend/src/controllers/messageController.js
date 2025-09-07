// src/controllers/messageController.js

// Temporary in-memory message storage
// Structure: { chatId1: [msg1, msg2], chatId2: [msg1, msg2] }
const messagesDB = {};

/**
 * Save a message in memory
 * @param {string} chatId - The chat room ID
 * @param {object} message - The message object
 * @returns {object} saved message
 */
export const saveMessage = (chatId, message) => {
  if (!messagesDB[chatId]) {
    messagesDB[chatId] = [];
  }
  messagesDB[chatId].push(message);
  return message;
};

/**
 * Get all messages for a chat
 * @param {string} chatId - The chat room ID
 * @returns {array} list of messages
 */
export const getMessagesByChatId = (chatId) => {
  return messagesDB[chatId] || [];
};
