import { KnownNetwork, NETWORKS } from '@tracer-protocol/pools-js';
import { POOL_LIST_MAP } from '@constants/pools';
import { PoolList, PoolLists, PoolListUris } from '~/types/pools';

export default class PoolListService {
    network: KnownNetwork;

    constructor(network: string) {
        if (!Object.values(NETWORKS).includes(network as KnownNetwork)) {
            this.network = NETWORKS.ARBITRUM;
        } else {
            this.network = network.toString() as KnownNetwork;
        }
    }

    /**
     * Return all token list URIs for the app network in
     * a structured object.
     */
    public get uris(): PoolListUris {
        const uris = POOL_LIST_MAP[this.network];
        if (!uris) {
            return {
                All: [],
                Tracer: [],
                External: [],
            };
        }
        const { Tracer, External } = uris;

        const tracerLists = [Tracer.verified];
        if (Tracer.factoryDeployed) {
            tracerLists.push(Tracer.factoryDeployed);
        }
        const All = [...tracerLists, ...External];

        return {
            All,
            Tracer: tracerLists,
            External,
        };
    }

    /**
     * Fetch all pool list json and return mapped to URI
     */
    public async getAll(uris: PoolListUris = this.uris): Promise<PoolLists> {
        const tracerLists: PoolList[] = await Promise.all(uris.Tracer.map((uri) => this.get(uri).catch((e) => e)));
        const externalLists: PoolList[] = await Promise.all(uris.External.map((uri) => this.get(uri).catch((e) => e)));

        const validTracerLists = tracerLists.filter((list) => !(list instanceof Error) || !list);
        const validExternalLists = externalLists.filter((list) => !(list instanceof Error) || !list);

        const allLists = [...validTracerLists, ...validExternalLists];

        if (Object.keys(allLists).length === 0) {
            throw new Error('Failed to load any PoolLists');
        }
        return {
            All: allLists,
            Tracer: validTracerLists,
            External: validExternalLists,
        };
    }

    async get(uri: string): Promise<PoolList | undefined> {
        try {
            const [protocol] = uri.split('://');

            if (protocol === 'https') {
                const data = await fetch(uri).then((res) => res.json());
                return data;
            } else {
                console.error('Unhandled PoolList protocol', uri);
                throw new Error('Unhandled PoolList protocol');
            }
        } catch (error) {
            console.error('Failed to load PoolList', uri, error);
            throw error;
        }
    }
}
