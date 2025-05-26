import excelJS from "exceljs";
import Task from "../models/Task.js";
import User from "../models/User.js";

// Export Task Report
const exportTaskReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email");

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");

        worksheet.columns = [
            { header: "S.No", key: "s_no", width: 6 },
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Status", key: "status", width: 15 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 25 },
            { header: "Created At", key: "createdAt", width: 20 }
        ];

        let counter = 1;
        tasks.forEach((task) => {
            worksheet.addRow({
                s_no: counter++,
                _id: task.id,
                title: task.title,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate?.toISOString().split("T")[0],
                assignedTo: task.assignedTo ? `${task.assignedTo.name} (${task.assignedTo.email})` : "Unassigned",
                createdAt: task.createdAt.toISOString().split("T")[0]
            });
        });

        // Set header type
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=tasks_report.xlsx");

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: "Error exporting task", error: error.message });
    }
};

// Export User Report
const exportUserReport = async (req, res) => {
    try {
        const users = await User.find().select("name email _id").lean();
        const usersTasks = await Task.find().populate("assignedTo", "name email _id");

        const userTaskMap = {};

        // Initialize user map
        users.forEach((user) => {
            userTaskMap[user._id] = {
                Name: user.name,
                Email: user.email,
                TotalTasks: 0,
                Pending: 0,
                InProgress: 0,
                Completed: 0,
            };
        });

        // Count task stats
        usersTasks.forEach((task) => {
            const assignedUser = task.assignedTo;
            if (assignedUser && userTaskMap[assignedUser._id]) {
                const stats = userTaskMap[assignedUser._id];
                stats.TotalTasks += 1;

                switch (task.status) {
                    case "Pending":
                        stats.Pending += 1;
                        break;
                    case "In Progress":
                        stats.InProgress += 1;
                        break;
                    case "Completed":
                        stats.Completed += 1;
                        break;
                }
            }
        });

        // Excel export logic
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("User Tasks Report");

        worksheet.columns = [
            { header: "Name", key: "Name", width: 25 },
            { header: "Email", key: "Email", width: 30 },
            { header: "Total Tasks", key: "TotalTasks", width: 15 },
            { header: "Pending", key: "Pending", width: 12 },
            { header: "In Progress", key: "InProgress", width: 15 },
            { header: "Completed", key: "Completed", width: 12 },
        ];

        Object.values(userTaskMap).forEach((userStats) => {
            worksheet.addRow(userStats);
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=users_report.xlsx");

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: "Error exporting user", error: error.message });
    }
};

export { exportTaskReport, exportUserReport };
