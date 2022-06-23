import { useEffect } from 'react';

export const useOutsideClick: (containerRef: React.RefObject<any>, action: () => void) => void = (
    containerRef,
    action,
) => {
    useEffect(() => {
        const detectClickOutside = (event: Event) => {
            if (!!containerRef && !containerRef?.current?.contains(event.target as HTMLElement)) {
                action();
            }
        };
        document.addEventListener('click', detectClickOutside);
        return () => document.removeEventListener('click', detectClickOutside);
    }, [containerRef]);
};
