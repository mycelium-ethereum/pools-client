import React, { useCallback, KeyboardEventHandler } from 'react';
import { classNames } from '@libs/utils/functions';

// const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

const defaultClassName = 'p-0 text-2xl bg-transparent';

const defaultPattern = '^[0-9]*[.,]?[0-9]*$';

const defaultCharacterBlacklist: Record<string, boolean> = {
    '-': true,
    '+': true,
    e: true,
};

export const Input = React.memo(
    ({
        value,
        onUserInput,
        placeholder,
        maxDecimals = 18,
        className = defaultClassName,
        characterBlacklist = defaultCharacterBlacklist,
        pattern = defaultPattern,
        ...rest
    }: {
        value: string | number;
        onUserInput: (input: string) => void;
        maxDecimals?: number;
        fontSize?: string;
        align?: 'right' | 'left';
        characterBlacklist?: Record<string, boolean>;
    } & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) => {
        const onKeyPress = useCallback(
            (e: any) => {
                const enteredCharacter = String.fromCharCode(e.which);
                if (characterBlacklist[enteredCharacter]) {
                    e.preventDefault();
                }
            },
            [characterBlacklist],
        ) as unknown as KeyboardEventHandler<HTMLInputElement>;

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
                pattern={pattern}
                placeholder={placeholder || '0.0'}
                onKeyPress={onKeyPress}
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
