
import React, { useEffect, useState } from 'react';
import { fetchUsers, fetchChats, fetchMessages, sendMessage } from './api';
import './style.css';

const ChatApp = () => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const loggedInUserId = 'YOUR_USER_ID'; // replace with your actual logged-in user ID

  // Load users and chats
  useEffect(() => {
    fetchUsers().then(setUsers).catch(console.error);
    fetchChats(loggedInUserId).then(setChats).catch(console.error);
  }, []);

  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id)
        .then(setMessages)
        .catch(console.error);
    }
  }, [selectedChat]);

  // Send a new message
  const handleSend = async () => {
    if (newMessage.trim() === '' || !selectedChat) return;

    const sentMsg = await sendMessage(selectedChat._id, loggedInUserId, newMessage);
    setMessages([...messages, sentMsg]);
    setNewMessage('');
  };

  return (
    <div>
      <div className="header">ChatSphere</div>
      <div className="chat-container">
        <div className="sidebar">
          <h5>Chats</h5>
          {chats.map(chat => (
            <div
              key={chat._id}
              className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              {chat.name}
            </div>
          ))}
        </div>

        <div className="chat-window">
          <div className="messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.senderId === loggedInUserId ? 'sent' : 'received'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="btn btn-primary" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
