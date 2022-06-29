import GithubSVG from '/public/img/logos/launcher/github.svg';
import SnapshotSVG from '/public/img/logos/launcher/snapshot.svg';
import DiscourseSVG from '/public/img/logos/launcher/discourse.svg';
import GitbookSVG from '/public/img/logos/launcher/gitbook.svg';
import TwitterSVG from '/public/img/logos/launcher/twitter.svg';
import DiscordSVG from '/public/img/logos/launcher/discord.svg';
import MediumSVG from '/public/img/logos/launcher/medium.svg';

export const menuContent = [
    {
        link: 'https://tracer.finance',
        logo: '/img/logos/tracer/products/main.svg',
        alt: 'Tracer',
    },
    {
        link: '/',
        logo: '/img/logos/tracer/products/perpetual-pools.svg',
        alt: 'Tracer Perpetual Pools',
    },
];

export const socialLinkContent = [
    {
        link: 'https://github.com/tracer-protocol',
        logo: GithubSVG,
        label: 'Github',
    },
    {
        link: 'https://snapshot.org/#/tracer.eth',
        logo: SnapshotSVG,
        label: 'Voting',
    },
    {
        link: 'https://discourse.tracer.finance/',
        logo: DiscourseSVG,
        label: 'Forum',
    },
    {
        link: 'https://docs.tracer.finance/tracer-docs-portal/readme',
        logo: GitbookSVG,
        label: 'User Documentation',
    },
];

export const socialIconContent = [
    {
        link: 'https://twitter.com/TracerDAO',
        logo: TwitterSVG,
        alt: 'Twitter',
    },
    {
        link: 'https://discord.com/invite/tracerdao',
        logo: DiscordSVG,
        label: 'Discord',
    },
    {
        link: 'https://tracerdao.medium.com/',
        logo: MediumSVG,
        label: 'Medium',
    },
];
