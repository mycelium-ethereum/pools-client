import React from 'react';
import { LegalPageLayout, Legal } from '@components/Legal';

const Disclaimer: React.FC = () => {
    return (
        <LegalPageLayout>
            <Legal.MainTitle>Tracer Protocol Disclaimer</Legal.MainTitle>
            <Legal.Subtitle>Last Updated: 2 September 2021</Legal.Subtitle>
            <Legal.Paragraph>
                Your use of a smart contract governed by Tracer DAO, including Tracer Perpetual Swaps, ({'"'}
                Tracer protocol{'"'}) involves various risks, including, but not limited to, the risks outlined below.
                By interacting with the Tracer protocol, you accept those risks. If you choose to use the Tracer
                protocol, this Disclaimer applies in addition to Tracer{"'"}s{' '}
                <a href="/terms-of-use/" target="_blank">
                    Terms of Use
                </a>
                .
            </Legal.Paragraph>
            <Legal.Title>Price and asset risk:</Legal.Title>
            <Legal.Paragraph>
                Asset losses are possible due to the fluctuation of prices of tokens. You acknowledge that financial
                contracts involving cryptocurrencies are inherently risky, some cryptocurrencies are not recognised
                legal tender in some countries, are unregulated by many central and government authorities, and may be
                subject to extreme price volatility. You warrant that you understand the risks associated with
                transactions, cryptocurrencies, financial contracts and any other goods, services or products in
                connection to the Tracer protocol. Before using the Tracer protocol, you should review the relevant
                documentation to make sure you understand how the Tracer protocol works.
            </Legal.Paragraph>
            <Legal.Title>Liquidation risk:</Legal.Title>
            <Legal.Paragraph>
                When interacting with the Tracer protocol, your positions are subject to liquidation risk. Despite
                having well defined liquidation penalties, your loss could be 100% of your position. This risk is not
                only theoretical, during the so-called {'"'}Black Thursday{'"'}, around $8M of user{"'"}s positions in
                MakerDAO was lost. The Tracer protocol is non-custodial, and therefore can not help users to avoid
                liquidations, or recover funds following liquidation.
            </Legal.Paragraph>
            <Legal.Title>Oracle risk:</Legal.Title>
            <Legal.Paragraph>
                Tracer relies on oracles to provide spot price data for assets. This price data is used as part of the
                liquidation flow and, as a result, has inherent risks. Should oracle prices not be updated, or should
                they be updated erroneously, there is risk a user may be liquidated unexpectedly. At this time, the
                Tracer protocol uses Chainlink{"'"}s oracle network; however, this may be subject to change.
            </Legal.Paragraph>
            <Legal.Title>Smart contract and software risk:</Legal.Title>
            <Legal.Paragraph>
                The Tracer protocol has been audited by Sigma Prime and Code 423n4. The contracts were checked for
                correctness of functionality and safety of user funds. However, an audit does not eliminate the risk of
                an exploit or bug being present in the Tracer protocol. You must do your own research before interacting
                with the Tracer protocol, and only supply funds that you are prepared to lose.
            </Legal.Paragraph>
            <Legal.Title>Contract upgrade risk:</Legal.Title>
            <Legal.Paragraph>
                Contract upgrades may be implemented by Tracer DAO, via proposal, to the Tracer protocol. While these
                upgrades will likely be audited prior to implementation, the Tracer protocol{"'"}s codebase is subject
                to change and, as such, risks of exploits and bugs are present. You must remain aware of updates being
                implemented by Tracer DAO to the Tracer protocol, and ensure that, following any update, the Tracer
                protocol is safe to use.
            </Legal.Paragraph>
            <Legal.Title>Governance risk:</Legal.Title>
            <Legal.Paragraph>
                Tracer DAO owns and controls the Tracer protocol. Upgrades and modifications to the protocol are managed
                in a decentralised manner by holders of TCR governance tokens. No entity involved in creating the Tracer
                protocol (including developers) will be liable for any claims or damage whatsoever associated with your
                use, inability to use, direct, indirect, incidental, special, exemplary, punitive or consequential
                damages, or loss of profits, cryptocurrencies, tokens, or anything else of value. For the avoidance of
                doubt, Tracer DAO does not control user funds.
            </Legal.Paragraph>
            <Legal.Paragraph>
                Discussions with updated information on the Tracer protocol{"'"}s governance can be found in{' '}
                <a href="https://discourse.tracer.finance/" target="_blank" rel="noreferrer">
                    {"Tracer DAO's Discourse"}
                </a>
                .
            </Legal.Paragraph>
        </LegalPageLayout>
    );
};

export default Disclaimer;
