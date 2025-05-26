import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const SelectDropDown = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-sm text-black  outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center"
            >
                {value ? options.find((opt) => opt.value === value)?.label : placeholder}
                <span className="ml-2">{isOpen ? <LuChevronDown classNarotate-180me=""/> : <LuChevronDown/>}</span>
               
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md  shadow">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="px-3 py-2texe-sm  hover:bg-gray-100 cursor-pointer"
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectDropDown;
 