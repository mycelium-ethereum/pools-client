import styled from 'styled-components';

type Display = HTMLDivElement['style']['display'];

const MD = styled.div<{ display?: Display }>`
    ${({ display }) => (display ? `display: ${display};` : '')}
    @media ${({ theme }) => theme.device.md} {
        display: none;
    }
`;

const LG = styled.div<{ display?: Display }>`
    ${({ display }) => (display ? `display: ${display};` : '')}
    @media ${({ theme }) => theme.device.lg} {
        display: none;
    }
`;

const XL = styled.div<{ display?: Display }>`
    ${({ display }) => (display ? `display: ${display};` : '')}
    @media ${({ theme }) => theme.device.xl} {
        display: none;
    }
`;

export default {
    MD,
    LG,
    XL,
};
