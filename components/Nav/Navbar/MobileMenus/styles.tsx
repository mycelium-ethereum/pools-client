import styled from 'styled-components';

export const NavMenu = styled.menu<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    padding: 0;
    overflow: hidden;
    transition: height 0.5s ease;
    height: ${({ isOpen }) => (isOpen ? '100%' : '0%')};
    margin: 0;
    z-index: 49;
    font-family: 'Aileron';

    > div:first-of-type {
        z-index: 1;
    }
`;

export const MeshBackground = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-image: url('/img/launcher/mesh.png'), linear-gradient(#1c64f2, #1c64f2);
    background-size: cover;
    background-position: right;
    z-index: 0;
`;

export const NavList = styled.div`
    position: static;
    top: 0;
    left: 16px;
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 92px 0px 28px;

    @media only screen and (min-width: 768px) {
        position: absolute;
        width: calc(100% - 32px);

        /* Hide selectors and dropdowns above 768px */
        > div:nth-child(1) div {
            display: none;
        }
        > div:nth-child(2) {
            display: none;
        }
    }
`;
export const ScrollContainer = styled.div`
    height: 424px;

    @media only screen and (max-height: 700px) {
        overflow-y: auto;
        overflow-x: hidden;
    }
`;

export const LauncherScrollContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    @media only screen and (max-height: 650px) {
        overflow-y: auto;
        overflow-x: hidden;
    }
`;

export enum PaddingLevelEnum {
    one = 1,
    two = 2,
    three = 3,
}

export const NavItem = styled.li<{ selected?: boolean; paddingLevel: number; linkPadding?: boolean }>`
    position: relative;
    width: 100%;
    font-weight: ${({ selected }) => (selected ? '700' : '300')};
    font-size: 32px;
    line-height: 40px;
    color: #ffffff;

    ${({ paddingLevel, linkPadding }) => {
        switch (true) {
            case paddingLevel === PaddingLevelEnum.one && !linkPadding:
                return `
                    padding: 8px 0;
                `;
            case paddingLevel === PaddingLevelEnum.two && !linkPadding:
                return `
                    padding: 12px 0;
                `;
            case paddingLevel === PaddingLevelEnum.three && !linkPadding:
                return `
                    padding: 26px 0;
                `;
            default:
                return `
                    padding: 0;
                `;
        }
    }}

    &:after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0px;
        height: 1px;
        width: 100%;
        background: linear-gradient(90deg, #3da8f5 50%, rgba(61, 168, 245, 0) 100.15%);
    }

    &:hover:before {
        opacity: 1;
    }
    &:before {
        content: '';
        position: absolute;
        left: 50%;
        top: 0;
        height: 100%;
        width: 150%;
        transform: translateX(-50%);
        background: #3da8f5;
        z-index: -1;
        transition: opacity 0.3s ease;
        opacity: 0;
    }

    > a {
        display: flex;

        ${({ paddingLevel }) => {
            switch (paddingLevel) {
                case PaddingLevelEnum.one:
                    return `
                    padding: 8px 0;
                `;
                case PaddingLevelEnum.two:
                    return `
                    padding: 12px 0;
                `;
                case PaddingLevelEnum.three:
                    return `
                    padding: 26px 0;
                `;
                default:
                    return `
                    padding: 12px 0;
                `;
            }
        }}
    }
`;

export const SocialItem = styled(NavItem)`
    &:first-of-type {
        margin-top: 16px;
    }
    > a {
        display: flex;
        align-items: center;
        > svg {
            width: 22px;
            margin-right: 16px;
        }
    }
    > a span {
        font-size: 24px;
        line-height: 44px;
    }
`;

export const SocialIconRow = styled.div`
    display: flex;
    align-items: center;
    margin-top: 16px;
    color: #ffffff;

    svg {
        margin-right: 56px;
    }
    > a svg:nth-child(1) {
        width: 37px;
        height: 37px;
    }
    > a svg:nth-child(2) {
        width: 31px;
        height: 23px;
    }
    > a svg:nth-child(3) {
        width: 37px;
        height: 22px;
    }
`;
