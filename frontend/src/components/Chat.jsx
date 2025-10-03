import { useEffect, useRef, useState } from "react";

const WS_URI = import.meta.env.VITE_WS_URI;
// const WS_PORT = import.meta.env.VITE_WS_PORT; you can use ${WS_URI}:${WS_PORT} but it wont work so use one. why you ask funny, i scratch my head too. possible this is this convention!

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    if (!WS_URI) {
      console.error("WebSocket URI is missing");
    } else {
      ws.current = new WebSocket(`${WS_URI}`);
      console.log(`Connecting to WebSocket server... via ${WS_URI}`);
    }

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
    <div className="flex-col min-w-[320px] max-w-auto shrink-0 mx-2 my-2 pt-10 p-4 border border-red-700">
      <h2 className="text-5xl text-center font-bold w-full">Secure Chat</h2>

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
