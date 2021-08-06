import styled from 'styled-components';

export const Table = styled.table`
    width: 100%;
`;

export const TableHeader = styled.thead``;

export const TableHeading = styled.th<{
    width: string
}>`
    text-align: left;
    color: var(--color-primary);
    height: 40px;
    font-size: var(--font-size-extra-small);
    padding-left: 10px;
    border-right: 1px solid var(--color-accent);
    border-bottom: 1px solid var(--color-accent);
    border-top: 1px solid var(--color-accent);

    &:first-child {
        border-left: 1px solid var(--color-accent);
    }

    width: ${props => props?.width ? props.width : 'auto'};
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
    transition: 0.5s;
    color: white;
    opacity: 1;

    &:hover {
        background: var(--color-accent);
        cursor: pointer;
    }
`;

export const TableCell = styled.td`
    padding: 0 10px;
    border-right: 1px solid var(--color-accent);
    border-bottom: 1px solid var(--color-accent);

    &:first-child {
        border-left: 1px solid var(--color-accent);
    }
`;