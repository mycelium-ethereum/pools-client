import { classNames } from '@libs/utils/functions';
import React from 'react';

// const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

const defaultClassName = 'p-0 text-2xl bg-transparent';

export const Input = React.memo(
    ({
        value,
        onUserInput,
        placeholder,
        maxDecimals = 18,
        className = defaultClassName,
        ...rest
    }: {
        value: string | number;
        onUserInput: (input: string) => void;
        maxDecimals?: number;
        fontSize?: string;
        align?: 'right' | 'left';
    } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
        return (
            <input
                {...rest}
                value={value}
                onChange={(event) => {
                    const { value } = event.target;
                    const decimals = value.toString().split('.')[1];
                    // limit the amount of decimals
                    if (!decimals || decimals?.length <= maxDecimals) {
                        // replace commas with periods
                        onUserInput(value.replace(/,/g, '.'));
                    }
                }}
                // universal input options
                inputMode="decimal"
                title="Token Amount"
                autoComplete="off"
                autoCorrect="off"
                // text-specific options
                type="number"
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder={placeholder || '0.0'}
                min={0}
                minLength={1}
                maxLength={80}
                spellCheck="false"
                className={classNames(
                    'relative outline-none border-none flex-auto overflow-hidden overflow-ellipsis placeholder-low-emphesis focus:placeholder-primary focus:border',
                    className,
                )}
            />
        );
    },
);

Input.displayName = 'NumericalInput';

export default Input;
