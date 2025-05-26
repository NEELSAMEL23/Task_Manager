export const BASEURL = "http://localhost:8000";

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",               // Register a new user
        LOGIN: "/api/auth/login",                     // Login a user
        GET_PROFILE: "/api/auth/profile",             // Get the logged-in user's profile
    },

    USERS: {
        GET_ALL_USERS: "/api/users",                  // Get all users (admin only)
        GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Get a user by ID (admin only)
        CREATE_USER: "/api/users",                    // Create a new user (admin only)
        UPDATE_USER: (userId) => `/api/users/${userId}`,     // Update user by ID (admin only)
        DELETE_USER: (userId) => `/api/users/${userId}`,     // Delete user by ID (admin only)
    },

    TASKS: {
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",      // Get general dashboard data
        GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get dashboard data for a specific user
        GET_ALL_TASK: "/api/tasks",                           // Get all tasks
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,   // Get a task by ID
        CREATE_TASK: "/api/tasks",                            // Create a new task
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,      // Update a task by ID
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`,      // Delete a task by ID
        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update task status
        UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update checklist for a task
    },

    REPORTS: {
        EXPORT_TASK: "/api/reports/export/tasks",     // Export task data
        EXPORT_USERS: "/api/reports/export/users",    // Export user data (admin only)
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image"
    }
};
