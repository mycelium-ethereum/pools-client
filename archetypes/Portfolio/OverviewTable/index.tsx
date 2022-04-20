import React from 'react';
import * as Styles from './styles';

type Props = {
    title: string;
    subTitle?: string;
    firstActionTitle: string;
    firstAction: any;
    secondActionTitle?: any;
    secondAction: any;
    children: any;
};

export const OverviewTable: React.FC<Props> = ({
    title,
    subTitle,
    firstActionTitle,
    firstAction,
    secondActionTitle,
    secondAction,
    children,
}) => (
    <Styles.Container>
        <Styles.Wrapper>
            <div>
                <Styles.Title>{title}</Styles.Title>
                <Styles.SubTitle>{subTitle}</Styles.SubTitle>
            </div>
            <Styles.Content>
                <Styles.Actions>
                    <Styles.Text>{firstActionTitle}</Styles.Text>
                    {firstAction}
                </Styles.Actions>
                <Styles.Actions>
                    {secondActionTitle && <Styles.Text>{secondActionTitle}</Styles.Text>}
                    {secondAction}
                </Styles.Actions>
            </Styles.Content>
        </Styles.Wrapper>
        {children}
    </Styles.Container>
);
