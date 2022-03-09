import { HiddenExpand, Logo } from '@components/General';
import { TableRow, TableHeaderCell } from '@components/General/TWTable';
import styled from 'styled-components';
import { device, Theme } from '@context/ThemeContext/themes';
import { SearchInput } from '@components/General/SearchInput';

export const TokenSelectBox = styled.div`
    width: 100%;
    background: ${({ theme }) => theme['background-secondary']};
    height: 200px;
    box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04);
    border-radius: 7px;
`;

export const TokenSelectDropdown = styled(HiddenExpand)`
    position: absolute;
    width: 100%;
    margin-top: 1rem !important;

    z-index: 3;

    // this is the margin of the parent modal
    padding: 0 1rem;
    margin-left: -1rem;

    @media ${device.sm} {
        padding: 0 4rem;
        margin-left: -4rem;
    }
`;

export const TokenSelecRow = styled(TableRow)`
    background: ${({ theme }) => (theme.theme === Theme.Light ? '#F9FAFB' : '#1F2A37')}!important;
`;

export const HeaderCell = styled(TableHeaderCell)<{ bottom?: boolean }>`
    padding: ${({ bottom }) => (bottom ? '0.5rem' : '1rem 0.5rem 0.5rem 0.5rem')};
`;

export const TokenLogo = styled(Logo)`
    display: inline-block;
    margin-right: 0.25rem;
`;

export const LogoCell = styled.div`
    display: flex;
    align-items: center;
    text-align: left;
`;

export const LogoText = styled.div`
    font-weight: 700;
`;

export const LogoSubtext = styled.div``;

export const TextWrapper = styled.div``;

export const TokenSearch = styled(SearchInput)`
    > input {
        padding: 0.75rem 1rem 0.75rem 2.5rem !important;
    }
`;
