import React from 'react';
import Exchange from '~/archetypes/Exchange';
import { TWModal } from '~/components/General/TWModal';

export default (({ open, onClose }) => {
    return (
        <TWModal open={open} onClose={onClose} className="px-4 pt-4 pb-5 sm:px-16 sm:pb-20 sm:pt-7 md:max-w-[611px]">
            <Exchange onClose={onClose} />
        </TWModal>
    );
}) as React.FC<{
    open: boolean;
    onClose: () => any;
}>;
