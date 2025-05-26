import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/Inputs/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';

const ManageTask = () => {
    const [allTasks, setAllTasks] = useState([]);
    const [filterStatus, setFilterStatus] = useState("All");
    const [tabs, setTabs] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const formatStatusTabs = (summary) => [
        { label: "All", count: summary.all || 0 },
        { label: "Pending", count: summary.pendingTasks || 0 },
        { label: "In Progress", count: summary.inProgressTasks || 0 },
        { label: "Completed", count: summary.completedTasks || 0 }
    ];

    const getAllTask = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASK, {
                params: { status: filterStatus === "All" ? "" : filterStatus }
            });

            setAllTasks(response.data?.tasks || []);
            const statusSummary = response.data?.statusSummary || {};
            setTabs(formatStatusTabs(statusSummary));
        } catch (error) {
            console.error("Failed to fetch tasks", error);
            toast.error("Failed to fetch tasks. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (taskData) => {
        navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
    };

    const handleDownloadReport = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
                responseType: "blob"
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "user_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link)
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading report", error);
            toast.error("Failed to download report. Please try again.");
        }
    };

    useEffect(() => {
        getAllTask();
    }, [filterStatus]);

    return (
        <DashboardLayout activeMenu="Manage Tasks">
            <div className="my-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-medium">My Tasks</h2>
                        <button className="flex lg:hidden download" onClick={handleDownloadReport}>
                            <LuFileSpreadsheet className="text-lg" />
                            Download Report
                        </button>
                    </div>

                    {tabs.length > 0 && (
                        <div className="flex items-center gap-3">
                            <TaskStatusTabs
                                tabs={tabs}
                                activeTab={filterStatus}
                                setActiveTab={setFilterStatus}
                            />
                            <button
                                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                onClick={handleDownloadReport}
                            >
                                <LuFileSpreadsheet className="text-lg" />
                                Download Report
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <p className="text-center mt-8">Loading tasks...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {allTasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                title={task.title}
                                description={task.description}
                                priority={task.priority}
                                status={task.status}
                                progress={task.progress}
                                createdAt={task.createdAt}
                                dueDate={task.dueDate}
                                assignedTo={task.assignedTo?.map((a) => a.profileImageUrl)}
                                attachmentCount={task.attachmentCount || 0}
                                completedTodoCount={task.completedTodoCount || 0}
                                todoChecklist={task.todoChecklist || []}
                                onClick={() => handleClick(task)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageTask;
