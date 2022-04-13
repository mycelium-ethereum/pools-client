import styled from 'styled-components';
import { device } from '~/store/ThemeSlice/themes';

type Display = HTMLDivElement['style']['display'];

const MD = styled.div<{ display: Display }>`
    display: none;
    @media ${device.md} {
        display: ${({ display }) => display};
    }
`;

const LG = styled.div<{ display: Display }>`
    display: none;
    @media ${device.lg} {
        display: ${({ display }) => display};
    }
`;

const XL = styled.div<{ display: Display }>`
    display: none;
    @media ${device.xl} {
        display: ${({ display }) => display};
    }
`;

export default {
    MD,
    LG,
    XL,
};
