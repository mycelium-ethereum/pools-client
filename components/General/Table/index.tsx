import styled from 'styled-components';

export const Table = styled.table`
    width: 100%;
`;

export const TableHeader = styled.thead``;

export const TableHeading = styled.th<{
    width: string;
}>`
    text-align: left;
    color: #111928;
    height: 40px;
    font-size: var(--font-size-extra-small);
    padding-left: 10px;
    border-bottom: 1px solid #DEDEFF;
    background: #F3F4F6;
    width: ${(props) => (props?.width ? props.width : 'auto')};
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
    transition: 0.5s;
    color: #111928;
    opacity: 1;

    &:nth-child(even) {
        background: #F9FAFB
    }

    &:hover {
        background: var(--color-accent);
        cursor: pointer;
    }
`;

export const TableCell = styled.td`
    padding: 0 10px;
    height: 54px;
`;
