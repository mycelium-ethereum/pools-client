import DiscourseSVG from '/public/img/logos/launcher/discourse.svg';
import SnapshotSVG from '/public/img/logos/launcher/snapshot.svg';
import GitbookSVG from '/public/img/logos/launcher/gitbook.svg';
import GithubSVG from '/public/img/logos/launcher/github.svg';
import TwitterSVG from '/public/img/logos/launcher/twitter.svg';
import DiscordSVG from '/public/img/logos/launcher/discord.svg';
import TracerBlogSVG from '/public/img/logos/tracer/tracer-blog.svg';

export const governanceContent = [
    {
        link: 'https://discourse.tracer.finance/',
        LogoImage: DiscourseSVG,
        alt: 'Discourse logo',
        label: 'Forum',
    },
    {
        link: 'https://snapshot.org/#/tracer.eth',
        LogoImage: SnapshotSVG,
        alt: 'Snapshot logo',
        label: 'Voting',
    },
];

export const linkContent = [
    {
        link: 'https://github.com/tracer-protocol',
        LogoImage: GithubSVG,
        alt: 'Github logo',
        label: 'Github',
    },
    {
        link: 'https://docs.tracer.finance/tracer-docs-portal/readme',
        LogoImage: GitbookSVG,
        alt: 'Gitbook logo',
        label: 'Documentation',
    },
    {
        link: 'https://tracer.finance/radar',
        LogoImage: TracerBlogSVG,
        alt: 'Tracer Blog logo',
    },
];

export const socialLinkContent = [
    {
        link: 'https://twitter.com/TracerDAO',
        LogoImage: TwitterSVG,
        alt: 'Twitter logo',
    },
    {
        link: 'https://discord.com/invite/tracerdao',
        LogoImage: DiscordSVG,
        alt: 'Discord logo',
    },
];
