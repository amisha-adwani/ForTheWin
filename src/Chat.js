import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';
import langflowClient from './services/LangflowService';

const Chat = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (inputMessage.trim() === '') return;

        // Add user message
        const newMessages = [...messages, { text: inputMessage, sender: 'user' }];
        setMessages(newMessages);
        
        try {
            const flowIdOrName = '01e9f89a-fdd9-4975-9a28-2fe47a2265d8';
            const langflowId = 'e45ff30b-a86b-4fdd-ae0d-047d63109aa2';
            const tweaks = {
                "ChatInput-39jCB": {},
                "AstraDBToolComponent-6MlzD": {},
                "Prompt-ow0p5": {},
                "GoogleGenerativeAIModel-z7fUL": {},
                "ParseData-pw7Sb": {},
                "ChatOutput-fbqSQ": {}
            };

            let botResponse = '';

            // Add a loading message
            setMessages(prev => [...prev, { text: "Thinking...", sender: 'bot', isLoading: true }]);

            await langflowClient.runFlow(
                flowIdOrName,
                langflowId,
                inputMessage,
                'chat',
                'chat',
                tweaks,
                true,
                (data) => {
                    if (data.chunk) {
                        botResponse += data.chunk;
                        // Remove loading message and update with actual response
                        setMessages(prev => {
                            const filtered = prev.filter(msg => !msg.isLoading);
                            return [...filtered, { text: botResponse, sender: 'bot' }];
                        });
                    }
                },
                (message) => {
                    console.log("Stream Closed:", message);
                    if (!botResponse) {
                        setMessages(prev => {
                            const filtered = prev.filter(msg => !msg.isLoading);
                            return [...filtered, { 
                                text: "I couldn't process your request. Please try again.", 
                                sender: 'bot' 
                            }];
                        });
                    }
                },
                (error) => {
                    console.error("Stream Error:", error);
                    setMessages(prev => {
                        const filtered = prev.filter(msg => !msg.isLoading);
                        return [...filtered, { 
                            text: `Error: ${error}. Please try again.`, 
                            sender: 'bot' 
                        }];
                    });
                }
            );
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => {
                const filtered = prev.filter(msg => !msg.isLoading);
                return [...filtered, { 
                    text: `Sorry, there was an error: ${error.message}. Please try again.`, 
                    sender: 'bot' 
                }];
            });
        }

        setInputMessage('');
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat Assistant</h2>
            </div>
            
            <div className="chat-messages">
                <div className="messages-wrapper">
                    {messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`message-wrapper ${message.sender}-wrapper`}
                        >
                            <div className={`message ${message.sender}-message`}>
                                {message.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input"
                />
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
