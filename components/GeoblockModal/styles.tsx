import styled from 'styled-components';
import CloseSVG from '/public/img/general/close.svg';

export const GeoblockContent = styled.div`
    a {
        text-decoration: underline;
        cursor: pointer;
    }
`;

export const Close = styled(CloseSVG)`
    width: 1rem;
    height: 1rem;
    margin-left: auto;
    cursor: pointer;
    position: absolute;
    right: 35px;
    top: 46px;
`;
