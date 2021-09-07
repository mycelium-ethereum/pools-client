import { SearchOutlined } from '@ant-design/icons';
import React from 'react';

interface SearchInputProps {
    placeholder?: string;
    value: string;
    onChange: (input: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ placeholder, onChange, value }) => {
    return (
        <div className="relative rounded-md shadow-sm border border-gray-300  bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 w-full">
            <div className="absolute left-0 pl-3 pt-1 flex items-center pointer-events-none h-full">
                <SearchOutlined className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
                type="text"
                name="email"
                id="email"
                value={value}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md px-4 py-2"
                placeholder={placeholder}
                onChange={(ev) => onChange(ev.target.value)}
            />
        </div>
    );
};
