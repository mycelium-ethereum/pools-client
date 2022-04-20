import React from 'react';
import * as Styles from './styles';

type Props = {
    badge?: string;
    title: string;
    content: string;
    href: string;
    linkText: string;
};

export const HelpCard: React.FC<Props> = ({ badge, title, content, href, linkText }) => (
    <Styles.GuideCard>
        {badge && <Styles.Badge>{badge}</Styles.Badge>}
        <Styles.GuideCardTitle>{title}</Styles.GuideCardTitle>
        <div>{content}</div>
        <Styles.Link href={href}>{linkText}</Styles.Link>
    </Styles.GuideCard>
);
