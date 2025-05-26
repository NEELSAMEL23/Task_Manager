const Modal = ({ children, isOpen, onClose, title }) => {
    if (!isOpen) return null; // Must return null or a React node, not undefined

    return (
        <div
            className="fixed  top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full max-h-full overflow-y-auto overflow-x-hidden bg-black/20"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="relative bg-white w-full max-w-2xl max-h-full p-4">
                {/* Modal header */}
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 md:p-5 p-4 border-b dark:border-gray-600 border-gray-200 flex justify-between items-center">
                    <h3 id="modal-title" className="text-lg font-medium text-gray-900 dark:text-white">
                        {title}
                    </h3>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                    >
                        <svg
                            className="w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Modal content */}
                <div className="p-4 md:p-5 space-y-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
