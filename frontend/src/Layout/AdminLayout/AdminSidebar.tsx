import React from "react";

interface AdminSidebarProps {
    isSidebarOpen: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isSidebarOpen }) => {
    return (
        <aside className={`bg-green-200 h-screen ${isSidebarOpen ? 'block' : 'hidden'} md:block w-64 flex flex-col`}>
            <div className="flex flex-col justify-between h-full">
                <div className="py-4 px-3">
                    <div className="text-green-800 text-xl font-bold mb-4">Admin Panel</div>
                    <ul className="flex flex-col space-y-4">
                        <li>
                            <button className="w-full text-left bg-green-600 text-white py-3 px-4 rounded-full hover:bg-green-700">
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button className="w-full text-left bg-green-600 text-white py-3 px-4 rounded-full hover:bg-green-700">
                                Users
                            </button>
                        </li>
                        <li>
                            <button className="w-full text-left bg-green-600 text-white py-3 px-4 rounded-full hover:bg-green-700">
                                Issues
                            </button>
                        </li>
                        <li>
                            <button className="w-full text-left bg-green-600 text-white py-3 px-4 rounded-full hover:bg-green-700">
                                Banner Management
                            </button>
                        </li>
                    </ul>
                </div>
                {/* Add spacing between buttons and bottom */}
                <div className="py-4 px-3">
                    {/* Optional space for footer or additional content */}
                </div>
            </div>
        </aside>
    )
}

export default AdminSidebar;
