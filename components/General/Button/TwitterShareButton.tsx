import React from 'react';

const TwitterShareButton: React.FC<{ url: string; className?: string }> = ({
    url,
    className,
}: {
    url: string;
    className?: string;
}) => {
    return (
        <a href={`https://twitter.com/intent/tweet?url=${url}`} target="_blank" rel="noopener noreferrer">
            <button
                className={`group flex h-[39px] max-h-[39px] w-[97px] max-w-[97px] items-center justify-center rounded-xl border border-tracer-darkblue text-sm font-semibold text-black transition-colors duration-300 hover:bg-tracer-darkblue hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-tracer-darkblue ${
                    className ?? ''
                }`}
            >
                <svg
                    width="16"
                    height="13"
                    viewBox="0 0 16 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2.5 h-3 w-[15px]"
                    aria-label="Twitter icon"
                >
                    <path
                        d="M13.9473 3.6842C14.5332 3.24475 15.0605 2.71741 15.4707 2.10217C14.9434 2.33655 14.3281 2.51233 13.7129 2.57092C14.3574 2.19006 14.8262 1.60413 15.0605 0.871704C14.4746 1.22327 13.8008 1.48694 13.127 1.63342C12.541 1.01819 11.75 0.666626 10.8711 0.666626C9.17187 0.666626 7.79492 2.04358 7.79492 3.7428C7.79492 3.97717 7.82422 4.21155 7.88281 4.44592C5.33398 4.29944 3.04883 3.06897 1.52539 1.22327C1.26172 1.66272 1.11523 2.19006 1.11523 2.776C1.11523 3.83069 1.64258 4.76819 2.49219 5.32483C1.99414 5.29553 1.49609 5.17834 1.08594 4.94397V4.97327C1.08594 6.46741 2.14062 7.69788 3.54687 7.99084C3.3125 8.04944 3.01953 8.10803 2.75586 8.10803C2.55078 8.10803 2.375 8.07874 2.16992 8.04944C2.55078 9.27991 3.69336 10.1588 5.04102 10.1881C3.98633 11.0084 2.66797 11.5065 1.23242 11.5065C0.96875 11.5065 0.734375 11.4772 0.5 11.4479C1.84766 12.3268 3.45898 12.8248 5.2168 12.8248C10.8711 12.8248 13.9473 8.16663 13.9473 4.09436C13.9473 3.94788 13.9473 3.83069 13.9473 3.6842Z"
                        fill="currentColor"
                    />
                </svg>
                Share
            </button>
        </a>
    );
};

export default TwitterShareButton;
