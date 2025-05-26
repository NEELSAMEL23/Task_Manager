const DeleteAlert = ({ content, onDelete, onCancel }) => {
    return (
        <div className="p-4 border border-red-200 rounded-md bg-red-50">
            <p className="text-sm text-red-700">{content}</p>
            <div className="flex justify-end gap-2 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onDelete}
                    className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-lg px-4 py-2"
                >
                    Confirm Delete
                </button>
            </div>
        </div>
    );
};

export default DeleteAlert;
