import { useEffect, useRef, useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://web-socket-101.onrender.com");

    ws.current.onopen = () => {
      setMessages((msgs) => [...msgs, "Connected to server"]);
    };

    ws.current.onmessage = (event) => {
      setMessages((msgs) => [...msgs, event.data]);
    };

    ws.current.onclose = () => {
      setMessages((msgs) => [...msgs, "Disconnected from server"]);
    };

    ws.current.onerror = () => {
      setMessages((msgs) => [...msgs, "WebSocket error"]);
    };

    return () => {
      ws.current && ws.current.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (
      input.trim() &&
      ws.current &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      ws.current.send(input);
      setInput("");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        border: "1px solid #ccc",
        padding: 16,
      }}
    >
      <h2>WebSocket Chat</h2>
      <div
        style={{
          minHeight: 200,
          marginBottom: 12,
          background: "#f9f9f9",
          padding: 8,
          overflowY: "auto",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "4px 0" }}>
            {msg}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={!input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
