export enum ContractID {
    Vetra = "Vetra",
}
export interface IRequest {
    msg: string;
    addressedTo: string;
    sentBy: string;
    sentAt: number;
    requestId: string;
}


