import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import { ChatContext } from '../../contexts/chatContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaBars, FaTimes, FaSun, FaMoon, FaArrowLeft } from 'react-icons/fa';

const APIURL = "https://jibber-backend.onrender.com";

const Sidebar = () => {
    const [filteredRooms, setFilteredRooms] = useState([]); // For search functionality
    const [searchQuery, setSearchQuery] = useState(''); // Search query state
    const { isDarkMode, setIsDarkMode, isCreating, setisCreating, error,
        setError, loading, setLoading, rooms, setRooms, userRooms, setUserRooms } = useContext(ChatContext);

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        const theme = !isDarkMode ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        document.body.classList.toggle('dark', !isDarkMode);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
        }
    }, [isDarkMode, setIsDarkMode]);

    const { selectedRoom, setSelectedRoom } = useContext(ChatContext);

    const fetchRooms = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const roomsResponse = await axios({
                method: 'get',
                url: `${APIURL}/api/rooms/all`,
                withCredentials: true
            });
            setRooms(roomsResponse.data);

            const userInfoResponse = await axios({
                method: 'get',
                url: `${APIURL}/api/users/profile`,
                withCredentials: true
            });
            const userInfo = userInfoResponse.data;

            const joinedRooms = roomsResponse.data
                ?.filter(room => room?.members?.some(member => member?._id === userInfo?._id))
                .map(room => room?._id);
            setUserRooms(joinedRooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            if (error.response) {
                setError(error.response.data.message || 'Failed to fetch rooms.');
                if (error.response.status === 401 || error.response.status === 403) {
                    navigate('/login');
                }
            } else if (error.request) {
                setError('No response from server. Please try again later.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate, setError, setLoading, setRooms, setUserRooms]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const handleJoinRoom = async (roomId) => {
        try {
            setLoading(true);
            setError('');

            await axios({
                method: 'post',
                url: `${APIURL}/api/rooms/join/${roomId}`,
                withCredentials: true
            });
            setUserRooms(prevUserRooms => [...prevUserRooms, roomId]);

            const joinedRoom = rooms.find(room => room._id === roomId);
            if (joinedRoom) {
                setSelectedRoom(joinedRoom);
            }
        } catch (error) {
            console.error('Error joining room:', error);
            if (error.response) {
                setError(error.response.data.message || 'Failed to join room.');
                if (error.response.status === 401 || error.response.status === 403) {
                    navigate('/login');
                }
            } else if (error.request) {
                setError('No response from server. Please try again later.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveRoom = async (roomId) => {
        try {
            setLoading(true);
            setError('');

            await axios({
                method: 'post',
                url: `${APIURL}/api/rooms/leave/${roomId}`,
                data: {},
                withCredentials: true
            });
            setUserRooms(prevUserRooms => prevUserRooms.filter(id => id !== roomId));

            if (selectedRoom && selectedRoom._id === roomId) {
                setSelectedRoom(null);
            }
        } catch (error) {
            console.error('Error leaving room:', error);
            if (error.response) {
                setError(error.response.data.message || 'Failed to leave room.');
                if (error.response.status === 401 || error.response.status === 403) {
                    navigate('/login');
                }
            } else if (error.request) {
                setError('No response from server. Please try again later.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredRooms(rooms);
        } else {
            const filtered = rooms.filter(room =>
                room.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredRooms(filtered);
        }
    }, [searchQuery, rooms]);

    const handleLogout = async () => {
        try {
            await axios({
                method: 'post',
                url: `${APIURL}/api/users/logout`,
                withCredentials: true
            });
            localStorage.removeItem('userInfo');
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
            setError('Failed to logout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Dark Mode Toggle */}
            <div className="fixed top-4 right-4 z-50 text-2xl cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-300" onClick={toggleDarkMode}>
                {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-400" />}
            </div>

            {/* Hamburger for small screens */}
            <div
                className="md:hidden fixed top-2 left-2 z-50 p-2 bg-black shadow-lg rounded-full text-lg cursor-pointer text-white hover:text-blue-600 hover:bg-gray-100 transition-all duration-300"
                onClick={toggleSidebar}
            >
                {isOpen ? <FaTimes /> : <FaBars />}
            </div>


            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-64 md:w-1/4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-2xl z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col justify-between ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

                <div className="animate-fade-in px-4 py-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 px-4 py-3 rounded-2xl shadow-md" style={{ background: isDarkMode ? '#1f2937' : '#e0f2fe' }}>
                        <h2 className={`text-2xl font-extrabold italic tracking-wide bg-gradient-to-r ${isDarkMode ? 'from-blue-300 to-purple-400' : 'from-blue-700 to-purple-500'} text-transparent bg-clip-text`}>
                            Chat Rooms
                        </h2>
                        <i
                            className={`fa-solid fa-circle-plus ${isDarkMode ? 'text-green-300' : 'text-green-700'} text-xl cursor-pointer hover:scale-110 transition-transform duration-300`}
                            onClick={() => setisCreating(!isCreating)}
                            title="Create Room"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Rooms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full px-3 py-2 rounded-md mb-6 border text-sm focus:outline-none focus:ring-2 pl-10 ${isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-400'
                                : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                                }`}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-3 top-1/3 -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    {/* Error message */}
                    {error && (
                        <div className={`${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'} border border-red-400 px-3 py-2 rounded-md text-sm mb-4 animate-shake`}>
                            {error}
                        </div>
                    )}

                    {/* Room List */}
                    <ul className="space-y-1 overflow-y-auto overflow-x-hidden">
                        {loading && (
                            <li className="text-sm text-gray-500 italic animate-pulse py-3 px-4">
                                Loading chats...
                            </li>
                        )}

                        {!loading && rooms.length === 0 && (
                            <li className="text-sm text-gray-500 py-3 px-4">
                                No chats yet.
                                <span className="text-blue-500 italic ml-1">Start a new one!</span>
                            </li>
                        )}

                        {filteredRooms?.map((room) => (
                            <li
                                key={room._id}
                                className={`p-3 rounded-lg cursor-pointer transition-all duration-200
                                ${selectedRoom?._id === room._id
                                        ? isDarkMode
                                            ? 'bg-gray-600 border-2 border-indigo-300'
                                            : 'bg-blue-200 border-2 border-blue-400'
                                        : userRooms?.includes(room._id)
                                            ? isDarkMode
                                                ? 'bg-gray-900 hover:bg-gray-800'
                                                : 'bg-blue-50 hover:bg-blue-100'
                                            : isDarkMode
                                                ? 'bg-gray-900 hover:bg-gray-800'
                                                : 'bg-blue-50 hover:bg-blue-100'
                                    }`}
                                onClick={() => userRooms?.includes(room._id) && setSelectedRoom(room)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isDarkMode ? 'bg-white text-gray-800' : 'bg-white text-gray-700'}`}>
                                            {room.name[0]?.toUpperCase()}
                                        </div>
                                        {userRooms?.includes(room._id) && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <div className="font-bold text-sm truncate">{room.name}</div>
                                        <div className="text-xs text-gray-500 truncate">
                                            {room.description || <em>No description</em>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        {!userRooms?.includes(room._id) ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleJoinRoom(room._id);
                                                }}
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                            >
                                                Join
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLeaveRoom(room._id);
                                                }}
                                                className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-1 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                                            >
                                                Leave
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Optional: Logout Button */}
                <div className="flex items-center justify-between px-4 mt-auto">
                    {/* Home Button */}
                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 rounded-md bg-blue-800 text-white hover:bg-blue-600 transition duration-200"
                            title="Go to Home"
                        >
                            <FaArrowLeft className="w-6 h-6 animate-bounce" />
                        </button>
                    </div>

                    {/* Logout Button */}
                    <div className="p-4 sm:p-5 flex justify-end">
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-md shadow-md bg-red-500 text-white hover:bg-red-600 transition duration-200"
                            title="Logout"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12h-9m0 0l3-3m-3 3l3 3" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Sidebar;