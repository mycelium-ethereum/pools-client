import styled from 'styled-components';
import CloseSVG from '/public/img/general/close.svg';

export const OnboardContent = styled.div`
    a {
        text-decoration: underline;
        cursor: pointer;
    }
`;

export const Close = styled(CloseSVG)`
    width: 0.75rem; /* 12px */
    height: 0.75rem; /* 12px */
    margin-left: auto;
    cursor: pointer;
`;
