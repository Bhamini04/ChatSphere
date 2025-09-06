/*import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";

const socket = io("http://localhost:5000"); // your backend URL

const demoUsers = [
  { id: "u1", name: "Nora Safuan", avatar: "https://i.pravatar.cc/80?img=1", lastMessage: "Hello", unread: 0 },
  { id: "u2", name: "Adithya Panth", avatar: "https://i.pravatar.cc/80?img=2", lastMessage: "Hi!", unread: 0 },
  { id: "u3", name: "Abdul Mujhni", avatar: "https://i.pravatar.cc/80?img=3", lastMessage: "Hey", unread: 0 },
  { id: "u4", name: "Vino Arya", avatar: "https://i.pravatar.cc/80?img=4", lastMessage: "Yo", unread: 0 }
];

const ChatPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("active");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [people, setPeople] = useState(demoUsers);
  const [messages, setMessages] = useState([]); // current chat messages
  const [newMessage, setNewMessage] = useState("");

  // Filter chats by search
  const filtered = useMemo(() => {
    return people.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  }, [people, query]);

  useEffect(() => {
    if (!selected && filtered.length) setSelected(filtered[0]);
  }, [filtered, selected]);

  // Join chat room when selecting a chat
  useEffect(() => {
    if (!selected) return;

    socket.emit("join_chat", selected.id);

    socket.on("chat_history", (history) => {
      setMessages(history);
    });

    socket.on("receive_message", (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
    };
  }, [selected]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender: user.name,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", { chatId: selected.id, message: messageData });
    setNewMessage("");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <aside className="left-rail">
        <div className="rail-head">
          <div className="rail-title">buddies</div>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>

        <div style={{padding:"10px 16px"}}>
          <input
            className="search"
            placeholder="Search conversation"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
          />
        </div>

        <div className="tabs">
          <div className={`tab ${tab==="active"?"active":""}`} onClick={()=>setTab("active")}>CHATS</div>
          <div className={`tab ${tab==="archived"?"active":""}`} onClick={()=>setTab("archived")}>GROUP</div>
        </div>

        <div className="chat-items">
          <ChatList
            chats={filtered}
            selectedId={selected?.id}
            onSelectChat={setSelected}
          />
        </div>
      </aside>
<main className="pane">
  {selected ? (
    <ChatWindow peer={selected} />
  ) : (
    <div style={{ display: "grid", placeItems: "center", color: "var(--muted)" }}>
      Select a chat to start messaging
    </div>
  )}
</main>

      
    </div>
  );
};

export default ChatPage;*/




/*

// src/pages/ChatPage.jsx
import React, { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";

const demoPeer = {
  id:"u1",
  name:"Nora Safuan",
  avatar:"https://i.pravatar.cc/80?img=1"
};

const ChatPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleProfileUpdate = async () => {
    const newName = document.getElementById("username").value;
    const avatarFile = document.getElementById("avatar").files[0];

    if (!updateProfile) return console.error("updateProfile undefined");

    await updateProfile({ name: newName, avatarFile });
    setShowProfileModal(false);
  };

  return (
    <div className="app-shell">
      <aside className="left-rail">
        <div className="rail-head">
          <div className="rail-title">buddies</div>
        </div>
        {/* Chat list can go here }
      </aside>

      <main className="pane">
        <ChatWindow peer={demoPeer} />
        <button className="btn-settings" onClick={()=>setShowProfileModal(true)}>⚙️</button>
      </main>

      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Profile</h3>
            <input type="text" id="username" defaultValue={user.name} />
            <input type="file" accept="image/*" id="avatar" />
            <div className="modal-buttons">
              <button onClick={handleProfileUpdate}>Save</button>
              <button onClick={logout}>Logout</button>
              <button onClick={() => setShowProfileModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
*/


















/*


// src/pages/ChatPage.jsx
import React, { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";

const demoPeer = {
  id: "u1",
  name: "Nora Safuan",
  avatar: "https://i.pravatar.cc/80?img=1",
};

const ChatPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [newAvatar, setNewAvatar] = useState(user?.avatar || "");

  const handleProfileUpdate = async () => {
    if (!updateProfile) return console.error("updateProfile undefined");

    await updateProfile({ username: newUsername, avatar: newAvatar });
    setShowProfileModal(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="app-shell">
      {/* Left rail / Chat list }
      <aside className="left-rail">
        <div className="rail-head">
          <div className="rail-title">Buddies</div>
        </div>
        {/* Chat list can go here }
        {/* Logout button at bottom-left }
        <div className="logout-bottom">
          <button className="btn-logout" onClick={logout} title="Logout">
            🔒
          </button>
        </div>
      </aside>

      {/* Main Chat Window }
      <main className="pane">
        <ChatWindow peer={demoPeer} />
        {/* Settings button }
        <button
          className="btn-settings"
          onClick={() => setShowProfileModal(true)}
          title="Settings"
        >
          ⚙️
        </button>
      </main>

      {/* Profile Modal }
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Profile</h3>
            <div className="modal-avatar">
              <img src={newAvatar} alt="Profile" className="profile-photo" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleProfileUpdate}>Save</button>
              <button onClick={() => setShowProfileModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
*/

















