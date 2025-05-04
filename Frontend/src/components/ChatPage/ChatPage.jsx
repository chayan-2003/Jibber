import React, { useState, useEffect } from 'react';
import Sidebar from "../Sidebar/Sidebar";
import ChatArea from "../ChatArea/ChatArea";
import { useContext } from "react";
import { ChatContext } from "../../contexts/chatContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { newRoom, setNewRoom, newRoomDescription, setNewRoomDescription, isCreating, setisCreating, setError, loading, setLoading, setRooms, setUserRooms } = useContext(ChatContext);
    const [roomCreatedAlert, setRoomCreatedAlert] = useState(false);
    const APIURL = 'https://jibber-backend.onrender.com';
    const navigate = useNavigate(); // Assuming you're using react-router-dom for navigation

    useEffect(() => {
        const savedTheme = localStorage.getItem('whatsappTheme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
        }
    }, []);

    // Apply theme to <body> and store preference
    useEffect(() => {
        const theme = isDarkMode ? 'dark' : 'light';
        localStorage.setItem('whatsappTheme', theme);
        document.body.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        if (!newRoom.trim()) {
            setError('Room name cannot be empty.');
            return;
        }
        try {
            setLoading(true);
            setError('');

            const response = await axios({
                method: 'post',
                url: `${APIURL}/api/rooms/create`,
                data: {
                    name: newRoom,
                    description: newRoomDescription
                },
                withCredentials: true
            });

            setRooms(prevRooms => [...prevRooms, response?.data]);
            setUserRooms(prevUserRooms => [...prevUserRooms, response?.data?._id]);
            setisCreating(false);
            setRoomCreatedAlert(true);
            setTimeout(() => setRoomCreatedAlert(false), 3000); // Alert disappears after 3 seconds
            setisCreating(false);
            setNewRoom('');
            setNewRoomDescription('');
        } catch (error) {
            console.error('Error creating room:', error);
            if (error.response) {
                setError(error.response.data.message || 'Failed to create room.');
                if (error.response.status === 401 || error.response.status === 403) {
                    navigate('/login');
                }
            } else if (error.request) {
                setError('No response from server. Please try again later.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setisCreating(false);
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen overflow-hidden dark:bg-gray-900">
            {isCreating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <form
                        onSubmit={handleCreateRoom}
                        className={`relative space-y-3 w-11/12 max-w-md p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-br from-indigo-200 via-indigo-300 to-black text-gray-900'
                            } rounded-lg shadow-xl`}
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setisCreating(false)}
                            className="absolute top-2 right-3 text-3xl font-bold text-black hover:text-gray-700 dark:hover:text-gray-700"
                        >
                            ×
                        </button>
                        <h3 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-l from-blue-600 via-black to-blue-600 bg-clip-text text-transparent">
                            Create New Room
                        </h3>


                        <div>
                            <label htmlFor="roomName" className="text-sm font-medium">Room Name</label>
                            <input
                                type="text"
                                id="roomName"
                                value={newRoom}
                                onChange={(e) => setNewRoom(e.target.value)}
                                required
                                placeholder="Enter room name"
                                className={`mt-1 block w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-700'
                                    : 'bg-white border-gray-300 text-black focus:ring-indigo-700'
                                    }`}
                            />
                        </div>

                        <div>
                            <label htmlFor="roomDescription" className="text-sm font-medium">Description</label>
                            <input
                                type="text"
                                id="roomDescription"
                                value={newRoomDescription}
                                onChange={(e) => setNewRoomDescription(e.target.value)}
                                placeholder="Type Description"
                                className={`mt-1 block w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-700'
                                    : 'bg-white border-gray-300 text-black focus:ring-indigo-700'
                                    }`}
                            />
                        </div>
                        <div className='flex justify-end pt-4'>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-1/4 py-2 rounded-md text-md font-medium focus:outline-none focus:ring-2 transition-colors duration-300 ${isDarkMode
                                    ? 'bg-indigo-600 text-white hover:bg-blue-500'
                                    : 'bg-indigo-500 text-white hover:bg-blue-600'
                                    } disabled:bg-gray-500`}
                            >
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {roomCreatedAlert && (
                <div className="fixed bottom-4 right-4 z-50 bg-green-500 text-white shadow-md rounded-md p-4 animate-slide-in-right">
                    <div className="flex items-center">
                        <svg className="h-5 w-5 mr-2 fill-current" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Room created successfully!
                    </div>
                </div>
            )}


            <div className="flex h-full bg-gray-100 dark:bg-gray-900">
                {/* Sidebar takes 1/4 width */}
                <div className="w-0 md:w-1/4">
                    <Sidebar isDarkMode={isDarkMode} />
                </div>
                <div className="w-full md:w-3/4">
                    <ChatArea isDarkMode={isDarkMode} />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
