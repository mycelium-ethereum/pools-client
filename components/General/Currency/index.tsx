import React from 'react';
import { Logo } from '../Logo';

export const Currency: React.FC<{
    ticker: string;
    text?: string;
}> = ({ ticker, text }) => (
    <div className="flex items-center h-auto p-2 mr-2 rounded-xl bg-white text-gray-500">
        <Logo className="inline mr-2 m-0 w-5 h-5" ticker={ticker} />
        {text || ticker}
    </div>
);
