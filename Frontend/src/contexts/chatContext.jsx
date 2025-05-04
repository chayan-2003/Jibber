import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [socket, setSocket] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isCreating, setisCreating] = useState(false);
    const [newRoom, setNewRoom] = useState('');
    const [newRoomDescription, setNewRoomDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [userRooms, setUserRooms] = useState([]);

    useEffect(() => {
        const SOCKET_SERVER_URL = 'https://jibber-backend.onrender.com';
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || {});
        const newSocket = io(SOCKET_SERVER_URL, {
            transports: ["websocket", "polling"],
            auth: {
                user: userInfo
            },
        });

        console.log("Initializing Socket.IO client:", newSocket);
        setSocket(newSocket);
    }, []);



    return (
        <ChatContext.Provider value={{
            selectedRoom, setSelectedRoom, socket, isDarkMode, setIsDarkMode, isCreating, setisCreating
            , newRoom, setNewRoom, newRoomDescription, setNewRoomDescription, error, setError, loading, setLoading, rooms, setRooms, userRooms, setUserRooms
        }}>
            {children}
        </ChatContext.Provider>
    );
};
