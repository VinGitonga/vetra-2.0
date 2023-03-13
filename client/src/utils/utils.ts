import prettyBytes from "pretty-bytes";

export const getDateAdded = (addedAt: string) =>
  new Date(addedAt).toLocaleString();

export const getSlicedAddress = (address: string) =>
  `${address.slice(0, 6)}.....${address.slice(-6)}`;

export const getFileSize = (fileSize: number) => prettyBytes(fileSize);

export const getFileExtension = (filename: string) =>
  filename.split(".").pop()?.toUpperCase();
