import { Entity, Schema } from "redis-om";

class FileItem extends Entity {
  addAllowedAddress(address: string) {
    // @ts-ignore
    this.allowedAddresses.push(address);
  }
  removeAllowedAddress(address: string) {
    // @ts-ignore
    this.allowedAddresses = this.allowedAddresses.filter(
      (allowedAddress: string) => allowedAddress !== address
    );
  }
}

const fileSchema = new Schema(
  FileItem,
  {
    displayName: {
      type: "string",
    },
    ownerAddress: {
      type: "string",
    },
    allowedAddresses: {
      type: "string[]",
    },
    size: {
      type: "number",
    },
    type: {
      type: "string",
    },
    currentBloc: {
      type: "string",
    },
    fileCid: {
      type: "string",
    },
    storageProviders: {
      type: "string[]",
    },
    estuaryId: {
      type: "number",
    },
    estuaryRetrievalUrl: {
      type: "string",
    },
    retrievalUrl: {
      type: "string",
    },
    created: {
      type: "number",
    },
    updated: {
      type: "number",
    },
    encryptedKey: {
      type: "string",
    },
    iv: {
      type: "string",
    },
  },
  {
    prefix: "vetra:files",
  }
);

export default fileSchema;
