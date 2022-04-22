import styled from 'styled-components';

type Display = HTMLDivElement['style']['display'];

const MD = styled.div<{ display: Display }>`
    display: none;
    @media ${({ theme }) => theme.device.md} {
        display: ${({ display }) => display};
    }
`;

const LG = styled.div<{ display: Display }>`
    display: none;
    @media ${({ theme }) => theme.device.lg} {
        display: ${({ display }) => display};
    }
`;

const XL = styled.div<{ display: Display }>`
    display: none;
    @media ${({ theme }) => theme.device.xl} {
        display: ${({ display }) => display};
    }
`;

export default {
    MD,
    LG,
    XL,
};
