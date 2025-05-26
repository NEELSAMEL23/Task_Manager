import Task from "../models/Task.js";
import User from "../models/User.js";

const getDashboardData = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const pendingTasks = await Task.countDocuments({ status: "Pending" });

        const overdueTasks = await Task.countDocuments({
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });

        // Task status distribution
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            acc[status] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});

        // Task priority distribution (assuming priorities are Low, Medium, High)
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                completedTasks,
                pendingTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });

        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() }
        });

        // Task status distribution
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        // Task priority distribution (Low, Medium, High)
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                completedTasks,
                pendingTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};

        if (status) {
            filter.status = status;
        }

        let tasks = [];

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl");
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id });
        }

        tasks = await Promise.all(tasks.map(async (task) => {
            const completedCount = task.todoCheckList.filter(item => item.completed).length;
            return { ...task._doc, completedTodoCount: completedCount };
        }));

        const allTasks = await Task.countDocuments(req.user.role === "admin" ? {} : { assignedTo: req.user._id });

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        res.status(200).json({
            tasks, statusSummary: {
                all: allTasks, pendingTasks, completedTasks
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email");

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            status,
            dueDate,
            assignedTo,
            attachments,
            todoCheckList,
        } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ messsage: "Assigned must be an array of user IDs" });
        }

        const task = new Task({
            title,
            description,
            priority,
            status,
            dueDate,
            assignedTo,
            attachments,
            todoCheckList,
            createdBy: req.user._id,
        });

        await task.save();
        res.status(201).json({ messsage: "Task Created Successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.title = req.body.title ?? task.title;
        task.description = req.body.description ?? task.description;
        task.priority = req.body.priority ?? task.priority;
        task.status = req.body.status ?? task.status;
        task.dueDate = req.body.dueDate ?? task.dueDate;
        task.attachments = req.body.attachments ?? task.attachments;
        task.todoCheckList = req.body.todoCheckList ?? task.todoCheckList;

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();

        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    try {

        const task = await Task.findById(req.params.id)

        if (!task) return res.status(404).json({ message: "Task not found" });

        const isAssigned = task.assignedTo.some((userId) => userId.toString() === req.user._id.toString())

        if (!isAssigned && req.user.role !== "admin") return res.status(403).json({ message: "Not Authorized" });

        task.status = req.body.status || task.status

        if (task.status === "Completed") {
            task.todoCheckList.forEach((item) => (item.completed = true))
            task.progress = 100
        }

        await task.save()
        res.status(200).json({ message: "Task Status Updated", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const updateTaskChecklist = async (req, res) => {
    try {
        const { todoCheckList } = req.body;

        if (!Array.isArray(todoCheckList)) {
            return res.status(400).json({ message: "todoCheckList must be an array" });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Only assigned users or admins can update
        if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not Authorized" });
        }

        // Update checklist
        task.todoCheckList = todoCheckList;

        // Update progress
        const completedCount = todoCheckList.filter(item => item.completed).length;
        const totalItems = todoCheckList.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        // Update status based on progress
        if (task.progress === 100) {
            task.status = "Completed";
        } else if (task.progress > 0) {
            task.status = "In Progress";
        } else {
            task.status = "Pending";
        }

        await task.save();

        // Fetch updated task with populated user data
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        res.status(200).json({ message: "Checklist Updated Successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



export { getDashboardData, getUserDashboardData, createTask, getTasks, getTaskById, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist }