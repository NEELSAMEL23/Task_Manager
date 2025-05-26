import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import Modal from "../layouts/Modal";
import AvatarGroup from "../layouts/AvatarGroup";

const SelectUsers = ({ selectedUsers = [], setSelectedUsers }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all users on component mount
    const getAllUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            if (Array.isArray(response.data)) {
                setAllUsers(response.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Toggle selection state
    const toggleUserSelection = (userId) => {
        setTempSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    // Assign selected users to parent state
    const handleAssign = () => {
        setSelectedUsers(tempSelectedUsers);
        setIsModalOpen(false);
    };

    // Open modal and sync temp state
    const handleOpenModal = () => {
        setTempSelectedUsers(selectedUsers);
        setIsModalOpen(true);
    };

    const selectedUserAvatars = allUsers
        .filter((user) => selectedUsers.includes(user._id))
        .map((user) => user.profileImageUrl);

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div className="space-y-4 mt-2">
            {selectedUserAvatars.length === 0 ? (
                <button className="card-btn" onClick={handleOpenModal}>
                    <LuUsers className="text-sm" />
                    Add Member
                </button>
            ) : (
                <button className="cursor-pointer" onClick={handleOpenModal}>
                    <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
                    Add Member
                </button>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Select Users">
                <div className="space-y-4 h-[60vh] overflow-y-auto">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading users...</p>
                    ) : (
                        allUsers.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center gap-4 p-3 border-b border-gray-200"
                            >
                                <img
                                    src={user.profileImageUrl}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {user.name}
                                    </p>
                                    <p className="text-[13px] text-gray-500">{user.email}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={tempSelectedUsers.includes(user._id)}
                                    onChange={() => toggleUserSelection(user._id)}
                                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
                                />
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button className="btn-cancel hover:cursor-pointer" onClick={() => setIsModalOpen(false)}>
                        CANCEL
                    </button>
                    <button className="card-btn-fill bg-blue-500" onClick={handleAssign}>
                        DONE
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default SelectUsers;
