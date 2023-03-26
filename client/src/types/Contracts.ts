export enum ContractID {
    Vetra = "Vetra",
}
export interface IRequest {
    message: string;
    addressedTo: string;
    sentBy: string;
    sentAt: number;
    requestId: string;
}


