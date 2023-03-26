import { ISecret } from "@/types/Secret";
import * as crypto from "crypto";
import secretKey from "secret-key";
import CryptoJS from "crypto-js";

export const encodeNounce = async (nounce: string, owner: string) => {
  const msg = Buffer.from(nounce);
  const key = Buffer.from(owner);

  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  const encrypted = Buffer.concat([cipher.update(msg), cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

// decode nounce using owner address encrypted text
export const decodeNounce = async (encrypted: string, owner: string) => {
  const textParts = encrypted.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(owner),
    iv
  );
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString();
};

export const generateSecret = async (owner: string) => {
  const secretOptions = secretKey.create(owner) as ISecret;
  const rawSecret = secretOptions.secret;
  const rawNounce = secretOptions.iv;
  const timestamp = secretOptions.timestamp;

  // generate encrypted nounce
  const encryptedNounce = await encodeNounce(rawNounce, owner);

  // generate encrypted secret using crypto js
  const encryptedSecret = CryptoJS.AES.encrypt(
    rawSecret,
    encryptedNounce
  ).toString();

  return {
    encryptedSecret,
    encryptedNounce,
    timestamp,
  };
};

export const decryptSecret = async (
  encryptedSecret: string,
  encryptedNounce: string,
  owner: string
) => {
  // decrypt nounce
  const decryptedNounce = await decodeNounce(encryptedNounce, owner);

  // decrypt secret
  const bytes = CryptoJS.AES.decrypt(encryptedSecret, decryptedNounce);

  const decryptedSecret = bytes.toString(CryptoJS.enc.Utf8);

  return decryptedSecret;
};

export const encryptBlobSecretKey = async (
  userSecret: string,
  blobSecret: string
) => {
  const encryptedBlobKey = CryptoJS.AES.encrypt(
    blobSecret,
    userSecret
  ).toString();

  return encryptedBlobKey;
};

export const decryptBlobSecretKey = async (
  userSecret: string,
  encryptedBlobKey: string
) => {
  const bytes = CryptoJS.AES.decrypt(encryptedBlobKey, userSecret);

  const blobSecret = bytes.toString(CryptoJS.enc.Utf8);

  return blobSecret;
};
