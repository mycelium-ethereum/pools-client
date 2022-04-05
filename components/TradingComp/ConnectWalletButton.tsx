import React from 'react';

const ConnectWalletButton: React.FC<{ handleConnect: () => void }> = ({
    handleConnect,
}: {
    handleConnect: () => void;
}) => {
    return (
        <button
            className="group mx-auto mt-2 flex h-[39px] w-[125px] items-center justify-center rounded-xl border border-tracer-darkblue text-sm font-semibold text-black transition-colors duration-300 hover:bg-tracer-darkblue hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-tracer-darkblue"
            onClick={handleConnect}
        >
            Connect Wallet
        </button>
    );
};

export default ConnectWalletButton;
