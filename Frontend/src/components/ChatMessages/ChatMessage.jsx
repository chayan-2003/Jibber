import React, { useContext,useRef, useEffect,} from "react";
import { Send } from "lucide-react"; 
import { FaArrowDown } from "react-icons/fa"; 
import { ChatContext } from "../../contexts/chatContext";

const ChatMessages = ({
    messages,
    user,
    newMessage,
    typing,
    sendMessage,
    error,
}) => {
    const messagesEndRef = useRef(null); // Ref for the latest message
    const messageContainerRef = useRef(null); // Reference to the message container

    const { isDarkMode, setIsDarkMode } = useContext(ChatContext);
    // Scroll to the bottom of the messages container whenever a new message is sent
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]); // Trigger scroll when messages change (after sending a message)

    useEffect(() => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                setIsDarkMode(savedTheme === 'dark');
            } else {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setIsDarkMode(prefersDark);
            }
    }, [isDarkMode, setIsDarkMode]);

    const scrollToLatestMessage = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getMessageTime = (timestamp) => {
        try {
            const date = new Date(timestamp);
            let hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? "pm" : "am";
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            const minutesStr = minutes < 10 ? "0" + minutes : minutes;
            return hours + ":" + minutesStr + " " + ampm;
        } catch (e) {
            console.error("Error formatting timestamp:", e);
            return "Invalid Time";
        }
    };

    const getRandomColor = () => {
        const colors = [
            "text-red-500",
            "text-green-500",
            "text-blue-500",
            "text-purple-500",
            "text-yellow-500",
            "text-pink-600"
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };
   

    return (
        <div
            className={`flex flex-col h-full ${isDarkMode ? "bg-gray-900 text-white" : "bg-blue-50 text-gray-900"
                }`}
        >
           
            {/* Messages Display Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {messages.map((message, index) => {
                    const isSent = message.sender === user.username;
                    return (
                        <div
                            key={index}
                            className={`flex flex-col ${isSent ? "items-end" : "items-start"
                                }`}
                        >
                            {/* Sender Name */}
                            {!isSent && (
                                <p
                                    className={`text-xs font-semibold mb-1 ${isDarkMode ? getRandomColor() : getRandomColor()
                                        }`}
                                    style={{ fontFamily: "Arial, sans-serif" }}
                                >
                                    {message.sender}
                                </p>
                            )}
                            {/* Message Box */}
                            <div
                                className={`rounded-xl px-4 py-2 max-w-[80%] md:max-w-[60%] shadow-md ${isSent
                                    ? "bg-blue-500 text-white ml-auto"
                                    : isDarkMode
                                        ? "bg-gray-600 text-white mr-auto"
                                        : "bg-white text-gray-900 mr-auto"
                                    }`}
                            >
                                <p className="text-sm">{message.text}</p>
                                <div className="flex justify-end">
                                    <span className="text-xs opacity-70 whitespace-nowrap">
                                        {getMessageTime(message.timestamp)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {/* Reference for the latest message */}
                <div ref={messagesEndRef} />
            </div>

            {/* Scroll to Latest Message Button */}
            <div className="relative">
                <div className="flex justify-center">
                    <button
                        onClick={scrollToLatestMessage}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 absolute bottom-4 left-1/2 transform -translate-x-1/2"
                        title="Scroll to latest message"
                    >
                        <FaArrowDown className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Message Input Area */}
            <div
            className={`p-3 md:p-4 border-t ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}
        >
            <form onSubmit={sendMessage} className="flex items-center gap-3">
                <input
                    type="text"
                    value={newMessage}
                    onChange={typing}
                    placeholder="Type your Message"
                    required
                    className={`flex-1 rounded-md py-2.5 px-4 ${isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75'
                        : 'bg-gray-100 border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
                    } border focus:outline-none transition-all duration-200 placeholder-gray-500`}
                />
                <button
                    type="submit"
                    className={`${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-white focus:ring-2 focus:ring-blue-300':'bg-blue-700 hover:bg-blue-600'} rounded-full p-2  transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none `}
                >
                    <Send className="h-5 w-5 text-white" />
                </button>
            </form>
            {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
        </div>
        </div>
    );
};

export default ChatMessages;