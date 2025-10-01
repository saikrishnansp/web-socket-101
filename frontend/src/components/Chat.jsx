import { useEffect, useRef, useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://web-socket-101.onrender.com");

    ws.current.onopen = () => {
      setMessages((msgs) => [...msgs, "Connected with server"]);
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
    // <div
    //   style={{
    //     maxWidth: 400,
    //     margin: "2rem auto",
    //     border: "1px solid #ccc",
    //     padding: 16,
    //   }}
    // >
    <div className="max-w-auto mx-2 my-2 pt-10 p-4 border border-red-700 ">
      <h2 className="text-5xl text-center font-bold">
        Secure Chat
      </h2>

      {/* <div style={{
                minHeight: 200,
                marginBottom: 12, 
                background: "#f9f9f9",
                padding: 8,
                overflowY: "auto",
            }}> */}
      <div className=" bg-blue-200 px-12 py-4 pt-10 m-4 overflow-y-auto rounded-2xl mt-10">
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            {msg}
          </div>
        ))}

        <form
          onSubmit={sendMessage}
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          <div
            className={"flex flex-row flex-grow items-center gap-2 my-4 w-full"}
          >
            <input
              className=" w-full px-4 py-3 border border-black-300 rounded-4xl text-sm placeholder-gray-400 placeholder-italic"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1 }}
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-gray-500 hover:bg-gradient-to-b  text-white rounded-full px-4 py-3 text-sm"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
