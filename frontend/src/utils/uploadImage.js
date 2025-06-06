import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";


const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const response = await axiosInstance.post(
            API_PATHS.IMAGE.UPLOAD_IMAGE,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data; // Return response for caller use
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
};

export default uploadImage;
