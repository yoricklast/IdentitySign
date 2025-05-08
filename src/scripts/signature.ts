import type { AttributeCon } from "@e4a/pg-wasm";
import type { WalletAttribute } from "./wallet-attribute";

export type SignatureDummy = {
  signature: string;
  attributes: WalletAttribute[];
  date: string;
};

export type SignatureCrypto = {
  signature: string;
  attributes: AttributeCon;
  date: string;
};