export interface IBlocFile {
    displayName: string;
    ownerAddress: string;
    allowedAddresses: string[];
    size: number;
    type: string;
    currentBloc: string;
    fileCid: string;
    storageProviders: string[];
    estuaryId: number;
    estuaryRetrievalUrl: string;
    retrievalUrl: string;
    created: number,
    updated: number
}