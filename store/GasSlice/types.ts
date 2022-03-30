export interface IGasSlice {
    gasPrice: number;
    fetchingGasPrice: boolean;
    getGasPrice: () => void;
}
