import React, { useEffect, useState } from 'react';
import Button from '~/components/General/Button';
import Divider from '~/components/General/Divider';
import { TWModal } from '~/components/General/TWModal';
import * as Styled from './styles';

const key = 'hasSeenGeoblockModal';

const GeoblockModal: React.FC = () => {
    const [hasSeen, setHasSeen] = useState(true);

    useEffect(() => {
        const _hasSeen = localStorage.getItem(key);
        setHasSeen(_hasSeen === 'true');
    }, []);

    const modalSeen = (confirmed: boolean) => {
        if (confirmed) {
            localStorage.setItem(key, 'true');
        }
        setHasSeen(true);
    };

    const GeoblockContent = () => {
        return (
            <>
                <div className="my-5 text-center text-2xl">Upcoming Changes</div>
                <Divider className="mb-8" />
                <div className="mb-8">
                    <strong>
                        Notice to Australian users of Perpetual Swaps, Perpetual Pools, MYC Staking, and the TCR to MYC
                        Token Migration portals.
                    </strong>
                    <br />
                    <br />
                    Please note that from 11:59 pm AEST on 16 December 2022, Australian users will be geo-blocked from
                    accessing these subdomains. It is recommended that Australian users close out any involvement they
                    have with these four products before this time.
                </div>
                <div className="dark:bg-theme-button-gradient-bg flex flex-col-reverse sm:flex-row">
                    <Button className="gradient-button" variant="primary-light" onClick={() => modalSeen(true)}>
                        I understand
                    </Button>
                </div>
            </>
        );
    };

    return (
        <TWModal open={!hasSeen} onClose={() => modalSeen(false)}>
            <Styled.Close onClick={() => modalSeen(false)} />
            <Styled.GeoblockContent className="onboard">{GeoblockContent()}</Styled.GeoblockContent>
        </TWModal>
    );
};

export default GeoblockModal;
