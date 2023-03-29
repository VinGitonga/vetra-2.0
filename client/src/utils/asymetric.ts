import { randomBytes, box } from "tweetnacl";
import {
  decodeUTF8,
  encodeBase64,
  decodeBase64,
  encodeUTF8,
} from "tweetnacl-util";

export const generateKeyPair = () => {
  const keyPair = box.keyPair();
  return {
    publicKey: encodeBase64(keyPair.publicKey),
    secretKey: encodeBase64(keyPair.secretKey),
  };
};

export const encrypt = (message: string, publicKey: string) => {
  const nonce = randomBytes(box.nonceLength);
  const messageUint8 = decodeUTF8(message);
  const publicKeyUint8 = decodeBase64(publicKey);
  const encrypted = box(messageUint8, nonce, publicKeyUint8, null);
  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);
  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
};

export const decrypt = (messageWithNonce: string, secretKey: string) => {
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce);
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonce.length
  );
  const privateKeyUint8 = decodeBase64(secretKey);
  const decrypted = box.open(message, nonce, privateKeyUint8, null);
  if (!decrypted) {
    throw new Error("Could not decrypt message");
  }
  const base64DecryptedMessage = encodeUTF8(decrypted);
  return base64DecryptedMessage;
};

export const encryptSecret = async (secret: string, publicKey: string) => {
  const encryptedSecret = encrypt(secret, publicKey);
  return encryptedSecret;
};

export const decryptSecret = async (
  encryptedSecret: string,
  encryptedNounce: string,
) => {
  const secret = decrypt(encryptedSecret, encryptedNounce);
  return secret;
};
