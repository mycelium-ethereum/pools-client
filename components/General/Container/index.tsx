import React from 'react';
import styled from 'styled-components';
import { classNames } from '~/utils/helpers';

export const Container = styled(({ className, children }) => (
    <div className={classNames('container', className)}>{children}</div>
))`
    padding: 0 1rem;
    transition: 0.3s;
`;
