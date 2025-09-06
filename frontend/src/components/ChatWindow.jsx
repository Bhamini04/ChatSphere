// src/components/ChatWindow.jsx
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ChatWindow.css";
import { io } from "socket.io-client";

const ChatWindow = ({ peer }) => {
  const { user, logout, updateProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [newPhoto, setNewPhoto] = useState(user?.avatar || "");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const listRef = useRef(null);

  // ---------- SOCKET.IO ----------
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("🔌 Connected:", socketRef.current.id);
      const chatId = peer?.id || "global";
      console.log("Joining chat:", chatId);
      socketRef.current.emit("join_chat", chatId);
    });

    socketRef.current.on("chat_history", (messages) => {
      setMessages(
        messages.map((msg) => ({
          ...msg,
          self: msg.sender === user.username,
        }))
      );
    });

    socketRef.current.on("receive_message", (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, { ...msg, self: msg.sender === user.username }];
      });
    });

    socketRef.current.on("user_updated", ({ userId, newUsername }) => {
      if (userId === user.id) {
        updateProfile({ username: newUsername, avatar: user.avatar });
      }
    });

    socketRef.current.on("message_deleted", ({ msgId }) => {
      setMessages((msgs) => msgs.filter((m) => m.id !== msgId));
    });

    return () => socketRef.current.disconnect();
  }, [peer, user.username]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleDeleteMessage = (msgId) => {
    setMessages((msgs) => msgs.filter((m) => m.id !== msgId));
    socketRef.current.emit("delete_message", { chatId: peer?.id || "global", msgId });
  };

  // ---------- Send Text ----------
  const handleSend = () => {
    if (!input.trim() || !peer) return;

    const msg = {
      id: crypto.randomUUID(),
      text: input,
      type: "text",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: user.username,
      receiver: peer.username,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, { ...msg, self: true }]);
    setInput("");

    socketRef.current.emit("send_message", {
      chatId: peer?.id || "global",
      message: msg,
    });
  };

  // ---------- Send Media ----------
  const handleMediaSelect = (e) => {
    if (!peer) return;
    const file = e.target.files[0];
    if (!file) return;

    const msg = {
      id: crypto.randomUUID(),
      text: file.name,
      type: file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : "file",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: user.username,
      receiver: peer.username,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, { ...msg, self: true }]);
    setMediaOpen(false);

    const reader = new FileReader();
    reader.onload = () => {
      socketRef.current.emit("send_message", {
        chatId: peer?.id || "global",
        message: { ...msg, fileData: reader.result },
      });
    };
    reader.readAsDataURL(file);
  };

  // ---------- Voice Recording ----------
  const handleStartRecording = () => {
    if (!navigator.mediaDevices?.getUserMedia || !peer) return;
    setRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mpeg-3" });
        const msg = {
          id: crypto.randomUUID(),
          text: "Voice Message",
          type: "voice",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sender: user.username,
          receiver: peer.username,
          timestamp: new Date().toISOString(),
        };

        setMessages([...messages, { ...msg, self: true }]);

        const reader = new FileReader();
        reader.onload = () => {
          socketRef.current.emit("send_message", {
            chatId: peer?.id || "global",
            message: { ...msg, fileData: reader.result },
          });
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.start();
    });
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // ---------- Profile ----------
  const handleProfileUpdate = () => {
    updateProfile({ username: newUsername, avatar: newPhoto });
    socketRef.current.emit("user_updated", {
      userId: user.id,
      newUsername,
    });
    setSettingsOpen(false);
  };

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="pane-head">
        <div className="peer-info">
          <img
            src={peer?.avatar || "/default-avatar.png"}
            alt={peer?.name}
            className="avatar"
          />
          <div>
            <div className="name">{peer?.name || "tiwari"}</div>
            <div className="presence">Online</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="thread" ref={listRef}>
        {messages.map((m) => (
          <div key={m.id} className={`row ${m.self ? "me" : ""}`}>
            <div className={`bubble ${m.self ? "me" : "them"}`}>
              {m.type === "image" && (
                <img
                  src={m.fileData}
                  alt="img"
                  style={{
                    width: 170,
                    height: "auto",
                    maxHeight: 170,
                    borderRadius: 10,
                    objectFit: "cover",
                  }}
                />
              )}
              {m.type === "video" && (
                <video
                  src={m.fileData}
                  controls
                  style={{ width: 170, maxHeight: 170, borderRadius: 10 }}
                />
              )}
              {m.type === "voice" && <audio controls src={m.fileData} />}
              {(m.type === "file" || m.type === "text") && <span>{m.text}</span>}
              <div className="time">{m.time}</div>
              <button
                className="btn-delete"
                onClick={() => handleDeleteMessage(m.id)}
                style={{
                  marginLeft: 8,
                  background: "none",
                  border: "none",
                  color: "#f44",
                  cursor: "pointer",
                  fontSize: "1em",
                }}
                title="Delete message"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="composer">
        <button className="btn-plus" onClick={() => setMediaOpen(!mediaOpen)}>
          +
        </button>
        <input
          type="text"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        {recording ? (
          <button className="btn-send" onClick={handleStopRecording}>
            ■
          </button>
        ) : (
          <>
            <button className="btn-send" onClick={handleStartRecording}>
              🎤
            </button>
            <button className="btn-send" onClick={handleSend}>
              📨
            </button>
          </>
        )}
      </div>

      {/* Media Panel */}
      {mediaOpen && (
        <div className="media-options">
          <label>
            <input type="file" style={{ display: "none" }} onChange={handleMediaSelect} />
            📁 Send Image / Video / File
          </label>
          <button onClick={() => setMediaOpen(false)}>❌ Close</button>
        </div>
      )}

      {/* Settings */}
      {settingsOpen && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <button className="btn-close" onClick={() => setSettingsOpen(false)}>×</button>
            <img
              src={newPhoto}
              alt="Profile"
              className="profile-photo"
              onClick={() => {
                const fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = "image/*";
                fileInput.onchange = (e) => {
                  const file = e.target.files[0];
                  if (file) setNewPhoto(URL.createObjectURL(file));
                };
                fileInput.click();
              }}
            />
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <button className="btn-save" onClick={handleProfileUpdate}>Save</button>
            <button className="btn-logout" onClick={logout}>Logout</button>
          </div>
        </div>
      )}

      {/* Bottom-left settings */}
      <button className="btn-settings" onClick={() => setSettingsOpen(true)}>⚙️</button>
    </div>
  );
};

export default ChatWindow;
