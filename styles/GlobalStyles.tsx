import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

    html.light {
        --color-background: #fff;
        --color-background-secondary: #E5E5E5;
        --color-text: #000;
        --color-primary: #0000B0;
        --color-secondary: #005ea4;
        --color-accent: #002886;

        --table-darkborder: #00156C;
        --table-semidarkborder: #000240;
        --table-lightborder: #002886;

    }

  	html {
        font-size:16px;

        --color-background: #000240;
        --color-background-secondary: #00125D;
        --color-text: #fff;
        --color-primary: #3da8f5;
        --color-secondary: #005ea4;
        --color-accent: #002886;
        --color-red: #F15025;
        --color-green: #05CB3A; 

        --font-size-ultra-small: 11px;
        --status-lightblue: #3da8f5;
        --status-orange: #F15025;
        --status-white: #fff;

        --table-darkborder: #00156C;
        --table-semidarkborder: #000240;
        --table-lightborder: #002886;
        
        --font-size-extra-small: 12px;
        --font-size-small: 16px;
        --font-size-small-heading: 16px;
        --font-size-medium: 20px;
        --font-size-large: 20px;
        --font-size-xlarge: 36px;

        --letter-spacing-small: -0.32px;
        --letter-spacing-extra-small: -0.4px;

        --height-extra-small-container: 40px;
        --height-small-container: 60px;

        --height-medium-button: 32px;
        --height-small-button: 28px;
        --height-extra-small-button: 22px;

        @media (max-width: 1600px) { 
            --font-size-extra-small: 12px;
            --font-size-small: 13px;
            --font-size-medium: 16px;
            --font-size-large: 18px;
            --font-size-xlarge: 40px;
            --height-small-container: 44px;
        }
      
        background-color: var(--color-background);
        color: var(--color-text);

        @media (max-height: 800px) {
            font-size: 12px;
        }

        // a {
        //     color: #3DA8F5;
        //     text-decoration: underline;
        // }
  	}

    .tracer-loading {
        font-size: 32px;
        color: var(--color-secondary);
    }

    /** GLOBAL TABLE STYLES */
    .bid, .green {
        color: #05CB3A;
    }

    .ask, .red {
        color: #F15025;
    }

    /* Scroll bar stuff */
    ::-webkit-scrollbar {
        width: 7px;
        height: 7px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Corner piece */
    ::-webkit-scrollbar-corner {
        display: none;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: var(--color-primary);
        cursor: pointer;
        border-radius: 10px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: var(--color-accent);
    }

    .bn-onboard-custom.bn-onboard-modal { 
        z-index: 99;
    }

    // React toast notifications
    .react-toast-notifications__container {
        top: 65px !important;
        z-index: 100001 !important;
    }
`;
