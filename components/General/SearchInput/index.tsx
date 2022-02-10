import React from 'react';
import { classNames } from '@libs/utils/functions';
import { SearchOutlined } from '@ant-design/icons';

interface SearchInputProps {
    className?: string;
    placeholder?: string;
    value: string;
    onChange: (input: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ className = '', placeholder, onChange, value }) => {
    return (
        <div
            className={classNames(
                className,
                'relative rounded-md shadow-sm border border-theme-border  bg-theme-button-bg text-sm font-medium text-theme-text-secondary hover:bg-button-bg-hover',
            )}
        >
            <div className="absolute left-0 pl-3 pt-1 flex items-center pointer-events-none h-full">
                <SearchOutlined className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
                type="text"
                name="email"
                id="email"
                value={value}
                className="block w-full pl-10 sm:text-sm border-theme-border border-opacity-10 rounded-md px-4 py-3"
                placeholder={placeholder}
                onChange={(ev) => onChange(ev.target.value)}
            />
        </div>
    );
};
