import { KnownNetwork, StaticPoolInfo } from '@tracer-protocol/pools-js';
import { POOL_LIST_MAP } from '~/constants/pools';
import { PoolList, PoolLists, PoolListUris } from '~/types/poolLists';

export const flattenAllPoolLists = (poolLists: PoolLists | undefined): StaticPoolInfo[] =>
    poolLists
        ? poolLists.All.map((pool) => pool.pools)
              .flat(1)
              .concat(poolLists.Imported.pools)
        : [];

/**
 * Return all token list URIs for the app network in
 * a structured object.
 */
const uris = (network: KnownNetwork): PoolListUris => {
    const uris = POOL_LIST_MAP[network];
    if (!uris) {
        return {
            All: [],
            External: [],
            Tracer: '',
            TracerUnverified: '',
        };
    }
    const { Tracer, External } = uris;

    const tracerList = Tracer.verified;
    const tracerUnverifiedList = Tracer.unverified;
    const All = [tracerList, ...External];

    return {
        All,
        External,
        Tracer: tracerList,
        TracerUnverified: tracerUnverifiedList,
    };
};

const get = async (uri: string): Promise<PoolList | undefined> => {
    try {
        const [protocol] = uri.split('://');
        console.log('Fetching pools from', uri);
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
};

const isPoolList = (list: any): list is PoolList => {
    return (
        list &&
        list.name &&
        typeof list.name === 'string' &&
        list.pools &&
        typeof list.pools === 'object' &&
        Array.isArray(list.pools) &&
        // will block if any pool in the array of pools does not conform to staticPoolInfo
        !list.pools.map((pool: any) => isStaticPoolInfo(pool)).includes(false)
    );
};

const isStaticPoolInfo = (pool: any): pool is StaticPoolInfo => {
    return pool && pool.address && typeof pool.address === 'string';
};

/**
 * Fetch all pool list json and return mapped to URI
 */
export const getAllPoolLists = async (network: KnownNetwork): Promise<PoolLists> => {
    const uris_ = uris(network);
    const tracerList: PoolList = await get(uris_.Tracer).catch((e) => e);
    const tracerUnverifiedList: PoolList = await get(uris_.TracerUnverified).catch((e) => e);
    const externalLists: PoolList[] = await Promise.all(uris_.External.map((uri) => get(uri).catch((e) => e)));

    const validTracerList: PoolList =
        (!(tracerList instanceof Error) || !tracerList) && isPoolList(tracerList)
            ? tracerList
            : {
                  name: 'Tracer',
                  pools: [],
              };

    const validTracerUnverifiedList: PoolList =
        (!(tracerUnverifiedList instanceof Error) || !tracerUnverifiedList) && isPoolList(tracerUnverifiedList)
            ? tracerUnverifiedList
            : {
                  name: 'TracerUnverified',
                  pools: [],
              };

    const validExternalLists = externalLists.filter((list) => (!(list instanceof Error) || !list) && isPoolList(list));
    const importedList = {
        name: 'Imported',
        pools: [],
    };

    const allLists = [validTracerList, importedList, ...validExternalLists];

    if (Object.keys(allLists).length === 0) {
        throw new Error('Failed to load any PoolLists');
    }
    return {
        All: allLists,
        External: validExternalLists,
        Tracer: validTracerList,
        TracerUnverified: validTracerUnverifiedList,
        Imported: importedList,
    };
};
