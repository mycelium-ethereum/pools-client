import { DownOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import styled from 'styled-components';

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
            <StyledSelect
                id="selectMe"
                ref={select}
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                value={value}
                placeholder={placeholder}
                onChange={(ev) => onSelect(ev.target.value)}
            >
                {options.map((val) => (
                    <option key={val} value={val}>
                        {val}
                    </option>
                ))}
            </StyledSelect>
            <DownOutlined className="absolute right-3 top-3" />
        </div>
    );
};

const StyledSelect = styled.select`
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
`;
