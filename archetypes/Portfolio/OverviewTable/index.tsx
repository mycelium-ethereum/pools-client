import React, { useState } from 'react';
import DropdownArrowImage from '~/public/img/general/caret-down-white.svg';
import * as Styles from './styles';

type Props = {
    title: string;
    subTitle?: string;
    firstActionTitle: string;
    firstAction: any;
    secondActionTitle?: any;
    secondAction: any;
    rowCount?: number;
    children: any;
};

export const OverviewTable: React.FC<Props> = ({
    title,
    subTitle,
    firstActionTitle,
    firstAction,
    secondActionTitle,
    secondAction,
    rowCount,
    children,
}) => {
    const [open, setOpen] = useState(false);
    return (
        <Styles.Container>
            <Styles.Wrapper>
                <Styles.TitleContent>
                    {!!rowCount && <Styles.RowCount>{rowCount}</Styles.RowCount>}
                    <div>
                        <Styles.Title>{title}</Styles.Title>
                        <Styles.SubTitle>{subTitle}</Styles.SubTitle>
                    </div>
                </Styles.TitleContent>
                <Styles.Content>
                    <Styles.Actions>
                        <Styles.Text>{firstActionTitle}</Styles.Text>
                        {firstAction}
                    </Styles.Actions>
                    <Styles.Actions>
                        {secondActionTitle && <Styles.Text>{secondActionTitle}</Styles.Text>}
                        {secondAction}
                    </Styles.Actions>
                    <Styles.DropdownArrow open={open} onClick={() => setOpen(!open)}>
                        <DropdownArrowImage />
                    </Styles.DropdownArrow>
                </Styles.Content>
            </Styles.Wrapper>
            <Styles.HiddenExpand open={open} defaultHeight={0}>
                {children}
            </Styles.HiddenExpand>
        </Styles.Container>
    );
};
