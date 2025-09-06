import React from "react";

const ChatList = ({ chats, selectedId, onSelectChat }) => {
  return (
    <>
      {chats.map((c) => (
        <div
          key={c.id}
          className={`item ${selectedId===c.id ? "active":""}`}
          onClick={() => onSelectChat(c)}
        >
          <img src={c.avatar} alt={c.name} className="avatar" />
          <div style={{minWidth:0}}>
            <div className="name">{c.name}</div>
            <div className="snippet" title={c.lastMessage}>{c.lastMessage}</div>
          </div>
          {c.unread>0 && <span className="badge">{c.unread}</span>}
        </div>
      ))}
    </>
  );
};

export default ChatList;
