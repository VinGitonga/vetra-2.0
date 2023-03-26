import { ISecret } from "@/types/Secret";
import secretKey from "secret-key";
import CryptoJS from "crypto-js";


// encode nounce with owner wallet address using CryptoJS
export const encodeNounce = async (nounce: string, owner: string) => {
  let salt = CryptoJS.lib.WordArray.random(128 / 8);

  const key = CryptoJS.PBKDF2(owner, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });

  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const encrypted = CryptoJS.AES.encrypt(nounce, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  const transitmessage = `${salt.toString()}:${iv.toString()}:${encrypted.toString()}`;

  return transitmessage;
};

export const decodeNounce = async (transitmessage: string, owner: string) => {
  const t = transitmessage.split(":");
  const salt = CryptoJS.enc.Hex.parse(t[0]);
  const iv = CryptoJS.enc.Hex.parse(t[1]);
  const encrypted = t[2];

  const key = CryptoJS.PBKDF2(owner, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};


export const generateSecret = async (owner: string) => {
  const secretOptions = secretKey.create(owner) as ISecret;
  console.log(secretOptions);
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
  const bytes = CryptoJS.AES.decrypt(encryptedSecret, encryptedNounce);


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
