import type { WalletAttribute } from "./wallet-attribute";

export type Signature = {
  signature: string;
  attributes: WalletAttribute[];
  date: string;
};
