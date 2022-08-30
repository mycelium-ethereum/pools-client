import DiscordLogo from '~/public/img/socials/discord.svg';
import DiscourseLogo from '~/public/img/socials/discourse.svg';
import GitbookLogo from '~/public/img/socials/gitbook.svg';
import GitHubLogo from '~/public/img/socials/github.svg';
import TwitterLogo from '~/public/img/socials/twitter.svg';

export const footerSocialContent = [
    {
        alt: 'Gitbook',
        href: 'https://pools.docs.mycelium.xyz',
        logo: GitbookLogo,
        className: 'w-6',
    },
    {
        alt: 'Discourse',
        href: 'https://discourse.tracer.finance',
        logo: DiscourseLogo,
        className: 'w-5',
    },
    {
        alt: 'Twitter',
        href: 'https://twitter.com/mycelium_xyz',
        logo: TwitterLogo,
        className: 'w-6',
    },
    {
        alt: 'GitHub',
        href: 'https://github.com/mycelium-ethereum/perpetual-pools-contracts',
        logo: GitHubLogo,
        className: 'w-6',
    },
    {
        alt: 'Discord',
        href: 'https://discord.com/invite/mycelium-xyz',
        logo: DiscordLogo,
        className: 'w-6',
    },
];

export const footerLinkContent = [
    {
        label: 'Request a Feature',
        href: 'https://feedback.tracer.finance/feature-requests',
    },
    {
        label: 'Privacy Policy',
        href: 'https://mycelium.xyz/privacy-policy',
    },
    {
        label: 'Terms of Use',
        href: 'https://mycelium.xyz/terms-of-use',
    },
    // {
    //     label: 'Disclaimer',
    //     href: 'https://tracer.finance/privacy-policy#interfaces-disclaimer',
    // },
    {
        label: 'Participation Agreement',
        href: 'https://gateway.pinata.cloud/ipfs/QmS161WXV2bEAWUtdecfS5FYPmHQZdhNnjVFAwQ5FTX3og',
    },
    // {
    //     label: 'Security Audits',
    //     href: 'https://docs.tracer.finance/security/audits-and-security',
    // },
];
