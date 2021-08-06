import React from 'react';
import styled from 'styled-components';

export const MatchingEngine: React.FC<{ title: string; subTitle: string }> = ({ title, subTitle }) => (
    <div className="m-auto text-center">
        <a>
            <strong>{title}</strong>
        </a>
        <br></br>
        <a>{subTitle}</a>
    </div>
);

export const Option = styled.a`
    margin: auto;
`;
