import './styles.css'; // assuming you have a CSS file for styling
import { useState } from 'react';

export default function ChatPage() {
    const [messages, setMessages] = useState<string[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            setMessages([...messages, newMessage]);
            setNewMessage('');
        }
    };

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className="message-area">
                {messages.map((message, index) => (
                    <div key={index} className="message">{message}</div>
                ))}
            </div>
            <div className="input-area">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}