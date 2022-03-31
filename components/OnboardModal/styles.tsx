import styled from 'styled-components';
import CloseSVG from '/public/img/general/close.svg';
import WaveSVG from '/public/img/onboard/wave.svg';
import QuestionSVG from '/public/img/onboard/question.svg';
import { Theme } from '~/store/ThemeSlice/themes';

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

export const Wave = styled(WaveSVG)`
    fill: ${({ theme }) => {
        switch (theme.theme) {
            case Theme.Light:
                return '#F3F4F6';
            default:
                return '#374151';
        }
    }};
`;

export const Question = styled(QuestionSVG)`
    fill: ${({ theme }) => {
        switch (theme.theme) {
            case Theme.Light:
                return '#E5E7EB';
            default:
                return '#374151';
        }
    }};
`;
