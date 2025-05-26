import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import { LuTrash2 } from "react-icons/lu";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import SelectDropDown from "../../components/Inputs/SelectDropDown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import Modal from "../../components/layouts/Modal";


import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { PRIORITY_DATA } from "../../utils/data";
import DeleteAlert from "../../components/layouts/DeleteAlert";

const defaultTaskData = {
  title: "",
  description: "",
  priority: "low",
  dueDate: null,
  assignedTo: [],
  todoCheckList: [],
  attachments: [],
};

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState(defaultTaskData);
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => setTaskData(defaultTaskData);

  const handleSubmit = async () => {
    setError("");

    if (!taskData.title.trim()) return setError("Title is required");
    if (!taskData.description.trim()) return setError("Description is required");
    if (!taskData.dueDate) return setError("Due date is required");
    if (taskData.assignedTo.length === 0) return setError("Assign the task to at least one user");

    taskId ? await updateTask() : await createTask();
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const formattedChecklist = taskData.todoCheckList.map((text) => ({
        text,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheckList: formattedChecklist,
      });

      toast.success("Task created successfully");
      resetForm();
      navigate("/tasks");
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      const updatedChecklist = taskData.todoCheckList.map((text) => {
        const prevItem = currentTask?.todoCheckList?.find((item) => item.text === text);
        return { text, completed: prevItem?.completed || false };
      });

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheckList: updatedChecklist,
      });

      toast.success("Task updated successfully");
      navigate("/admin/tasks");
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Task deleted successfully");
      navigate("/admin/tasks");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task");
    }
  };

  const fetchTaskDetails = async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      setCurrentTask(data);

      setTaskData({
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? moment(data.dueDate).format("YYYY-MM-DD") : null,
        assignedTo: data.assignedTo?.map((user) => user?._id) || [],
        todoCheckList: data.todoCheckList?.map((item) => item.text) || [],
        attachments: data.attachments || [],
      });
    } catch (err) {
      console.error("Error fetching task:", err);
      toast.error("Failed to fetch task");
    }
  };

  useEffect(() => {
    if (taskId) fetchTaskDetails();
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  onClick={() => setOpenDeleteAlert(true)}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300"
                >
                  <LuTrash2 className="text-base" />
                  Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600">Task Title</label>
              <input
                className="form-input"
                placeholder="Create App UI"
                value={taskData.title}
                onChange={(e) => handleValueChange("title", e.target.value)}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Description</label>
              <textarea
                rows={4}
                className="form-input"
                placeholder="Describe the task"
                value={taskData.description}
                onChange={(e) => handleValueChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Priority</label>
                <SelectDropDown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(val) => handleValueChange("priority", val)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={taskData.dueDate || ""}
                  onChange={(e) => handleValueChange("dueDate", e.target.value)}
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">Assign To</label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(val) => handleValueChange("assignedTo", val)}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">TODO Checklist</label>
              <TodoListInput
                todoList={taskData.todoCheckList}
                setTodoList={(val) => handleValueChange("todoCheckList", val)}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Add Attachments</label>
              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(val) => handleValueChange("attachments", val)}
              />
            </div>

            {error && <p className="text-xs text-red-500 mt-5">{error}</p>}

            <div className="flex justify-end mt-7">
              <button className="add-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Processing..." : taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={deleteTask}
          onCancel={() => setOpenDeleteAlert(false)}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
