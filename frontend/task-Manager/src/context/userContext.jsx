import { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile if token exists
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setLoading(false);
            return;
        }

        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
            localStorage.removeItem("authToken");
        } finally {
            setLoading(false);
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem("authToken", userData.token);
        setLoading(false);
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("authToken");
    };

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
