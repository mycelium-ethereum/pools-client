import React from 'react';
import NavBar from '@components/Nav';
import styled from 'styled-components';
import Footer from '@components/Footer';
import Link from 'next/link';
import { GeneralContainer, BodyText, MainTitle, SubHeading, Title, Text, List, ListItem } from '@components/Legal';
const Terms: React.FC = styled(({ className }) => {
    return (
        <div className={className}>
            <NavBar />
            <GeneralContainer className={'container'}>
                <MainTitle>Terms of Use</MainTitle>
                <BodyText>
                    <SubHeading>Last Updated on July 8, 2021</SubHeading>
                    <Text>
                        <b>
                            THESE TERMS OF USE CONSTITUTE A LEGALLY BINDING AGREEMENT BETWEEN YOU AND US. PLEASE READ
                            THESE TERMS CAREFULLY TO ENSURE THAT YOU UNDERSTAND AND AGREE TO EVERY PORTION OR THESE
                            TERMS BEFORE USING ANY PART OF THE SERVICE.
                        </b>
                    </Text>
                    <Text>
                        These terms and conditions, together with any documents and additional terms they expressly
                        incorporate by reference, which includes any other terms and conditions or other agreement that
                        Tracer DAO ({'"'}Tracer DAO,{'"'} {'"'}we,{'"'} {'"'}us{'"'} and {'"'}our{'"'}) posts publicly
                        or makes available to you or the company or other legal entity you represent ({'"'}you{'"'} or{' '}
                        {'"'}your{'"'}) (collectively, these {'"'}Terms{'"'}), are entered into between Tracer DAO and
                        you concerning your use of, and access to, Tracer DAO{"'"}s websites, including
                        tracer.finance/exchange/; web applications; mobile applications; and all associated sites linked
                        thereto by Tracer DAO or its affiliates (collectively with any materials and services available
                        therein, and successor website(s) or application(s) thereto, the {'"'}Site{'"'}).
                    </Text>
                    <Text>
                        BY ACCESSING OR USING THE SITE, YOU REPRESENT AND WARRANT THAT YOU WILL NOT USE THE SITE IF THE
                        LAWS APPLICABLE TO YOU OF DUE TO YOUR COUNTRY OF RESIDENCY AND/OR CITIZENSHIP PROHIBIT YOU FROM
                        DOING SO IN ACCORDANCE WITH THESE TERMS. OUR PERPETUAL SWAP CONTRACTS ARE NOT OFFERED TO PERSONS
                        OR ENTITIES WHO RESIDE IN, ARE CITIZENS OF, ARE LOCATED IN, ARE INCORPORATED IN, OR HAVE A
                        REGISTERED OFFICE IN THE UNITED STATES OF AMERICA (COLLECTIVELY, {'"'}US PERSONS{'"'}) OR ANY
                        RESTRICTED TERRITORY, AS DEFINED BELOW (ANY SUCH PERSON OR ENTITY FROM THE UNITED STATES OF
                        AMERICA OR A RESTRICTED TERRITORY, A {'"'}RESTRICTED PERSON{'"'}). WE DO NOT MAKE EXCEPTIONS;
                        THEREFORE, IF YOU ARE A RESTRICTED PERSON, DO NOT ATTEMPT TO USE OUR PERPETUAL SWAP CONTRACTS,
                        SITE OR SERVICES. USE OF A VIRTUAL PRIVATE NETWORK ({'"'}VPN{'"'}) TO CIRCUMVENT THE
                        RESTRICTIONS SET FORTH HEREIN IS PROHIBITED. PURSUANT TO APPLICABLE LAWS AND REGULATIONS, TRACER
                        DAO MAINTAINS THE RIGHT TO SELECT ITS MARKETS AND JURISDICTIONS TO OPERATE AND MAY RESTRICT OR
                        DENY THE USE OF THE SITE OR ANY PART THEREOF, IN CERTAIN COUNTRIES AT ITS DISCRETION.
                    </Text>
                    <Text>
                        Please read these Terms carefully, as these Terms govern your use of the Site and access to the
                        factory; matching engine; smart contracts; decentralised applications; APIs and all other
                        software that Tracer DAO has developed for entering into perpetual swap contracts ({'"'}
                        Perpetual Swap Contracts{'"'}) related to any asset with an ascertainable price feed, including
                        cryptocurrencies, cryptographic tokens and other blockchain-based assets (collectively,
                        {'"'}Assets{'"'}) (collectively, the {'"'}Services{'"'}). These Terms expressly cover your
                        rights and obligations, and our disclaimers and limitations of legal liability, relating to your
                        use of, and access to, the Site and the Services. By clicking {'"'}I accept{'"'} (or a similar
                        language) to these Terms, acknowledging these Terms and Conditions by other means, or otherwise
                        accessing or using the Site or the Services, you accept and agree to be bound by and to comply
                        with these Terms, including, without limitation, the mandatory arbitration provision in Section
                        15. If you do not agree to these Terms, then you must not access or use the Site or the
                        Services.
                    </Text>
                    <Text>
                        Please carefully review the disclosures and disclaimers set forth in Section 12 in their
                        entirety before using any software developed by Tracer DAO. The information in Section 12
                        provides important details about the legal obligations associated with your use of the Services.
                        By accessing or using the Site or the Services, you agree that Tracer DAO does not provide
                        execution, settlement, or clearing services of any kind and is not responsible for the
                        execution, settlement, or clearing of transactions automated through the Services.
                    </Text>
                    <Title>1. MODIFICATIONS TO THESE TERMS</Title>
                    <Text>
                        We reserve the right, in our sole discretion, to modify these Terms from time to time. If we
                        make changes, we will provide you with notice of such changes, such as by providing notice
                        through the Services or updating the {'"'}Last Updated{'"'} date at the top of these Terms.
                        Unless we state otherwise in our notice, all such modifications are effective immediately, and
                        your continued use of the Site and the Services after we provide that notice will confirm your
                        acceptance of the changes. If you do not agree to the amended Terms, then you must stop using
                        the Site and the Services.
                    </Text>
                    <Title>2. USE OF SERVICES</Title>
                    <Text>
                        2.1 As a condition to accessing or using the Services or the Site, you represent and warrant to
                        Tracer DAO the following:
                    </Text>
                    <List>
                        <ListItem>
                            if you are entering into these Terms as an individual, then you are of legal age in the
                            jurisdiction in which you reside and you have the legal capacity to enter into these Terms
                            and be bound by them;
                        </ListItem>
                        <ListItem>
                            if you are entering into these Terms as an entity, then you must have the legal authority to
                            accept these Terms on that entity{"'"}s behalf, in which case {'"'}you{'"'} (except as used
                            in this paragraph) will mean that entity;
                        </ListItem>
                        <ListItem>
                            if you are entering into these Terms to access Perpetual Swaps Contracts or will in the
                            future access Perpetual Swaps Contracts, then you are not a US Person;
                        </ListItem>
                        <ListItem>
                            you do not, and will not, use VPN software or any other privacy or anonymisation tools or
                            techniques to circumvent, or attempt to circumvent, any restrictions that apply to the
                            Services; and
                        </ListItem>
                        <ListItem>
                            you are not a resident of, reside in, a citizen of, incorporated in, or have a registered
                            office in China, the United States, Antigua and Barbuda, Algeria, Bangladesh, Bolivia,
                            Belarus, Burundi, Myanmar (Burma), Cote D{"'"}Ivoire (Ivory Coast), Crimea and Sevastopol,
                            Cuba, Democratic Republic of Congo, Ecuador, Iran, Iraq, Liberia, Libya, Magnitsky, Mali,
                            Morocco, Nepal, North Korea, Somalia, Sudan, Syria, Venezuela, Yemen, Zimbabwe or any other
                            country to which the United States, the United Kingdom or the European Union embargoes goods
                            or imposes similar sanctions (collectively, {'"'}Restricted Territories{'"'});
                        </ListItem>
                        <ListItem>
                            you are not a member of any sanctions list or equivalent maintained by the United States
                            government, the United Kingdom government, by the European Union or the United Nations
                            (collectively, {'"'}Sanctions Lists Persons{'"'});
                        </ListItem>
                        <ListItem>
                            you do not intend to transact with any Restricted Territories or Sanctions List Persons;
                        </ListItem>
                        <ListItem>you are not a Restricted Person; and</ListItem>
                        <ListItem>
                            your access to the Services is not (a) prohibited by and does not otherwise violate or
                            assist you to violate any domestic or foreign law, rule, statute, regulation, by-law, order,
                            protocol, code, decree, or another directive, requirement, or guideline, published or in
                            force that applies to or is otherwise intended to govern or regulate any person, property,
                            transaction, activity, event or other matter, including any rule, order, judgment, directive
                            or other requirement or guideline issued by any domestic or foreign federal, provincial or
                            state, municipal, local or other governmental, regulatory, judicial or administrative
                            authority having jurisdiction over Tracer DAO, you, the Site or the Services, or as
                            otherwise duly enacted, enforceable by law, the common law or equity (collectively,
                            {'"'}Applicable Laws{'"'}); or (b) contribute to or facilitate any illegal activity.
                        </ListItem>
                    </List>
                    <Text>
                        2.2 As a condition to accessing or using the Services or the Site, you acknowledge, understand,
                        and agree to the following:
                    </Text>
                    <List>
                        <ListItem>
                            from time to time the Site and the Services may be inaccessible or inoperable for any
                            reason, including, without limitation: (a) equipment malfunctions; (b) periodic maintenance
                            procedures or repairs that Tracer DAO or any of its suppliers or contractors may undertake
                            from time to time; (c) causes beyond Tracer DAO{"'"}s control or that Tracer DAO could not
                            reasonably foresee; (d) disruptions and temporary or permanent unavailability of underlying
                            blockchain infrastructure; or (e) unavailability of third-party service providers or
                            external partners for any reason;
                        </ListItem>
                        <ListItem>
                            we reserve the right to disable or modify access to the Site and the Services at any time in
                            the event of any breach of these Terms, including, without limitation, if we reasonably
                            believe any of your representations and warranties may be untrue or inaccurate, and we will
                            not be liable to you for any losses or damages you may suffer as a result of or in
                            connection with the Site or the Services being inaccessible to you at any time or for any
                            reason;
                        </ListItem>
                        <ListItem>
                            the Site and the Services may evolve, which means Tracer DAO may apply changes, replace, or
                            discontinue (temporarily or permanently) the Services at any time in its sole discretion;
                        </ListItem>
                        <ListItem>
                            the pricing information provided on the Site does not represent an offer, a solicitation of
                            an offer, or any advice regarding, or recommendation to enter into, a transaction with
                            Tracer DAO;
                        </ListItem>
                        <ListItem>
                            Tracer DAO does not act as an agent for you or any other user of the Site or the Services;
                        </ListItem>
                        <ListItem>
                            you are solely responsible for your use of the Services, including all of your transfers of
                            Assets;
                        </ListItem>
                        <ListItem>
                            to the fullest extent not prohibited by Applicable Law, we owe no fiduciary duties or
                            liabilities to you or any other party, and that to the extent any such duties or liabilities
                            may exist at law or in equity, you hereby irrevocably disclaim, waive, and eliminate those
                            duties and liabilities;
                        </ListItem>
                        <ListItem>
                            your use of the Services is at your own risk and you agree that Tracer DAO is not liable for
                            any damage or harm arising out of your use of the Services;
                        </ListItem>
                        <ListItem>
                            you are solely responsible for reporting and paying any taxes applicable to your use of the
                            Services; and
                        </ListItem>
                        <ListItem>
                            we have no control over, or liability for, the delivery, quality, safety, legality, or any
                            other aspect of any Assets that you may transfer to or from a third party, and we are not
                            responsible for ensuring that an entity with whom you transact completes the transaction or
                            is authorised to do so, and if you experience a problem with any transactions in Assets
                            using the Services, then you bear the entire risk.
                        </ListItem>
                    </List>
                    <Text>
                        2.3 As a condition to accessing or using the Services or the Site, you covenant to Tracer DAO
                        the following:
                    </Text>
                    <List>
                        <ListItem>
                            in connection with using the Services, you only will transfer legally-obtained Assets that
                            belong to you;
                        </ListItem>
                        <ListItem>
                            you will obey all Applicable Laws in connection with using the Services, and you will not
                            use the Site or the Services if the laws of your country, or any other Applicable Law,
                            prohibit you from doing so;
                        </ListItem>
                        <ListItem>
                            any Assets you use in connection with the Services are either owned by you or you are
                            validly authorised to carry out actions using such Assets;
                        </ListItem>
                        <ListItem>
                            in addition to complying with all restrictions, prohibitions, and other provisions of these
                            Terms, you will (a) ensure that, at all times, all information that you provide on the Site
                            and during your use of the Services is current, complete, and accurate; (b) maintain the
                            security and confidentiality of your private keys associated with your public Ethereum
                            address, passwords, API keys and other related credentials.
                        </ListItem>
                    </List>
                    <Title>3. FEES AND PRICE ESTIMATES</Title>
                    <Text>
                        In connection with your use of the Services, you are required to pay all fees necessary for
                        interacting with the Ethereum blockchain, including {'"'}gas{'"'} costs, as well as all other
                        fees reflected on the Site at the time of your use of the Services. Although we attempt to
                        provide accurate fee information, fee information displayed on the Site reflect our estimates of
                        fees, which may vary from the actual fees paid to use the Services and interact with the
                        Ethereum blockchain.
                    </Text>
                    <Title>4. NO PROFESSIONAL ADVICE OR FIDUCIARY DUTIES</Title>
                    <Text>
                        All information provided in connection with your access and use of the Site and the Services is
                        for informational purposes only and should not be construed as professional advice. You should
                        not take, or refrain from taking, any action based on any information contained on the Site or
                        any other information that we make available at any time, including, without limitation, blog
                        posts, articles, links to third-party content, Discord content, Discourse posts, news feeds,
                        newsletters, tutorials, tweets and videos. Before you make any financial, legal, or other
                        decisions involving the Services, you should seek independent professional advice from an
                        individual who is licensed and qualified in the area for which such advice would be appropriate.
                        These Terms are not intended to, and do not, create or impose any fiduciary duties on us. You
                        further agree that the only duties and obligations that we owe you are those set out expressly
                        in these Terms.
                    </Text>
                    <Title>5. PROHIBITED ACTIVITY</Title>
                    <Text>
                        You may not use the Services to engage in the categories of activity set forth below ({'"'}
                        Prohibited Uses{'"'}). The specific activities set forth below are representative, but not
                        exhaustive, of the Prohibited Uses. If you are uncertain as to whether or not your use of the
                        Services involves a Prohibited Use or have other questions about how these requirements apply to
                        you, then please contact us at hello@tracer.finance. By using the Site or Services, you confirm
                        that you will not use the Site or Services to do any of the following:
                    </Text>
                    <List>
                        <ListItem>
                            violate any Applicable Laws including, without limitation, any relevant and applicable
                            anti-money laundering and anti-terrorist financing laws and sanctions programs and
                            legislation;
                        </ListItem>
                        <ListItem>
                            use the Services in any manner that could interfere with, disrupt, negatively affect, or
                            inhibit other users from fully enjoying the Services, or that could damage, disable,
                            overburden, or impair the functioning of the Site or the Services in any manner;
                        </ListItem>
                        <ListItem>
                            circumvent any content-filtering techniques, security measures or access controls that
                            Tracer DAO employs on the Site, including, without limitation, through the use of a VPN;
                        </ListItem>
                        <ListItem>
                            use any robot, spider, crawler, scraper, or other automated means or interface not provided
                            by us, to access the Services or to extract data, or introduce any malware, virus, Trojan
                            horse, worm, logic bomb, drop-dead device, backdoor, shutdown mechanism or other harmful
                            material into the Site or the Services;
                        </ListItem>
                        <ListItem>
                            provide false, inaccurate, or misleading information while using the Site or the Services or
                            engage in activity that operates to defraud Tracer DAO, other users of the Services, or any
                            other person;
                        </ListItem>
                        <ListItem>
                            use or access the Site or Services to transmit or exchange Assets that are the direct or
                            indirect proceeds of any criminal or fraudulent activity, including, without limitation,
                            terrorism or tax evasion;
                        </ListItem>
                        <ListItem>
                            use the Site in any way that is, in our sole discretion, libelous, defamatory, profane,
                            obscene, pornographic, sexually explicit, indecent, lewd, vulgar, suggestive, harassing,
                            stalking, hateful, threatening, offensive, discriminatory, bigoted, abusive, inflammatory,
                            fraudulent, deceptive, or otherwise objectionable or likely or intended to incite, threaten,
                            facilitate, promote, or encourage hate, racial intolerance, or violent acts against others;
                        </ListItem>
                        <ListItem>
                            use the Site or the Services from a jurisdiction where the use of the Site or the Services
                            is prohibited;
                        </ListItem>
                        <ListItem>
                            harass, abuse, or harm of another person or entity, including Tracer DAO members, Service
                            Providers and users;
                        </ListItem>
                        <ListItem>
                            impersonate another user of the Services or otherwise misrepresent yourself; or
                        </ListItem>
                        <ListItem>
                            encourage, induce or assist any third party, or yourself attempt, to engage in any of the
                            activities prohibited under this Section 5 or any other provision of these Terms.
                        </ListItem>
                    </List>
                    <Title>6. CONTENT</Title>
                    <Text>
                        You hereby grant to us a royalty-free, fully paid-up, sublicensable, transferable, perpetual,
                        irrevocable, non-exclusive, worldwide license to use, copy, modify, create derivative works of,
                        display, perform, publish and distribute, in any form, medium, or manner, any content that is
                        available to other users as a result of your use of the Site or the Services (collectively,
                        {'"'}Your Content{'"'}), including, without limitation, for promoting Tracer DAO, its
                        affiliates, the Services or the Site. You represent and warrant that (a) you own Your Content or
                        have the right to grant the rights and licenses in these Terms; and (b) Your Content and our use
                        of Your Content, as licensed herein, does not and will not violate, misappropriate or infringe
                        on any third party{"'"}s rights.
                    </Text>
                    <Title>7. PROPRIETARY RIGHTS</Title>
                    <Text>
                        7.1 The Site and the Services are governed by the most recent version of the open-source license
                        commonly known as the {'"'}GNU General Public License v3.0{'"'} a copy of which (as it applies
                        to the Site and the Services) can be found at{' '}
                        <Link href="https://www.gnu.org/licenses/gpl-3.0.en.html">here</Link> (as of the date these
                        Terms were last updated) and any other applicable licensing terms for the Site and the Services
                        in these Terms (collectively, the {'"'}Tracer DAO License{'"'}). You acknowledge that the Site
                        or the Services may use, incorporate or link to certain open-source components and that your use
                        of the Site or Services is subject to, and you will comply with any, applicable open-source
                        licenses that govern any such open-source components (collectively, {'"'}Open-Source Licenses
                        {'"'}). Without limiting the generality of the foregoing, you may not (a) resell, lease, lend,
                        share, distribute, or otherwise permit any third party to use the Site or the Services; (b) use
                        the Site or the Services for time-sharing or service bureau purposes; or (c) otherwise use the
                        Site or the Services in a manner that violates the Tracer DAO License or any other Open-Source
                        Licenses.
                    </Text>
                    <Text>
                        7.2 Excluding the open-source software described in Section 7.1 or third-party software that the
                        Site or the Services incorporates, as between you and Tracer DAO, Tracer DAO owns the Site and
                        the Services, including all technology, content, and other materials used, displayed, or
                        provided on the Site or in connection with the Services (including all intellectual property
                        rights subsisting therein), and hereby grants you a limited, revocable, transferable, license to
                        access and use those portions of the Site and the Services that are proprietary to Tracer DAO.
                    </Text>
                    <Text>
                        7.3 The Services are non-custodial. When you use your Assets to engage with the Services, you
                        retain control over your Assets at all times. The private key(s) which holds your Assets is the
                        only private key(s) that can control the Assets that you use to engage with the Services.
                    </Text>
                    <Title>8. LINKS</Title>
                    <Text>
                        The Services provide, or third parties may provide, links to other sites, applications, or
                        resources. You acknowledge and agree that Tracer DAO is not responsible for the availability of
                        such external sites, applications or resources, and does not endorse and is not responsible or
                        liable for any content, advertising, products, or other materials on or available from such
                        sites or resources. You further acknowledge and agree that Tracer DAO shall not be responsible
                        or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or
                        in connection with use of or reliance on any such content, goods, or services available on or
                        through any such site or resource.
                    </Text>
                    <Title>9. MODIFICATION, SUSPENSION, AND TERMINATION</Title>
                    <Text>
                        We may, at our sole discretion, from time to time and with or without prior notice to you,
                        modify, suspend or disable (temporarily or permanently) the Services, in whole or in part, for
                        any reason whatsoever. Upon termination of your access, your right to use the Services will
                        immediately cease. We will not be liable for any losses suffered by you resulting from any
                        modification to any Services or from any modification, suspension, or termination, for any
                        reason, of your access to all or any portion of the Site or the Services. Sections 4, 5, 6, 7,
                        8, 10, 11, 12, 13, 14, 15, 16 of these Terms will survive any termination of your access to the
                        Site or the Services, regardless of the reasons for its expiration or termination, in addition
                        to any other provision which by law or by its nature should survive.
                    </Text>
                    <Title>10. RISKS</Title>
                    <Text>
                        10.1 By utilising the Services or interacting with the Site in any way, you represent and
                        warrant that you understand the inherent risks associated with cryptographic systems and
                        blockchain-based networks; cryptocurrencies, cryptographic tokens and other blockchain
                        based-assets, including the usage and intricacies of native cryptographic tokens, like ether
                        (ETH); smart contract-based tokens, such as those that follow the Ethereum Token Standard; and
                        systems that interact with blockchain-based networks. Tracer DAO does not own or control any of
                        the underlying software through which blockchain networks are formed. In general, the software
                        underlying blockchain networks, including the Ethereum blockchain, is open source, such that
                        anyone can use, copy, modify, and distribute it. By using the Services, you acknowledge and
                        agree (a) that Tracer DAO is not responsible for the operation of the software and networks
                        underlying the Services, (b) that there exists no guarantee of the functionality, security, or
                        availability of that software and networks, and (c) that the underlying networks are subject to
                        sudden changes in operating rules, such as those commonly referred to as {'"'}forks{'"'}, which
                        may materially affect the Services. Blockchain networks use public/private key cryptography. You
                        alone are responsible for securing your private key(s). We do not have access to your private
                        key(s). Losing control of your private key(s) will permanently and irreversibly deny you access
                        to Assets on the Ethereum blockchain or other blockchain-based network. Neither Tracer DAO nor
                        any other person or entity will be able to retrieve or protect your Assets. If your private
                        key(s) are lost, then you will not be able to transfer your Assets to any other blockchain
                        address or wallet. If this occurs, then you will not be able to realise any value or utility
                        from the Assets that you may hold.
                    </Text>
                    <Text>
                        10.2 The Services and your Assets could be impacted by one or more regulatory inquiries or
                        regulatory actions, which could impede or limit the ability of Tracer DAO to continue to make
                        available its proprietary software and, thus, could impede or limit your ability to access or
                        use the Services.
                    </Text>
                    <Text>
                        10.3 You acknowledge and understand that cryptography is a progressing field with advances in
                        code cracking or other technical advancements, such as the development of quantum computers,
                        which may present risks to Assets and the Services, and could result in the theft or loss of
                        your Assets. To the extent possible, we intend to update Tracer DAO-developed smart contracts
                        related to the Services to account for any advances in cryptography and to incorporate
                        additional security measures necessary to address risks presented from technological
                        advancements, but that intention does not guarantee or otherwise ensure full security of the
                        Services.
                    </Text>
                    <Text>
                        10.4 You understand that the Ethereum blockchain remains under development, which creates
                        technological and security risks when using the Services in addition to uncertainty relating to
                        Assets and transactions therein. You acknowledge that the cost of transacting on the Ethereum
                        blockchain is variable and may increase at any time causing impact to any activities taking
                        place on the Ethereum blockchain, which may result in price fluctuations or increased costs when
                        using the Services.
                    </Text>
                    <Text>
                        10.5 You acknowledge that the Services are subject to flaws and that you are solely responsible
                        for evaluating any code provided by the Services or Site. This warning and others Tracer DAO
                        provides in these Terms in no way evidence or represent an on-going duty to alert you to all of
                        the potential risks of utilising the Services or accessing the Site.
                    </Text>
                    <Text>
                        10.6 Although we intend to provide accurate and timely information on the Site and during your
                        use of the Services, the Site and other information available when using the Services may not
                        always be entirely accurate, complete, or current and may also include technical inaccuracies or
                        typographical errors. To continue to provide you with as complete and accurate information as
                        possible, information may be changed or updated from time to time without notice, including,
                        without limitation, information regarding our policies. Accordingly, you should verify all
                        information before relying on it, and all decisions based on information contained on the Site
                        or as part of the Services are your sole responsibility. No representation is made as to the
                        accuracy, completeness, or appropriateness for any particular purpose of any pricing information
                        distributed via the Site or otherwise when using the Services. Prices and pricing information
                        may be higher or lower than prices available on platforms providing similar services.
                    </Text>
                    <Text>
                        10.7 Any use or interaction with the Services requires a comprehensive understanding of applied
                        cryptography and computer science to appreciate the inherent risks, including those listed
                        above. You represent and warrant that you possess relevant knowledge and skills. Any reference
                        to a type of Asset on the Site or otherwise during the use of the Services does not indicate our
                        approval or disapproval of the technology on which the Asset relies, and should not be used as a
                        substitute for your understanding of the risks specific to each type of Asset.
                    </Text>
                    <Text>
                        10.8 Use of the Services, in particular entering into Perpetual Swap Contracts, may carry
                        financial risk. The Services are, by their nature, highly experimental, risky, and volatile.
                        Transactions entered into in connection with the Services are irreversible, final and there are
                        no refunds. You acknowledge and agree that you will access and use the Site and the Services at
                        your own risk. The risk of loss of Assets in connection with the Services, especially using
                        Perpetual Swap Contracts, can be substantial. You should, therefore, carefully consider whether
                        such transactions are suitable for you in light of your circumstances and financial resources.
                        By using the Services, you represent and warrant that you have been, are, and will be solely
                        responsible for making your independent appraisal and investigations into the risks of a given
                        transaction and the underlying Assets. You represent that you have sufficient knowledge, market
                        sophistication, professional advice, and experience to make your evaluation of the merits and
                        risks of any transaction conducted in connection with the Services or any Asset. You accept all
                        consequences of using the Services, including the risk that you may lose access to your Assets
                        indefinitely. All transaction decisions are made solely by you. Notwithstanding anything in
                        these Terms, we accept no responsibility whatsoever for, and will in no circumstances be liable
                        to you in connection with, your use of the Services for performing Asset transactions, including
                        entering into Perpetual Swap Contracts.
                    </Text>
                    <Text>
                        10.9 We must comply with Applicable Law, which may require us to, upon request by government
                        agencies, take certain actions or provide information, which may not be in your best interests.
                    </Text>
                    <Text>
                        10.10 You hereby assume, and agree that Tracer DAO will have no responsibility or liability for,
                        the risks set forth in this Section 10. You hereby irrevocably waive, release and discharge all
                        claims, whether known or unknown to you, against Tracer DAO, its members, its service providers,
                        its affiliates, and their respective shareholders, employees, directors, agents, service
                        providers and representatives, suppliers, and contractors related to any of the risks set forth
                        in this Section 10.
                    </Text>
                    <Title>11. INDEMNIFICATION</Title>
                    <Text>
                        You will defend, indemnify, and hold harmless Tracer DAO, its members, its service providers,
                        its affiliates, and their respective shareholders, employees, directors, agents, service
                        providers and representatives, suppliers, and contractors (collectively, {'"'}Indemnified
                        Parties{'"'}) from any claim, demand, lawsuit, action, proceeding, investigation, liability,
                        damage, loss, cost or expense, including without limitation reasonable legal fees, arising out
                        of or relating to (a) your use of, or conduct in connection with, the Site or the Services; (b)
                        Assets associated with your Ethereum address; (c) any feedback or user content you provide to
                        Tracer DAO, if any, concerning the Site or the Services; (d) your violation of these Terms; or
                        (e) your infringement or misappropriation of the rights of any other person or entity. If you
                        are obligated to indemnify any Indemnified Party, Tracer DAO (or, at its discretion, the
                        applicable Indemnified Party) will have the right, in its sole discretion, to control any action
                        or proceeding and to determine whether Tracer DAO wishes to settle, and if so, on what terms,
                        and you agree to corporate with Tracer DAO in the defense.
                    </Text>
                    <Title>12. DISCLOSURES; DISCLAIMERS</Title>
                    <Text>
                        12.1 Tracer DAO develops open-source software. Tracer DAO does not operate an Asset or
                        derivatives exchange platform or offer trade execution or clearing services and, therefore, has
                        no oversight, involvement, or control concerning your transactions using the Services. All
                        transactions between users of Tracer DAO-developed open-source software are executed
                        peer-to-peer directly between the users{"'"} Ethereum addresses through a smart contract. You
                        are responsible for complying with all Applicable Laws that govern your use of the Services,
                        including, but not limited to, the regulations promulgated thereunder by the Australian
                        Securities and Investments Commission ({'"'}ASIC{'"'}), the U.S. Commodity Futures Trading
                        Commission ({'"'}CFTC{'"'}), the federal securities laws and the regulations promulgated
                        thereunder by ASIC, the U.S. Securities and Exchange Commission ({'"'}SEC{'"'}) and all foreign
                        Applicable Laws. For this reason, no US Person may enter into Perpetual Swap Contracts using the
                        Services.
                    </Text>
                    <Text>
                        12.2 You understand that Tracer DAO is not registered or licensed by ASIC, SEC, or any financial
                        regulatory authority. No financial regulatory authority has reviewed or approved the use of the
                        Tracer DAO-developed open-source software. The Site and the Tracer DAO-developed open-source
                        software do not constitute advice or a recommendation concerning any commodity, security, or
                        other Asset or instrument. Tracer DAO is not acting as an investment adviser or commodity
                        trading adviser to any person or entity.
                    </Text>
                    <Text>
                        12.3 Tracer DAO does not own or control the underlying software protocols that are used in
                        connection with Perpetual Swaps Contracts. In general, the underlying protocols are open source
                        and anyone can use, copy, modify, and distribute them. Tracer DAO is not responsible for the
                        operation of the underlying protocols, and Tracer DAO makes no guarantee of their functionality,
                        security, or availability.
                    </Text>
                    <Text>
                        12.4 To the maximum extent permitted under Applicable Law, the Site and the Services (and any of
                        their content or functionality) provided by or on behalf of us are provided on an {'"'}AS IS
                        {'"'} and
                        {'"'}AS AVAILABLE{'"'} basis, and we expressly disclaim, and you hereby waive, any
                        representations, conditions or warranties of any kind, whether express or implied, legal,
                        statutory or otherwise, or arising from statute, otherwise in law, course of dealing, or usage
                        of trade, including, without limitation, the implied or legal warranties and conditions of
                        merchantability, merchantable quality, quality or fitness for a particular purpose, title,
                        security, availability, reliability, accuracy, quiet enjoyment and non-infringement of third
                        party rights. Without limiting the foregoing, we do not represent or warrant that the Site or
                        the Services (including any data relating thereto) will be uninterrupted, available at any
                        particular time, or error-free. Further, we do not warrant that errors in the Site or the
                        Service are correctable or will be correctable.
                    </Text>
                    <Text>
                        12.5 You acknowledge that your data on the Site may become irretrievably lost or corrupted or
                        temporarily unavailable due to a variety of causes, and agree that, to the maximum extent
                        permitted under Applicable Law, we will not be liable for any loss or damage caused by
                        denial-of-service attacks, software failures, viruses or other technologically harmful materials
                        (including those which may infect your computer equipment), protocol changes by third-party
                        providers, Internet outages, force majeure events or other disasters, scheduled or unscheduled
                        maintenance, or other causes either within or outside our control.
                    </Text>
                    <Text>
                        12.6 The disclaimer of implied warranties contained herein may not apply if and to the extent
                        such warranties cannot be excluded or limited under the Applicable Law of the jurisdiction in
                        which you reside.
                    </Text>
                    <Title>13. EXCLUSION OF CONSEQUENTIAL AND RELATED CLAIMS</Title>
                    <Text>
                        In no event shall Tracer DAO, its members, its service providers, its affiliates, and their
                        respective shareholders, employees, directors, agents, service providers and representatives,
                        suppliers, and contractors (collectively, the {'"'}Risk Limited Parties{'"'}) be liable for any
                        incidental, indirect, special, punitive, consequential or similar damages or liabilities
                        whatsoever (including, without limitation, damages for loss of fiat, assets, data, information,
                        revenue, opportunities, use, goodwill, profits or other business or financial benefit) arising
                        out of or in connection with the Site and the Services, any execution or settlement of a
                        transaction, any performance or non-performance of the Services, your Assets, Perpetual Swaps
                        Contracts or any other product, service or other item provided by or on behalf of Tracer DAO,
                        whether under contract, tort (including negligence), civil liability, statute, strict liability,
                        breach of warranties, or under any other theory of liability, and whether or not we have been
                        advised of, knew of or should have known of the possibility of such damages and notwithstanding
                        any failure of the essential purpose of these Terms or any limited remedy hereunder nor is
                        Tracer DAO in any way responsible for the execution or settlement of transactions between users
                        of the Services.
                    </Text>
                    <Title>14. LIMITATION OF LIABILITY</Title>
                    <Text>
                        In no event shall Tracer DAO{"'"}s aggregate liability (together with its members, its service
                        providers, its affiliates, and their respective shareholders, employees, directors, agents,
                        service providers and representatives, suppliers, and contractors) arising out of or in
                        connection with the Site and the Services (and any of their content and functionality), any
                        performance or nonperformance of the Services, your Assets, Perpetual Swaps Contracts or any
                        other product, service or other item provided by or on behalf of Tracer DAO, whether under
                        contract, tort (including negligence), civil liability, statute, strict liability or other
                        theory of liability exceed the amount of fees paid by you to Tracer DAO under these Terms, if
                        any, in the twelve (12) month period immediately preceding the event giving rise to the claim
                        for liability.
                    </Text>
                    <Title>15. DISPUTE RESOLUTION &amp; ARBITRATION</Title>
                    <Text>
                        15.1 Please read the following section carefully because it requires you to arbitrate certain
                        disputes and claims with Tracer DAO and limits how you can seek relief from Tracer DAO. Also,
                        arbitration precludes you from suing in court or having a jury trial.
                    </Text>
                    <Text>
                        15.2 You and Tracer DAO agree that any dispute arising out of or related to these Terms or the
                        Services is personal to you and Tracer DAO and that any dispute will be resolved solely through
                        individual action, and will not be brought as a class arbitration, class action, or any other
                        type of representative proceeding.
                    </Text>
                    <Text>
                        15.3 You and Tracer DAO waive your rights to a jury trial and to have any dispute arising out of
                        or related to these Terms or the Services resolved in court. Instead, for any dispute or claim
                        that you have against Tracer DAO (together with its members, its service providers, its
                        affiliates, and their respective shareholders, employees, directors, agents, service providers
                        and representatives, suppliers, and contractors) or relating in any way to the Services, you
                        agree to first contact Tracer DAO and attempt to resolve the claim informally by sending a
                        written notice of your claim ({'"'}Notice{'"'}) to Tracer DAO by email at hello@tracer.finance.
                        The Notice must (a) include your name, residence address, email address, and telephone number;
                        (b) describe the nature and basis of the claim; and (c) set forth the specific relief sought.
                        Our notice to you will be similar in form to that described above. If you and Tracer DAO cannot
                        reach an agreement to resolve the claim within thirty (30) days after such Notice is received,
                        then either party may submit the dispute to binding arbitration.
                    </Text>
                    <Text>
                        15.4 The arbitrator, Tracer DAO, and you will maintain the confidentiality of any arbitration
                        proceedings, judgments and awards, including, but not limited to, all information gathered,
                        prepared, and presented for purposes of the arbitration or related to the dispute(s) therein.
                        The arbitrator will have the authority to make appropriate rulings to safeguard confidentiality
                        unless the law provides to the contrary. The duty of confidentiality does not apply to the
                        extent that disclosure is necessary to prepare for or conduct the arbitration hearing on the
                        merits, in connection with a court application for a preliminary remedy or in connection with a
                        judicial challenge to an arbitration award or its enforcement, or to the extent that disclosure
                        is otherwise required by law or judicial decision.
                    </Text>
                    <Text>
                        15.5 You and Tracer DAO agree that for any arbitration you initiate, you will pay the filing fee
                        and all other costs. For any arbitration initiated by Tracer DAO, Tracer DAO will pay all fees
                        and costs.
                    </Text>
                    <Text>
                        15.6 Any claim arising out of or related to these Terms or the Services must be filed within one
                        year after such claim arose; otherwise, the claim is permanently barred, which means that you
                        and Tracer DAO will not have the right to assert the claim.
                    </Text>
                    <Text>
                        15.7 If any portion of this Section 15 is found to be unenforceable or unlawful for any reason,
                        (a) the unenforceable or unlawful provision shall be severed from these Terms; (b) severance of
                        the unenforceable or unlawful provision shall have no impact whatsoever on the remainder of this
                        Section 15 or the parties{"'"} ability to compel arbitration of any remaining claims on an
                        individual basis under this Section 15; and (c) to the extent that any claims must therefore
                        proceed on a class, collective, consolidated, or representative basis, such claims must be
                        litigated in a civil court of competent jurisdiction and not in arbitration, and the parties
                        agree that litigation of those claims shall be stayed pending the outcome of any individual
                        claims in arbitration. Further, if any part of this Section 15 is found to prohibit an
                        individual claim seeking public injunctive relief, then that provision will have no effect to
                        the extent such relief is allowed to be sought out of arbitration, and the remainder of this
                        Section 15 will be enforceable.
                    </Text>
                    <Title>16. GENERAL INFORMATION</Title>
                    <Text>
                        16.1 Please refer to our privacy policy, which is incorporated herein by reference and available{' '}
                        <Link href="/privacy-policy/">here</Link>, for information about how we collect, use, share and
                        otherwise process information about you.
                    </Text>
                    <Text>
                        16.2 You consent to receive all communications, agreements, documents, receipts, notices, and
                        disclosures electronically (collectively, our {'"'}Communications{'"'}) that we provide in
                        connection with these Terms or any Services. You agree that we may provide our Communications to
                        you by posting them on the Site or by emailing them to you at the email address you provide in
                        connection with using the Services, if any. You should maintain copies of our Communications by
                        printing a paper copy or saving an electronic copy. You may also contact us with questions,
                        complaints, or claims concerning the Services at{' '}
                        <Link href="mailto:hello@tracer.finance">hello@tracer.finance</Link>.
                    </Text>
                    <Text>
                        16.3 Any right or remedy of Tracer DAO set forth in these Terms is in addition to, and not in
                        lieu of, any other right or remedy whether described in these Terms, under Applicable Law, at
                        law, or in equity. The failure or delay of Tracer DAO in exercising any right, power, or
                        privilege under these Terms shall not operate as a waiver thereof.
                    </Text>
                    <Text>
                        16.4 The invalidity or unenforceability of any of these Terms shall not affect the validity or
                        enforceability of any other of these Terms, all of which shall remain in full force and effect.
                    </Text>
                    <Text>
                        16.5 We will have no responsibility or liability for any failure or delay in performance of the
                        Site or any of the Services, or any loss or damage that you may incur, due to any circumstance
                        or event beyond our control, including without limitation any flood, extraordinary weather
                        conditions, earthquake, fire, war, insurrection, riot, labor dispute, accident, action of
                        government, communications, power failure, or equipment or software malfunction.
                    </Text>
                    <Text>
                        16.6 You may not assign or transfer any right to use the Site or the Services, or any of your
                        rights or obligations under these Terms, without our express prior written consent, including by
                        operation of law or in connection with any change of control. We may assign or transfer any or
                        all of our rights or obligations under these Terms, in whole or in part, without notice or
                        obtaining your consent or approval.
                    </Text>
                    <Text>
                        16.7 Headings of sections are for convenience only and shall not be used to limit or construe
                        such sections.
                    </Text>
                    <Text>
                        16.8 These Terms contain the entire agreement between you and Tracer DAO, and supersede all
                        prior and contemporaneous understandings between the parties regarding the Site and the
                        Services.
                    </Text>
                    <Text>
                        16.9 In the event of any conflict between these Terms and any other agreement you may have with
                        us, these Terms will control unless the other agreement specifically identifies these Terms and
                        declares that the other agreement supersedes these Terms.
                    </Text>
                    <Text>
                        16.10 You agree that, except as otherwise expressly provided in this Agreement, there shall be
                        no third-party beneficiaries to the Agreement other than the Indemnified Parties.
                    </Text>
                </BodyText>
            </GeneralContainer>
            <Footer />
        </div>
    );
})`
    min-height: 100vh;
    background-color: var(--color-background);
    color: var(--color-text);
`;

export default Terms;
