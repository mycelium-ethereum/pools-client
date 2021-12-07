import React from 'react';

export const FooterLink: React.FC<{ link: string }>= ({ link, children }) => (
    <a
        className="my-auto mr-4 transition-opacity hover:opacity-80"
        href={link}
        target="_blank"
        rel="noreferrer"
    >
        {children}
    </a>
)

export const FooterItem: React.FC = ({ children }) => (
    <div
        className="ml-0 mb-4 lg:mb-0 ml-0 lg:ml-4 last:mb-0"
    >
        {children}
    </div>
)

