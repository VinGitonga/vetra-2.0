import { Entity, Schema } from "redis-om";

class FileItem extends Entity {}

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
    updated : {
      type: "number",
    },
    encryptedKey: {
      type: "string",
    },
    iv: {
      type: "string",
    }
  },
  {
    prefix: "vetra:files",
  }
);

export default fileSchema;
