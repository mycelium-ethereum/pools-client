import styled from 'styled-components';
import CTABackground from '~/public/img/cta-bg.svg';

export const Container = styled.div`
    overflow: hidden;
    position: relative;
    padding: 1.25rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    justify-content: center;
    display: flex;
    align-items: center;
`;

export const Background = styled(CTABackground)`
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
`;

export const Wrapper = styled.div`
    display: flex;
    position: relative;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const Title = styled.div`
    margin-bottom: 1.25rem;
    color: #ffffff;
    font-size: 1.5rem;
    line-height: 2rem;
    text-align: center;
`;

export const Button = styled.button`
    display: flex;
    background-color: #2563eb;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 12rem;
    height: 3rem;
    border-radius: 0.5rem;
    cursor: pointer;
`;
