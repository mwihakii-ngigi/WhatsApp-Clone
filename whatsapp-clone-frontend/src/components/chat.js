import React, {useState, useEffect} from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:8080');

function chat() {
const [messages, setMessages] = useState([]);
const [input, setInput] = useState('');
const [username, setUsername] = useState('');
const [isConnected, setIsConnected] = useState(false);

useEffect(() => {
    socket.on('connect', () =>{
        console.log('connected');
        setIsConnected(true);
    });

    socket.on('message', (msg) =>{
        setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return() => {
        socket.off('connect');
        socket.off('message');
    };
}, []);

const sendMessage = () => {
    if (input.trim()) {
        const message = '${username}: ${input}';
        socket.emit('message', message);
    }
};
const handleUsernameSubmit = () => {
    if (username.trim()) {
        setIsConnected(true);
    }
};

if (!isConnected) {
    return (
        <div>
            <h2>Enter your username:</h2>
            <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleUsernameSubmit}>Join chat</button>
        </div>
    );
}
return (
    <div>
        <div>
            {messages.map((msg, index) => (
                <p key={index}>msg</p>
            ))}
        </div>
        <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>send</button>
    </div>
);

}

export default chat;