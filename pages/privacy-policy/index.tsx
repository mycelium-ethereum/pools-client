import React from 'react';
import NavBar from '@components/Nav';
import styled from 'styled-components';
import Footer from '@components/Footer';
import Link from 'next/link';
import { GeneralContainer, BodyText, MainTitle, Title, Text, List, ListItem } from '@components/Legal';

const PrivacyPolicy: React.FC = styled(({ className }) => {
    return (
        <div className={className}>
            <NavBar />
            <GeneralContainer className={'container'}>
                <MainTitle>Privacy Policy</MainTitle>
                <BodyText>
                    <Text>
                        In this Privacy Policy, {"'"}us{"'"} {"'"}we{"'"} or {"'"}our{"'"} means Tracer DAO. We are
                        committed to respecting your privacy. Our Privacy Policy sets out how we collect, use, store and
                        disclose your personal information.
                    </Text>
                    <Text>
                        This Privacy Policy applies to our services, which include the services we provide on{' '}
                        <Link href="https://tracer.finance/">https://tracer.finance/</Link> or any other websites,
                        pages, features, or content we own or operate or when you use related services. If you do not
                        agree with the terms of this Privacy Policy, do not access or use the services, websites, or any
                        other aspect of our business.
                    </Text>
                    <Text>
                        By providing personal information to us, you consent to our collection, use and disclosure of
                        your personal information in accordance with this Privacy Policy and any other arrangements that
                        apply between us. We may change our Privacy Policy from time to time by publishing changes to it
                        on our website. We encourage you to check our website periodically to ensure that you are aware
                        of our current Privacy Policy.
                    </Text>
                    <Text>
                        Personal information includes information or an opinion about an individual that is reasonably
                        identifiable.
                    </Text>
                    <Title>What personal information do we collect?</Title>
                    <Text>We may collect the following types of personal information:</Text>
                    <List>
                        <ListItem>contact information, such as your email address;</ListItem>
                        <ListItem>
                            transactional information, such as information about the transactions you make on our
                            services, such as the type, time or amount of a transaction;
                        </ListItem>
                        <ListItem>
                            correspondence, such as your feedback or questionnaire and other survey responses;{' '}
                        </ListItem>
                        <ListItem>
                            online identifiers, such as your blockchain address, device ID, device type, geo-location
                            information, computer and connection information, statistics on page views, traffic to and
                            from the sites, ad data, IP address and standard web log information;
                        </ListItem>
                        <ListItem>usage data, such as user preferences and other data collected;</ListItem>
                        <ListItem>
                            details of the products and services we have provided to you or that you have enquired
                            about, including any additional information necessary to deliver those products and services
                            and respond to your enquiries;
                        </ListItem>
                        <ListItem>
                            any additional information relating to you that you provide to us directly through our
                            website or app or indirectly through your use of our website or app or online presence or
                            through other websites or accounts from which you permit us to collect information; or
                        </ListItem>
                        <ListItem>
                            any other personal information that may be required in order to facilitate your dealings
                            with us.
                        </ListItem>
                    </List>
                    <Title>How do we collect personal information?</Title>
                    <Text>
                        We may collect these types of personal information either directly from you, or from third
                        parties. We may collect this information when you:
                    </Text>
                    <List>
                        <ListItem>register on our website or app;</ListItem>
                        <ListItem>
                            communicate with us through correspondence, chats, email, or when you share information with
                            us from other social applications, services or websites; or
                        </ListItem>
                        <ListItem>interact with our sites, services, content and advertising.</ListItem>
                        <ListItem>Why do we collect, use and disclose personal information?</ListItem>
                        <ListItem>
                            We may collect, hold, use and disclose your personal information for the following purposes:
                        </ListItem>
                        <ListItem>to enable you to access and use our website, services and app;</ListItem>
                        <ListItem>
                            to operate, protect, improve and optimise our website, services and app, business and our
                            users{"'"} experience, such as to perform analytics, conduct research and for advertising
                            and marketing;{' '}
                        </ListItem>
                        <ListItem>
                            to send you service, support and administrative messages, reminders, technical notices,
                            updates, security alerts, and information requested by you;
                        </ListItem>
                        <ListItem>
                            to send you marketing and promotional messages and other information that may be of interest
                            to you, including information sent by, or on behalf of, our business partners that we think
                            you may find interesting;
                        </ListItem>
                        <ListItem>
                            to administer rewards, surveys, contests, or other promotional activities or events
                            sponsored or managed by us or our business partners;
                        </ListItem>
                        <ListItem>
                            to comply with our legal obligations, resolve any disputes that we may have with any of our
                            users, and enforce our agreements with third parties; and
                        </ListItem>
                        <ListItem>to consider your employment application.</ListItem>
                    </List>
                    <Text>
                        We may also disclose your personal information to a trusted third party who also holds other
                        information about you. This third party may combine that information in order to enable it and
                        us to develop anonymised consumer insights so that we can better understand your preferences and
                        interests, personalise your experience and enhance the products and services that you receive.
                    </Text>
                    <Title>Do we use your personal information for direct marketing?</Title>
                    <Text>
                        We and/or our carefully selected business partners may send you direct marketing communications
                        and information about our service and products. This may take the form of emails, Discord
                        messages, or other forms of communication, in accordance with the OECD Guidelines on the
                        Protection of Privacy and Transborder Flows of Personal Data. You may opt-out of receiving
                        marketing materials from us by contacting us using the details set out below or by using the
                        opt-out facilities provided (e.g. an unsubscribe link).
                    </Text>
                    <Title>To whom do we disclose your personal information?</Title>
                    <Text>
                        We may disclose personal information for the purposes described in this privacy policy to:
                    </Text>
                    <List>
                        <ListItem>
                            third party suppliers and service providers (including providers for the operation of our
                            websites and/or our business or in connection with providing our products and services to
                            you);
                        </ListItem>
                        <ListItem>our existing or potential agents, business partners or partners;</ListItem>
                        <ListItem>
                            our sponsors or promoters of any competition that we conduct via our services;
                        </ListItem>
                        <ListItem>
                            anyone to whom our assets or businesses (or any part of them) are transferred;
                        </ListItem>
                        <ListItem>
                            specific third parties authorised by you to receive information held by us; and/or
                        </ListItem>
                        <ListItem>
                            other persons, including government agencies, regulatory bodies and law enforcement
                            agencies, or as required, authorised or permitted by law.
                        </ListItem>
                    </List>
                    <Title>Disclosure of personal information</Title>
                    <Text>
                        When you provide your personal information to us, you consent to the disclosure of your
                        information globally. We will, however, take reasonable steps to ensure that any overseas
                        recipient will deal with such personal information in a way that is consistent with the OECD
                        Guidelines on the Protection of Privacy and Transborder Flows of Personal Data.
                    </Text>
                    <Title>Using our website</Title>
                    <Text>We may collect personal information about you when you use and access our website.</Text>
                    <Text>
                        While we do not use browsing information to identify you personally, we may record certain
                        information about your use of our website, such as which pages you visit, the time and date of
                        your visit and the internet protocol address assigned to your computer.
                    </Text>
                    <Title>Security</Title>
                    <Text>
                        We may hold your personal information in either electronic or hard copy form. We take reasonable
                        steps to protect your personal information from misuse, interference and loss, as well as
                        unauthorised access, modification or disclosure and we use a number of physical, administrative,
                        personnel and technical measures to protect your personal information. However, we cannot
                        guarantee the security of your personal information.
                    </Text>
                    <Title>Integrated third party services</Title>
                    <Text>
                        Various third party services are integrated with our website, including MetaMask. Unless
                        expressly stated otherwise, we are not responsible for the privacy practices of integrated third
                        party services, and have no control over or rights in those linked services. The privacy
                        policies that apply to integrated third party services may differ substantially from our Privacy
                        Policy, so we encourage individuals to read them before using those services.
                    </Text>
                    <Title>Links</Title>
                    <Text>
                        Our website may contain links to websites operated by third parties. Those links are provided
                        for convenience and may not remain current or be maintained. Unless expressly stated otherwise,
                        we are not responsible for the privacy practices of, or any content on, those linked websites,
                        and have no control over or rights in those linked websites. The privacy policies that apply to
                        those other websites may differ substantially from our Privacy Policy, so we encourage
                        individuals to read them before using those websites.
                    </Text>
                    <Title>Accessing or correcting your personal information</Title>
                    <Text>
                        You can access the personal information we hold about you by contacting us at
                        hello@tracer.finance. Sometimes, we may not be able to provide you with access to all of your
                        personal information and, where this is the case, we will tell you why. We may also need to
                        verify your identity when you request your personal information.
                    </Text>
                    <Text>
                        If you think that any personal information we hold about you is inaccurate, please contact us
                        and we will take reasonable steps to ensure that it is corrected.
                    </Text>
                    <Title>Making a complaint</Title>
                    <Text>
                        If you think we have breached the OECD Guidelines on the Protection of Privacy and Transborder
                        Flows of Personal Data, or you wish to make a complaint about the way we have handled your
                        personal information, you can contact us at hello@tracer.finance. Please include your name or
                        Discord username and clearly describe your complaint. We will acknowledge your complaint and
                        respond to you regarding your complaint within a reasonable period of time. If you think that we
                        have failed to resolve the complaint satisfactorily, we will provide you with information about
                        the further steps you can take.
                    </Text>
                    <Title>Contact Us</Title>
                    <Text>
                        For further information about our Privacy Policy or practices, or to access or correct your
                        personal information, or make a complaint, please contact us at{' '}
                        <Link href="mailto:hello@tracer.finance">hello@tracer.finance</Link>.
                    </Text>
                    <Title>Effective</Title>
                    <Text>23 April, 2021</Text>
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

export default PrivacyPolicy;
