import styled from 'styled-components';
import { Container as GeneralContainer } from '~/components/General/Container';
import { Theme } from '~/store/ThemeSlice/themes';

export const Container = styled(GeneralContainer)`
    margin-top: 20px;
    margin-bottom: 2.5rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
`;

export const Wrapper = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
    height: 100%;
`;

export const Banner = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 30px;
    @media (min-width: 768px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
`;

export const BackgroundFade = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
    height: 100vh;
    width: 100vw;
    background: ${({ theme }) => {
        switch (theme.theme) {
            case Theme.Light:
                return 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 16.59%), #E5E7EB';
            default:
                return 'linear-gradient(180deg, #202020 0%, rgba(32, 32, 32, 0) 16.59%), #000000';
        }
    }};
`;

export const InnerCellSubText = styled.div`
    font-size: 12px;
    color: #71717a;
`;
