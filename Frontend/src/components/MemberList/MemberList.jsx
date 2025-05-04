import React from "react";
import { FaCircle } from "react-icons/fa";
import { useContext } from "react";
import { ChatContext } from "../../contexts/chatContext";

const MemberList = ({ selectedRoom, onlineUsers, usersTyping}) => {
  const { isDarkMode } = useContext(ChatContext);
  const bgColor = isDarkMode ? "bg-zinc-900" : "bg-white";
  const textColor = isDarkMode ? "text-gray-100" : "text-blue-800";
  const subTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = isDarkMode ? "border-zinc-800" : "border-gray-200";
  const hoverBg = isDarkMode ? "hover:bg-zinc-800" : "hover:bg-gray-100";
  const typingColor = isDarkMode ? "text-sky-400" : "text-sky-600";

  const memberColors = React.useRef({});

  const getInitials = (name) =>
    name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase();

  return (
    <div className={`member-list relative flex flex-col h-full max-h-screen ${bgColor} border ${borderColor} font-sans`}>
      <div className={`flex items-center gap-2 py-4 px-4 sm:px-5 text-lg font-bold border-b ${borderColor} ${textColor}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
        </svg>
        <span className="truncate">Participants ({selectedRoom?.members?.length || 0})</span>
      </div>

      <ul className="flex-grow overflow-y-auto  dark:divide-zinc-800">
        {selectedRoom?.members?.map((member) => {
          if (!memberColors.current[member._id]) {
            const pastelColors = [
              "#FF9AA2", "#A29BFE", "#70C1B3", "#FFB347", "#CBAACB",
              "#B39EB5", "#A3D2CA", "#F6C6EA", "#E6B89C", "#FF968A",
              "#C3B1E1", "#D4A5A5", "#B5CDA3", "#A8C5DA", "#C0A9BD"
            ];
            memberColors.current[member._id] = pastelColors[Math.floor(Math.random() * pastelColors.length)];
          }

          const memberColor = memberColors.current[member._id];
          const isOnline = onlineUsers?.has(member._id);
          const isTyping = usersTyping?.has(member._id);

          return (
            <li key={member._id} className={`flex items-center justify-between px-4 sm:px-5 py-3 ${hoverBg} transition duration-150`}>
              <div className="flex items-center space-x-3 sm:space-x-4 w-full">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md shrink-0" style={{ backgroundColor: memberColor }}>
                  {getInitials(member?.username)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`truncate font-medium ${textColor}`}>{member.username}</p>
                  <p className={`text-xs ${subTextColor}`}>
                    {isTyping ? (
                      <span className={`italic font-semibold ${typingColor}`}>Typing...</span>
                    ) : isOnline ? (
                      "Online"
                    ) : (
                      "Offline"
                    )}
                  </p>
                </div>
                {isOnline && <FaCircle className="text-green-400 text-xs mt-0.5" title="Online" />}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MemberList;