// src/pages/ChatPage.jsx
import React, { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";

const buddies = [
  { id: "u1", name: "peter", avatar: "https://i.pravatar.cc/80?img=1" },
  { id: "u2", name: "jhon", avatar: "https://i.pravatar.cc/80?img=2" },
  // Add more buddies here or fetch dynamically
];

const ChatPage = () => {
  const { user, logout, updateProfile } = useAuth();
  // Example logged-in users array - update with real data as needed
  const loggedInUsers = [
    { id: "u1", username: "krishna", avatar:"data:image/jpeg;base64,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" },
    { id: "u2", username: "tiwari", avatar: "data:image/jpeg;base64,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" },
  ];

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [newAvatar, setNewAvatar] = useState(user?.avatar || "");
  const [selectedPeer, setSelectedPeer] = useState(buddies[0]);
  const [isChatMaximized, setChatMaximized] = useState(true);

  const handleProfileUpdate = async () => {
    if (!updateProfile) return console.error("updateProfile undefined");
    await updateProfile({ username: newUsername, avatar: newAvatar });
    setShowProfileModal(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="app-shell" style={{ display: "flex" }}>
      {/* Sidebar */}
      <aside
        className="left-rail"
        style={{ width: isChatMaximized ? 300 : 400, transition: "width 0.3s" }}
      >
        <div className="rail-head">
          <div className="rail-title">Buddies</div>
        </div>

        <div className="buddies-list" style={{ padding: "10px 0" }}>
          {buddies.map((buddy) => (
            <div
              key={buddy.id}
              className={`buddy-item${selectedPeer?.id === buddy.id ? " active" : ""}`}
              onClick={() => setSelectedPeer(buddy)}
              style={{
                cursor: "pointer",
                padding: "8px",
                borderRadius: "6px",
                background: selectedPeer?.id === buddy.id ? "#222258" : "transparent",
                display: "flex",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <img
                src={buddy.avatar}
                alt={buddy.name}
                style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
              />
              <span style={{ color: "white" }}>{buddy.name}</span>
            </div>
          ))}
        </div>

        {/* Logged In Accounts Section */}
        <div
          className="logged-in-accounts"
          style={{
            marginTop: 20,
            padding: "0 10px",
            borderTop: "1px solid #444",
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          <h4 style={{ color: "#ccc", marginBottom: 10 }}>Logged In Accounts</h4>
          {loggedInUsers.map((account) => (
            <div
              key={account.id}
              className={`account-item${selectedPeer?.id === account.id ? " active" : ""}`}
              onClick={() => setSelectedPeer({
                id: account.id,
                name: account.username,
                avatar: account.avatar
              })}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 8,
                background: selectedPeer?.id === account.id ? "#222258" : "transparent",
                borderRadius: 6,
                padding: 8,
                cursor: "pointer"
              }}
            >
              <img
                src={account.avatar}
                alt={account.username}
                style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 10 }}
              />
              <span style={{ color: "white" }}>{account.username}</span>
            </div>
          ))}
        </div>

        {/* Left-bottom settings button */}
        <div className="settings-bottom" style={{ marginTop: "auto", padding: 10 }}>
          <button
            className="btn-settings"
            onClick={() => setShowProfileModal(true)}
            title="Settings"
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: 24,
            }}
          >
            ⚙️
          </button>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setChatMaximized(!isChatMaximized)}
        aria-label={isChatMaximized ? "Minimize chat" : "Maximize chat"}
        style={{
          alignSelf: "center",
          background: "transparent",
          border: "none",
          color: "#999",
          fontSize: 24,
          cursor: "pointer",
          margin: "0 8px",
          userSelect: "none",
          height: 40,
        }}
      >
        {isChatMaximized ? "➤" : "◀"}
      </button>

      {/* Main Chat Window */}
      <main
        className="pane"
        style={{
          flexGrow: 1,
          width: isChatMaximized ? "calc(100% - 300px - 40px)" : "calc(100% - 400px - 40px)",
          transition: "width 0.3s",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ChatWindow peer={selectedPeer} />
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Profile</h3>
            <div className="modal-avatar">
              <img src={newAvatar} alt="Profile" className="profile-photo" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleProfileUpdate}>Save</button>
              <button onClick={logout}>Logout</button>
              <button onClick={() => setShowProfileModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
