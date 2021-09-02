import React from 'react';
import { Label } from '@components/Pool';
import useTokens from '@libs/hooks/useTokens';
import { Input } from '@components/General/Input';
import Divider from '@components/General/Divider';
import TokenTable from './TokenTable';
import Modal from '@components/General/Modal';

// const SelectToken
export default (({ show, onClose }) => {
    const { tokens, filter, setFilter } = useTokens();

    return (
        <Modal show={show} onClose={onClose}>
            <span>
                <Label>Token</Label>
                <Input
                    value={filter}
                    onChange={(e: any) => {
                        setFilter(e.currentTarget.value);
                    }}
                    type={'text'}
                />
            </span>
            <Divider />
            <TokenTable tokens={tokens} />
        </Modal>
    );
}) as React.FC<{
    show: boolean;
    onClose: (...args: any) => any;
}>;

// const SelectModal = styled.div<{ show: boolean }>`
//     transition: 0.3s;
//     padding-top: ${(props) => (props.show ? '0' : '5vh')};
//     opacity: ${(props) => (props.show ? 1 : 0)};
//     position: absolute;
//     width: 1010px;
//     height: 700px;
//     background: #fff;
//     padding: 71px 65px;
//     top: 0;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     margin: auto;
//     box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
//     border-radius: 20px;
//     z-index: ${(props) => (props.show ? 2 : -1)};
// `;
