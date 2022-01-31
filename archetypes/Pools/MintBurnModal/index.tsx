import React from 'react';
import { TWModal } from '@components/General/TWModal';
import Exchange from '@archetypes/Exchange';

export default (({ open, onClose }) => {
    return (
        <TWModal open={open} onClose={onClose} className="pt-4 pb-5 px-4 sm:pb-20 sm:px-16">
            <Exchange onClose={onClose} />
        </TWModal>
    );
}) as React.FC<{
    open: boolean;
    onClose: () => any;
}>;
