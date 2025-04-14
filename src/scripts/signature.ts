import type { AttributeCon } from "@e4a/pg-wasm";

export type Signature = {
  signature: string;
  attributes: AttributeCon;
  date: string;
};
