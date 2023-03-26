export interface ISecret {
  secret: string;
  iv: string;
  timestamp: number;
}

export interface IVaultItem {
  owner: string;
  encryptedSecret: string;
  created: number;
  entityId?: string;
}