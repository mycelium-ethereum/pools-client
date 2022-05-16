import styled from 'styled-components';
import { Dropdown as UnstyledDropdown } from '~/components/General';
import { Container as UnstyledContainer } from '~/components/General/Container';
import { SearchInput as UnstyledSearchInput } from '~/components/General/SearchInput';
import TWPopup from '~/components/General/TWPopup';
import ArrowDownIcon from '~/public/img/general/arrow-circle-down.svg';
import FilterToggleIcon from '~/public/img/general/filters.svg';
import { Theme } from '~/store/ThemeSlice/themes';
import { CollateralFilter } from './CollateralFilter';
import { LeverageFilter } from './LeverageFilter';
import { MarketFilter } from './MarketFilter';

export const Container = styled(UnstyledContainer)`
    display: flex;
    margin-right: 0;
    flex-direction: column;
    gap: 22px;
    justify-content: center;
    align-items: center;
    padding: 0;
    max-width: 720px;

    @media ${({ theme }) => theme.device.md} {
        flex-direction: row;
    }

    @media ${({ theme }) => theme.device.lg} {
        align-items: flex-end;
    }
`;

export const FilterPopup = styled(TWPopup)`
    width: 100%;
    position: relative;

    .action-button {
        border: 1px ${({ theme }) => theme.border.primary} solid !important;
        font-size: 16px !important;
        font-weight: 400 !important;
        color: rgb(156 163 175);
        display: inline-flex;
        padding: 0.67rem 1rem;
        background-color: ${({ theme }) => theme.button.bg};
        white-space: nowrap;
        display: inline-flex;
        justify-content: center;
        width: 100%;
        border-radius: 0.375rem;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

        &:hover {
            background-color: ${({ theme }) => theme.button.hover};
        }
    }

    @media ${({ theme }) => theme.device.md} {
        width: 50%;
    }
`;

export const Content = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    border-radius: 7px;
    gap: 20px;
    background-color: ${({ theme }) => theme.background.secondary};
    box-shadow: ${({ theme }) => {
        switch (theme.theme) {
            case Theme.Light:
                return '0px 1px 10px rgba(0, 0, 0, 0.1)';
            default:
                return '0px 1px 10px rgba(0, 0, 0, 0.9)';
        }
    }};
`;

export const DropdownContainer = styled.div`
    width: 100%;
`;

export const Dropdown = styled(UnstyledDropdown)`
    width: 100%;
`;

export const Wrapper = styled.div`
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
`;

export const SearchInput = styled(UnstyledSearchInput)`
    width: 100%;
    input {
        height: calc(24px + 0.67rem * 2);
        padding: 0.67rem 1rem;
        font-size: 16px;
        padding: 0 1rem 0 2.5rem;
    }

    @media ${({ theme }) => theme.device.md} {
        width: 50%;
    }
`;

export const FilterIcon = styled(FilterToggleIcon)`
    width: 2rem;
    margin-right: 10px;
`;

export const Heading = styled.h3`
    margin-bottom: 0.25rem;
    font-weight: 500;
    color: ${({ theme }) => theme.fontColor.primary};
`;

export const Text = styled.div`
    margin-bottom: 0.7rem;
    font-weight: 500;
    color: ${({ theme }) => theme.fontColor.primary};
    font-size: 12px;
`;

export const DenotationOptions = styled.div`
    margin-right: 0.5rem;
`;

export const Preview = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

export const ArrowIcon = styled(ArrowDownIcon)<{ isGreen?: boolean }>`
    color: ${({ isGreen }) => (isGreen ? '#059669' : '#dc2626')};
    width: 1rem;
    transform: ${({ isGreen }) => (isGreen ? 'rotateX(180deg)' : '0')};
`;

export const BaseFilters = {
    Container,
    FilterPopup,
    SearchInput,
    Wrapper,
    Text,
    Content,
    Dropdown,
    DropdownContainer,
    Preview,
    Heading,
    FilterIcon,
    CollateralFilter,
    MarketFilter,
    LeverageFilter,
};
export default BaseFilters;
