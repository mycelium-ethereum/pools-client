import React from 'react';
import Exchange from '@archetypes/Exchange';
import { TWModal } from '@components/General/TWModal';

export default (({ open, onClose }) => {
    return (
        <TWModal open={open} onClose={onClose} className="md:max-w-[611px] pt-4 pb-5 px-4 sm:pb-20 sm:px-16 sm:pt-7">
            <Exchange onClose={onClose} />
        </TWModal>
    );
}) as React.FC<{
    open: boolean;
    onClose: () => any;
}>;
