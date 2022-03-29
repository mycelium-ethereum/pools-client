export type Imported = {
    address: string;
};

export interface IPoolsSlice {
    imported: Imported[];
    handleImport: ((props: Imported) => void) | undefined;
}
