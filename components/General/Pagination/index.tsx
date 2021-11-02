import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { classNames } from '@libs/utils/functions';

// display three numbers on the left and 3 numbers on the right
const MIN_SIDE = 3;

const MorePages: React.FC = () => (
    <span className="relative inline-flex items-center px-4 py-2 border border-theme-border text-sm font-medium text-theme-text">
        ...
    </span>
);

const pageOption =
    'text-theme-text hover:opacity-80 relative inline-flex items-center px-4 py-2 border border-theme-border text-sm font-medium focus:border-theme-border disabled:cursor-not-allowed';
const mobilePageOption =
    'relative inline-flex items-center px-4 py-2 border border-theme-border text-sm font-medium rounded-md text-theme-text hover:bg-gray-50';
const selected = 'border-tracer-500 dark:border-transparent dark:bg-tracer-500 z-10';
const unselected = 'darK:bg-transparent';

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
        <div className="pt-2 flex items-center justify-between">
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
                            className={classNames(pageOption, 'rounded-l')}
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
                                    nextPage: 1,
                                })
                            }
                        >
                            {1}
                        </button>
                        {selectedPage > MIN_SIDE && !notEnoughPages ? <MorePages /> : null}
                        {getMiddleButtons()}
                        {selectedPage < numPages - MIN_SIDE + 1 && !notEnoughPages ? <MorePages /> : null}
                        {numPages !== 1 ? (
                            <button
                                className={classNames(pageOption, selectedPage === numPages ? selected : unselected)}
                                disabled={isLastPage}
                                onClick={() =>
                                    onRight({
                                        previousPage: selectedPage,
                                        nextPage: numPages,
                                    })
                                }
                            >
                                {numPages}
                            </button>
                        ) : null}
                        <button
                            disabled={isLastPage}
                            onClick={() => {
                                onRight({
                                    previousPage: selectedPage,
                                    nextPage: selectedPage + 1,
                                });
                            }}
                            className={classNames(pageOption, 'rounded-r')}
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

export const PageNumber: React.FC<{
    page: number;
    numResults: number;
    resultsPerPage: number;
}> = ({ page, numResults, resultsPerPage }) => {
    const start = (page - 1) * resultsPerPage + 1;
    const end = Math.min(start + resultsPerPage - 1, numResults);

    return (
        <div className="text-right">
            <p className="text-sm text-theme-text">
                Showing <span className="font-medium">{Math.min(start, numResults)}</span>-
                <span className="font-medium">{end}</span> of <span className="font-medium">{numResults}</span>
            </p>
        </div>
    );
};
