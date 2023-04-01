export enum ContractID {
  Vetra = "Vetra",
}
export interface IRequest {
  msg: string;
  addressedTo: string;
  sentBy: string;
  sentAt: number;
  requestId: number;
}

export interface IReply {
  msg: string;
  requestId: number;
  sentBy: string;
  sentAt: number;
  replyId: number;
}

export interface IShare {
  entityId: string;
  fileName: string;
  ipfsCid: string;
  sharedBy: string;
  sharedAt: number;
  sharedTo: string;
  fileKey: string;
  shareId: string;
}
