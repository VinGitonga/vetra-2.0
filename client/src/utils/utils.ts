import prettyBytes from "pretty-bytes";
import { customAlphabet } from "nanoid";

export const getDateAdded = (addedAt: string) =>
  new Date(addedAt).toLocaleString();

export const getSlicedAddress = (address: string) =>
  `${address.slice(0, 6)}.....${address.slice(-6)}`;

export const getFileSize = (fileSize: number) => prettyBytes(fileSize);

export const getFileExtension = (filename: string) =>
  filename.split(".").pop()?.toUpperCase();

export async function encryptBlob(blob: Blob) {
  let iv = crypto.getRandomValues(new Uint32Array(12));

  let algo = {
    name: "AES-GCM",
    iv: iv,
  };

  let key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  let data = await blob.arrayBuffer();

  const result = await crypto.subtle.encrypt(algo, key, data);

  let exportedkey = await crypto.subtle.exportKey("jwk", key);

  let returnVals = {
    blob: new Blob([result]),
    iv: iv.toString(),
    exportedkey: exportedkey,
  };

  return returnVals;
}

export async function decryptBlob(
  blob: Blob,
  ivData: string,
  exportedkey: JsonWebKey
) {
  let key = await crypto.subtle.importKey(
    "jwk",
    exportedkey,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );

  // convert ivData to Uint32Array
  let iv = new Uint32Array(ivData.split(",").map((i) => parseInt(i)));

  let algo = {
    name: "AES-GCM",
    iv: iv,
  };

  let data = await blob.arrayBuffer();

  const result = await crypto.subtle.decrypt(algo, key, data);

  return new Blob([result]);
}

export const generateRandomNumbers = (length: number = 6) => {
  const nanoid = customAlphabet("1234567890", length);

  return nanoid();
};

export const generateRandomString = (length: number = 6) => {
  const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", length);

  return nanoid();
};
