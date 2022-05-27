import styled from 'styled-components';
import { HiddenExpand as UnstyledHiddenExpand } from '~/components/General';
import Button from '~/components/General/Button';
import { SearchInput as UnstyledSearchInput } from '~/components/General/SearchInput';
import { TableRowCell } from '~/components/General/TWTable';
import ArrowRight_ from '~/public/img/general/arrow-right.svg';
import { Theme } from '~/store/ThemeSlice/themes';

export const Container = styled.div`
    position: relative;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    background: ${({ theme }) => theme.background.primary};
`;

export const Behind = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    max-height: 88px;
    cursor: pointer;
`;

export const Wrapper = styled.div`
    white-space: nowrap;
    padding: 1rem;

    @media ${({ theme }) => theme.device.lg} {
        display: flex;
        justify-content: space-between;
    }
`;

export const TitleContent = styled.div`
    display: flex;
    gap: 0.75rem;
`;

export const Title = styled.div`
    line-height: 150%;
    font-weight: 600;
    font-size: ${({ theme }) => theme.fontSize.xl};
    margin-top: 0.5rem;
    opacity: 1;
`;

export const SubTitle = styled.div`
    line-height: 150%;
    font-weight: 400;
    font-size: ${({ theme }) => theme.fontSize.xxs};
    color: #71717a;
`;

export const Text = styled.div`
    margin: auto 0.5rem auto 0;
`;

export const Content = styled.div`
    display: flex;
    margin: 0 0 auto 0;
    flex-wrap: wrap;

    & > * {
        margin-top: 1rem;
    }
    @media ${({ theme }) => theme.device.lg} {
        & > * {
            margin-top: 0rem;
        }
    }
`;

export const Actions = styled.div`
    display: flex;
    &:first-child {
        margin-right: 0.5rem;

        @media ${({ theme }) => theme.device.md} {
            margin-right: 1.25rem;
        }
    }
`;

export const SearchInput = styled(UnstyledSearchInput)`
    min-width: 325px;
    input {
        padding: calc(0.5rem - 1px) 1rem calc(0.5rem - 1px) 2.5rem;
    }
`;

export const ArrowRight = styled(ArrowRight_)`
    margin-left: auto;
`;

export const OverviewTableRowCell = styled(TableRowCell)`
    font-size: ${({ theme }) => theme.fontSize.md};
`;

export const OverviewHeaderRow = styled.tr`
    &:first-child {
        background: ${({ theme }) => {
            switch (theme.theme) {
                case Theme.Light:
                    return '#E5E7EB';
                default:
                    return theme.background.primary;
            }
        }};
    }
`;

export const ActionsCell = styled(TableRowCell)`
    display: flex;
    justify-content: end;
`;

export const ActionsButton = styled(Button)`
    border: 0;
    width: 70px !important;
    padding: 8px 0 !important;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    text-transform: uppercase;
    ${({ disabled }) => {
        if (disabled) {
            return `
                cursor: not-allowed;
                pointer-events: none;
                z-index: -1;
            `;
        }
    }};
`;

export const RowCount = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.7rem;
    font-weight: 400;
    font-size: ${({ theme }) => theme.fontSize.xxl};
    line-height: 150%;
    text-align: center;
    width: 46px;
    height: 44px;
    background: rgba(61, 168, 245, 0.1);
    color: #3da8f5;
    border: 1px solid #3da8f5;
    box-sizing: border-box;
    border-radius: 7px;
`;

export const IconContainer = styled.div`
    align-self: center;
    margin-left: 1.5rem;
    width: 20px;
    height: 10px;
`;
export const DropdownArrow = styled.div<{
    open: boolean;
}>`
    cursor: pointer;

    transform: ${({ open }) => (open ? 'rotate(180deg)' : '0deg')};
    transform-origin: center;
    transition: transform 0.1s linear;
`;

export const HiddenExpand = styled(UnstyledHiddenExpand)`
    margin: 0;
`;
