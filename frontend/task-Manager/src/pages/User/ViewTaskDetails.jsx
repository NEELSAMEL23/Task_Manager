import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import InfoBox from '../../components/Cards/InfoBox';
import moment from 'moment';
import AvatarGroup from '../../components/layouts/AvatarGroup';
import Attachment from '../../components/Inputs/Attachment';
import TodoChecklist from '../../components/Inputs/TodoChecklist'; // ✅ Fixed typo

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'text-cyan-500 bg-cyan-50 border border-cyan-500/10';
      case 'Completed':
        return 'text-lime-500 bg-lime-50 border border-lime-500/10';
      default:
        return 'text-violet-500 bg-violet-50 border border-violet-500/10';
    }
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const updateTodoChecklist = async (index) => {
    const updatedChecklist = [...task?.todoChecklist];
    const taskId = id;

    if (updatedChecklist[index]) {
      // Optimistically toggle
      updatedChecklist[index].completed = !updatedChecklist[index].completed;
      setTask({ ...task, todoChecklist: updatedChecklist });

      try {
        const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId), {
          todoChecklist: updatedChecklist,
        });

        if (response.status === 200) {
          setTask(response.data?.task || task);
        }
      } catch (error) {
        // Revert change on failure
        updatedChecklist[index].completed = !updatedChecklist[index].completed;
        setTask({ ...task, todoChecklist: updatedChecklist });
      }
    }
  };

  const handleLinkClick = (link) => {
    const formattedLink = /^https?:\/\//i.test(link) ? link : `https://${link}`;
    window.open(formattedLink, '_blank');
  };

  useEffect(() => {
    if (id) getTaskDetailsByID();
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-xl font-medium">{task.title || 'Untitled Task'}</h2>
                <div
                  className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(task.status)} px-4 py-0.5 rounded`}
                >
                  {task.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox label="Description" value={task.description || 'No description'} />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Priority" value={task.priority || 'N/A'} />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={task.dueDate ? moment(task.dueDate).format('Do MMM YYYY') : 'N/A'}
                  />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">Assigned To</label>
                  <AvatarGroup
                    avatars={task.assignedTo?.map((user) => user.profileImageUrl) || []}
                    maxVisible={5}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-medium text-slate-500">Todo Checklist</label>
                {task.todoChecklist?.length > 0 ? (
                  task.todoChecklist.map((item, index) => (
                    <TodoChecklist
                      key={`todo_${index}`}
                      text={item.text}
                      isChecked={item.completed}
                      onChange={() => updateTodoChecklist(index)}
                    />
                  ))
                ) : (
                  <p className="text-xs text-gray-400 mt-1">No checklist items</p>
                )}
              </div>

              {task.attachments?.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-medium text-slate-500 mb-2 block">Attachments</label>
                  {task.attachments.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;
