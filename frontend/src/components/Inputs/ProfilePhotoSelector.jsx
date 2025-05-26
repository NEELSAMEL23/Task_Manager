import { useRef, useState, useEffect } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef = useRef();
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (image) {
            const preview = URL.createObjectURL(image);
            setPreviewUrl(preview);

            return () => URL.revokeObjectURL(preview); // Clean up
        }
    }, [image]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
        inputRef.current.value = "";
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
            />

            {!image ? (
                <button
                    type="button"
                    onClick={onChooseFile}
                    className="flex items-center justify-center w-24 h-24 rounded-full border border-gray-300 bg-gray-100 hover:bg-gray-200 transition"
                >
                    <LuUser className="text-4xl text-gray-500" />
                    <LuUpload className="ml-2 text-xl text-blue-500" />
                </button>
            ) : (
                <div className="relative">
                    <img
                        src={previewUrl}
                        alt="Profile Preview"
                        className="w-24 h-24 object-cover rounded-full border"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        title="Remove photo"
                    >
                        <LuTrash />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;
