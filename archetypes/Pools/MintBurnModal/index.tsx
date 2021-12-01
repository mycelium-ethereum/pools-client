import React from 'react';
import { TWModal } from '@components/General/TWModal';
import Exchange from '@archetypes/Exchange';

export default (({ open, onClose }) => {
    return (
        <TWModal open={open} onClose={onClose}>
            <Exchange onClose={onClose} />
        </TWModal>
    );
}) as React.FC<{
    open: boolean;
    onClose: () => any;
}>;
