import type { PDFDocument } from "pdf-lib";

import type { WalletSigner } from "./wallet-signer";
import type { WalletAttribute } from "./wallet-attribute";
import { editPdf } from "./edit-pdf";
import type { Signature } from "./signature";

export const DUMMY_SIG_PREFIX = "$SIG";
const DUMMY_SIG = "01234567890ABCDEFGHIJKLMNOP";

/**
 * Dummy implementation of a wallet signer.
 * WARNING, THIS CLASS DOES NOT CREATE REAL CRYPTOGRAPHIC SIGNATURES!
 */
export class DummySigner implements WalletSigner {
  public async sign(
    input: PDFDocument,
    attributes: WalletAttribute[]
  ): Promise<Uint8Array> {
    return (await editPdf(input, generateDummySignature(attributes))).save();
  }

  public check(input: string): boolean {
    if (input.includes(DUMMY_SIG)) {
      console.log(`Valid sig "${input}" found!`);
      return true;
    }
    return false;
  }

  public decode(input: string): Signature {
    let result = <Signature>{};
    try {
      result = JSON.parse(input);
      for (const ATTRIBUTE of result.attributes) {
        ATTRIBUTE.value = atob(ATTRIBUTE.value.toString());
      }
    } catch {
      console.error("Could not parse signature!");
    }
    return result;
  }
}

/**
 * Function to generate dummy signatures.
 * @param input Attributes used to generate the signature.
 * @returns A dummy signature.
 */
function generateDummySignature(input: WalletAttribute[]): string {
  for (const ATTRIBUTE of input) {
    ATTRIBUTE.value = btoa(ATTRIBUTE.value.toString());
  }

  const resultSignature: Signature = {
    signature: DUMMY_SIG_PREFIX + DUMMY_SIG,
    attributes: input,
    date: new Date().toISOString(),
  };

  return JSON.stringify(resultSignature);
}
