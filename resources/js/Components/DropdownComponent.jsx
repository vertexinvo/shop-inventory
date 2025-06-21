import { FaChevronDown } from "react-icons/fa";
import Dropdown from "./Dropdown";


const DropdownComponent = ({ triggerText = "", options = [], className = "" }) => {
    return (
        <Dropdown >
            <Dropdown.Trigger >
                <button className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-500 ${className}`}>
                    {triggerText}
                    <FaChevronDown className="h-3 w-3" />
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content className="mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {options.map((option, index) => (
                    <a
                        key={index}
                        href={option.href}
                        download={option.download || false}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={option.onClick || (() => {})}
                    >
                        {option.label}
                    </a>
                ))}
            </Dropdown.Content>
        </Dropdown>
    );
};

export default DropdownComponent;