import styled from 'styled-components';
import { Theme } from '~/store/ThemeSlice/themes';

export const HeaderRow = styled.tr`
    &:first-child {
        background: ${({ theme }) => {
            switch (theme.theme) {
                case Theme.Light:
                    return '#E5E7EB';
                default:
                    return theme.background;
            }
        }};
    }
`;
