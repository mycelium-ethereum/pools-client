import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '~/components/General/Loading';
import DropdownArrowImage from '~/public/img/general/caret-down-white.svg';
import * as Styles from './styles';
import { OverviewPageFocus } from '../state';

type Props = {
    title: string;
    subTitle?: string;
    pageFocus?: OverviewPageFocus;
    firstActionTitle: string;
    firstAction: any;
    secondActionTitle?: any;
    secondAction: any;
    children: any;
    isLoading: boolean;
    rowCount?: number;
};

export const OverviewTable: React.FC<Props> = ({
    title,
    subTitle,
    pageFocus,
    firstActionTitle,
    firstAction,
    secondActionTitle,
    secondAction,
    rowCount,
    children,
    isLoading,
}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(!!pageFocus && router.query.focus === pageFocus);
    }, [router.query]);

    return (
        <Styles.Container>
            <Styles.Wrapper>
                <Styles.Behind onClick={() => setOpen(!open)} />
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
                    <Styles.IconContainer>
                        {isLoading ? (
                            <Loading />
                        ) : (
                            <Styles.DropdownArrow open={open} onClick={() => setOpen(!open)}>
                                <DropdownArrowImage />
                            </Styles.DropdownArrow>
                        )}
                    </Styles.IconContainer>
                </Styles.Content>
            </Styles.Wrapper>
            <Styles.HiddenExpand open={open} defaultHeight={0}>
                {children}
            </Styles.HiddenExpand>
        </Styles.Container>
    );
};
