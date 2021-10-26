import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { classNames } from '@libs/utils/functions';

// display three numbers on the left and 3 numbers on the right
const MIN_SIDE = 3;

const MorePages: React.FC = () => (
    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
        ...
    </span>
);

const pageOption =
    'text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium';
const mobilePageOption =
    'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50';
const selected = 'border-tracer-500';
const unselected = 'border-gray-300';

export default (({ onLeft, onRight, onDirect, numPages, selectedPage }) => {
    const isFirstPage = selectedPage <= 1;
    const isLastPage = selectedPage >= numPages;

    const notEnoughPages = numPages < MIN_SIDE * 2;

    const getMiddleButtons = () => {
        if (notEnoughPages) {
            return (
                <>
                    {Array.from({ length: numPages - 2 }, (_x, i) => i + 2).map((i) => (
                        <button
                            key={`pagination-option-${i}`}
                            className={classNames(pageOption, i === selectedPage ? selected : unselected)}
                            onClick={() =>
                                onDirect({
                                    previousPage: selectedPage,
                                    nextPage: i,
                                })
                            }
                        >
                            {i}
                        </button>
                    ))}
                </>
            );
        } else if (numPages > MIN_SIDE && selectedPage <= MIN_SIDE - 1) {
            // is a middle page
            return (
                <>
                    {Array.from({ length: MIN_SIDE - 1 }, (_x, i) => i + 2).map((i) => (
                        <button
                            key={`pagination-option-${i}`}
                            className={classNames(pageOption, i === selectedPage ? selected : unselected)}
                            onClick={() =>
                                onDirect({
                                    previousPage: selectedPage,
                                    nextPage: i,
                                })
                            }
                        >
                            {i}
                        </button>
                    ))}
                </>
            );
        } else if (numPages > MIN_SIDE && selectedPage >= numPages - MIN_SIDE + 1) {
            return (
                <>
                    {Array.from({ length: MIN_SIDE - 1 }, (_x, i) => i + numPages - 2).map((i) => (
                        <button
                            key={`pagination-option-${i}`}
                            className={classNames(pageOption, i === selectedPage ? selected : unselected)}
                            onClick={() =>
                                onDirect({
                                    previousPage: selectedPage,
                                    nextPage: i,
                                })
                            }
                        >
                            {i}
                        </button>
                    ))}
                </>
            );
        } else if (selectedPage >= MIN_SIDE || selectedPage <= numPages - MIN_SIDE) {
            return (
                <>
                    {Array.from({ length: 3 }, (_x, i) => i + (selectedPage - 1)).map((i) => {
                        return (
                            <button
                                key={`pagination-option-${i}`}
                                className={classNames(pageOption, i === selectedPage ? selected : unselected)}
                                disabled={isFirstPage}
                                onClick={() =>
                                    onDirect({
                                        previousPage: selectedPage,
                                        nextPage: i,
                                    })
                                }
                            >
                                {i}
                            </button>
                        );
                    })}
                </>
            );
        }
    };

    return (
        <div className="px-4 py-3 flex items-center justify-between sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    className={mobilePageOption}
                    disabled={isFirstPage}
                    onClick={() =>
                        onLeft({
                            previousPage: selectedPage,
                            nextPage: selectedPage - 1,
                        })
                    }
                >
                    Previous
                </button>
                <button
                    className={classNames('ml-3', mobilePageOption)}
                    disabled={isLastPage}
                    onClick={() =>
                        onRight({
                            previousPage: selectedPage,
                            nextPage: selectedPage + 1,
                        })
                    }
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            className={pageOption}
                            disabled={isFirstPage}
                            onClick={() =>
                                onLeft({
                                    previousPage: selectedPage,
                                    nextPage: selectedPage - 1,
                                })
                            }
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                            className={classNames(pageOption, selectedPage === 1 ? selected : unselected)}
                            disabled={isFirstPage}
                            onClick={() =>
                                onLeft({
                                    previousPage: selectedPage,
                                    nextPage: selectedPage - 1,
                                })
                            }
                        >
                            {1}
                        </button>
                        {selectedPage > MIN_SIDE && !notEnoughPages ? <MorePages /> : null}
                        {getMiddleButtons()}
                        {selectedPage < numPages - MIN_SIDE + 1 && !notEnoughPages ? <MorePages /> : null}
                        <button
                            className={classNames(pageOption, selectedPage === numPages ? selected : unselected)}
                            disabled={isLastPage}
                            onClick={() =>
                                onRight({
                                    previousPage: selectedPage,
                                    nextPage: selectedPage + 1,
                                })
                            }
                        >
                            {numPages}
                        </button>
                        <button
                            disabled={isLastPage}
                            onClick={() => {
                                onRight({
                                    previousPage: selectedPage,
                                    nextPage: selectedPage + 1,
                                });
                            }}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}) as React.FC<{
    onLeft: OnNavigation;
    onRight: OnNavigation;
    onDirect: OnNavigation;
    numPages: number;
    selectedPage: number;
}>;

type OnNavigation = ({ previousPage, nextPage }: { previousPage: number; nextPage: number }) => any;

// <div>
//   <p className="text-sm text-gray-700">
//     Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
//     <span className="font-medium">97</span> results
//   </p>
// </div>
