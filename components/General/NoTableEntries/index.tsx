import React from 'react';
import { FullSpanCell } from '~/components/General/TWTable';
import NoItems from '~/public/img/no-queued.svg';
import { Children } from '~/types/general';

export const NoTableEntries = ({ children }: Children): JSX.Element => (
    <tr>
        <FullSpanCell>
            <div className="my-12 text-center">
                <NoItems className="mx-auto mb-5" />
                <div className="text-cool-gray-500">{children}</div>
            </div>
        </FullSpanCell>
    </tr>
);

export default NoTableEntries;
