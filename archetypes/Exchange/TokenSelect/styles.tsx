import {HiddenExpand} from "@components/General";
import {TableRow} from "@components/General/TWTable";
import styled from "styled-components";
import { device, Theme } from '@context/ThemeContext/themes'


export const TokenSelectBox = styled.div`
    width: 100%;
    background: ${({ theme }) => theme['background-secondary']};
    height: 200px;
    box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04);
    border-radius: 7px;
`

export const TokenSelectDropdown = styled(HiddenExpand)`
    position: absolute;
    width: 100%;
    margin-top: 1rem!important;

    z-index: 3;
    
    // this is the margin of the parent modal
    padding: 0 1rem;
    margin-left: -1rem;

    @media ${device.md} {
        padding: 0 4rem;
        margin-left: -4rem;
    }

`

export const TokenSelecRow = styled(TableRow)`
background: ${({ theme }) => theme.theme === Theme.Light ? '#F9FAFB' : '#1F2A37'}!important;
`


