import styled from 'styled-components';
import CloseSVG from '/public/img/general/close.svg';

export const OnboardContent = styled.div`
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

export const Heading = styled.p`
    font-size: ${({ theme }) => theme.fontSize.xl};
    font-weight: 500;
    font-family: ${({ theme }) => theme.fontFamily.body};
    text-align: center;
    margin-bottom: 40px;
`;

export const Text = styled.p`
    text-align: center;
    font-family: ${({ theme }) => theme.fontFamily.body};
    margin-top: 30px;
    line-height: 28px;
`;

export const Color = styled.span<{ variant?: string }>`
    color: ${({ variant }) => {
        switch (variant) {
            case 'green':
                return '#05cb3a';
            case 'red':
                return '#FF5621';
            default:
                return '#8383eb';
        }
    }};
`;

export const Content = styled.div`
    margin-bottom: 37px;
`;

export const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;

    @media ${({ theme }) => theme.device.sm} {
        gap: 20px;
    }
`;

export const Link = styled.a.attrs({
    target: '_blank',
    rel: 'noreferrer',
})`
    text-decoration: underline;
`;
