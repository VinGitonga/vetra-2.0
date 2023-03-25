import { Schema, Entity } from "redis-om";

class Bloc extends Entity {}

const blocSchema = new Schema(Bloc, {
  displayName: {
    type: "string",
  },
  ownerAddress: {
    type: "string",
  },
  allowedAddresses: {
    type: "string[]",
  },
  created: {
    type: "date",
  },
  updated: {
    type: "date",
  }
}, {
  prefix:"vetra:blocs"
});

export default blocSchema;