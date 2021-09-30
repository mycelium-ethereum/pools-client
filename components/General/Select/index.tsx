import React, { useRef } from 'react';
import { DownOutlined } from '@ant-design/icons';

interface SelectProps {
    value: string;
    options: string[];
    onSelect: (selected: string) => void;
    placeholder?: string;
    className?: string;
}

export const Select: React.FC<SelectProps> = ({ value, options, placeholder, onSelect, className }) => {
    const select = useRef(null);
    return (
        <div className={`${className || ''} relative`}>
            <select
                id="selectMe"
                ref={select}
                className="inline-flex justify-between w-full rounded-md appearance-none border border-theme-border shadow-sm px-4 py-2 bg-theme-button-bg text-sm font-medium text-gray-500 hover:bg-theme-button-bg-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                value={value}
                placeholder={placeholder}
                onChange={(ev) => onSelect(ev.target.value)}
            >
                {options.map((val) => (
                    <option key={val} value={val}>
                        {val}
                    </option>
                ))}
            </select>
            <DownOutlined className="absolute right-3 top-3" />
        </div>
    );
};
