import React from 'react';
import { ToastContainer } from 'react-toastify';
import { createGlobalStyle } from 'styled-components';

// a full list of variables can be found https://fkhadra.github.io/react-toastify/how-to-style
const ToastStyles = createGlobalStyle`
    :root {
        // could set dark colors for light and dark but theme never gets set through toast
        --toastify-color-light: var(--background);
        .Toastify__close-button--light {
            color: var(--text);

        }
        --toastify-toast-width: 430px; // -10 :)
        .Toastify__close-button--light {
            position: absolute;
            right: 20px;
            top: 20px;
        }
    }

`;

export const ToastContainerWithStyles = (): JSX.Element => (
    <>
        <ToastContainer icon={false} />
        <ToastStyles />
    </>
);

export default ToastContainerWithStyles;
