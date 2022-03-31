import { KnownNetwork } from '@tracer-protocol/pools-js';
import { LogoTicker } from '@components/General';
import { UNKNOWN_NETWORK } from '~/constants/networks';

export type UnknownNetwork = typeof UNKNOWN_NETWORK;

export type Network = {
    id: KnownNetwork;
    name: string;
    logoTicker: LogoTicker;
    previewUrl: string;
    hex: string;

    usdcAddress: string;
    tcrAddress: string;

    publicRPC: string;
    publicWebsocketRPC?: string;
};
