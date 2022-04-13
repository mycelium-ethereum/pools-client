import styled from 'styled-components';
import { device } from '~/store/ThemeSlice/themes';

type Display = HTMLDivElement['style']['display'];

const MD = styled.div<{ display?: Display }>`
    ${({ display }) => (display ? `display: ${display};` : '')}
    @media ${device.md} {
        display: none;
    }
`;

const LG = styled.div<{ display?: Display }>`
    ${({ display }) => (display ? `display: ${display};` : '')}
    @media ${device.lg} {
        display: none;
    }
`;

const XL = styled.div<{ display?: Display }>`
    ${({ display }) => (display ? `display: ${display};` : '')}
    @media ${device.xl} {
        display: none;
    }
`;

export default {
    MD,
    LG,
    XL,
};
