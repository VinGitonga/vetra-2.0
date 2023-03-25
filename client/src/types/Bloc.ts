export interface IBloc {
    displayName: string;
    ownerAddress: string;
    allowedAddresses: string[];
    created: Date,
    updated: Date,
    entityId?: string
}