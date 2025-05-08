import type { PDFDocument } from "pdf-lib";
import type { WalletAttributeType } from "./wallet-attribute";
import type { SignatureCrypto } from "./signature";

/**
 * Interface for identity wallet implementations.
 */
export interface WalletSigner {
  /**
   * Sign a PDF document.
   * @param input Document to sign.
   * @param attributeTypes Wallet attribute types chosen in UI.
   * @returns The signed PDF document in bytes.
   */
  sign(
    input: PDFDocument,
    attributeTypes: WalletAttributeType[],
  ): Promise<Uint8Array>;

  /**
   * Check the validity of a PDF document.
   * @param input Document to check.
   * @param attributes Wallet attributes to check the PDF with.
   * @returns The validity as either true or false.
   */
  check(input: Uint8Array): Promise<boolean>;
  /**
   * Decode the signature from a string to a signature object.
   * @param input The string containing a signature.
   */
  decode(input: string): SignatureCrypto;
}
