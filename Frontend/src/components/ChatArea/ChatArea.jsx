import React, { useEffect, useContext, useState, useCallback, useRef } from "react";
import { ChatContext } from "../../contexts/chatContext";
import axios from "../../utils/axiosConfig";
import ChatMessages from "../ChatMessages/ChatMessage.jsx";
import MemberList from "../MemberList/MemberList.jsx";

const ChatArea = () => {
  const { selectedRoom, socket } = useContext(ChatContext);
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [usersTyping, setUsersTyping] = useState(new Set());
  const [showMembers, setShowMembers] = useState(false);
  const typingTimeoutRef = useRef(null);
  const APIURL = "https://jibber-backend.onrender.com";

  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(`${APIURL}/api/users/profile`);
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to fetch user.");
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const fetchMessages = useCallback(async () => {
    if (!selectedRoom) return;
    try {
      const response = await axios.get(`${APIURL}/api/chats/${selectedRoom._id}`);
      const messagesData = response.data.map((message) => ({
        sender: message.user.username,
        text: message.message,
        timestamp: message.createdAt,
      }));
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to fetch messages.");
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (selectedRoom && socket) {
      fetchMessages();
      socket.emit("joinRoom", selectedRoom._id);

      socket.on("onlineUsers", (userIds) => {
        setOnlineUsers(new Set(userIds));
      });

      return () => {
        socket.off("onlineUsers");
      };
    }
  }, [selectedRoom, socket, fetchMessages]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: message.sender, text: message.text, timestamp: new Date() },
        ]);
      };

      socket.on("newMessage", handleNewMessage);

      if (selectedRoom) {
        socket.on("userTyping", (userIds) => {
          setUsersTyping(new Set(userIds));
        });
        socket.on("userStopTyping", (userId) => {
          setUsersTyping((prev) => {
            const typingSet = new Set(prev);
            typingSet.delete(userId);
            return typingSet;
          });
        });
      }

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("userTyping");
        socket.off("userStopTyping");
      };
    }
  }, [socket, selectedRoom]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !selectedRoom) return;
    socket.emit("sendMessage", {
      text: newMessage,
      sender: user.username,
      roomId: selectedRoom._id,
    });
    setNewMessage("");
  };

  const emitTyping = () => {
    if (socket && user && selectedRoom) {
      socket.emit("typing", { sender: user._id, roomId: selectedRoom._id });
    }
  };

  const typing = (e) => {
    setNewMessage(e.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    emitTyping();

    typingTimeoutRef.current = setTimeout(() => {
      if (socket && user && selectedRoom) {
        socket.emit("stopTyping", { sender: user._id, roomId: selectedRoom._id });
      }
    }, 1000);
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("whatsappTheme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    localStorage.setItem("whatsappTheme", theme);
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full">
      {/* Chat Area */}
      <div className="flex flex-col w-full lg:w-4/5 border-r border-gray-300 dark:border-gray-700 h-full">
        <div className="flex-1 overflow-y-auto">
          {selectedRoom ? (
            <ChatMessages
              messages={messages}
              user={user}
              newMessage={newMessage}
              typing={typing}
              sendMessage={sendMessage}
              error={error}
              isDarkMode={isDarkMode}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-lg font-medium">
              JOIN AND OPEN A ROOM TO CHAT
            </div>
          )}
        </div>

        {/* Participants toggle (always at bottom on small screens) */}
        <div className="block lg:hidden border-t border-gray-300 dark:border-gray-700 mt-auto">
          <button
            onClick={() => setShowMembers((prev) => !prev)}
            className="w-full text-sm font-medium p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 flex justify-between items-center"
            title="Participants List"
          >
            Participants
            <span>{showMembers ? "▲" : "▼"}</span>
          </button>
          {showMembers && selectedRoom && (
            <div className="max-h-60 overflow-y-auto border-t border-gray-300 dark:border-gray-600">
              <MemberList
                selectedRoom={selectedRoom}
                onlineUsers={onlineUsers}
                usersTyping={usersTyping}
                isDarkMode={isDarkMode}
              />
            </div>
          )}
        </div>
      </div>

      {/* MemberList on large screens */}
      <div className="hidden lg:block w-1/5 overflow-y-auto border-l border-gray-200 dark:border-gray-700">
        {selectedRoom && (
          <MemberList
            selectedRoom={selectedRoom}
            onlineUsers={onlineUsers}
            usersTyping={usersTyping}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
};

export default ChatArea;
