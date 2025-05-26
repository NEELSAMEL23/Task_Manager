import Task from "../models/Task.js";
import User from "../models/User.js";

// Get all users (Admin only)
const getUser = async (req, res) => {
    try {
        const users = await User.find({ role: "member" }).select("-password"); // Exclude password

        const userWithTaskCount = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "pending",
                });

                const inProgressTask = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "in-progress",
                });

                const completeTask = await Task.countDocuments({
                    assignedTo: user._id,
                    status: "completed",
                });

                return {
                    ...user._doc,
                    pendingTasks,
                    inProgressTask,
                    completeTask,
                };
            })
        );

        res.status(200).json(userWithTaskCount);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

     

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



export { getUser, getUserById  };
