import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

/* eslint-disable */
export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
                });

            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            };
        } finally {
            sheet.seal();
        }
    }
    render() {
        return (
        <Html>
            <Head>
                <script src="/scripts/mat.js" />
                <script src="/scripts/mat-container.js" />
                <script defer src="/scripts/mat-script.js" />
                <script src="/scripts/theme.js" />
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
        )
    }
}
