import type { PDFDocument } from "pdf-lib";

import type { WalletSignerDummy } from "./dummy-wallet-signer";
import { WalletAttributeType, type WalletAttribute } from "./wallet-attribute";
import { editPdf } from "./edit-pdf";
import type { SignatureDummy } from "./signature";
import {
    ADDRESS_CODE,
    DEFAULT_BASE_CODE,
    EMAIL_CODE,
    NAME_CODE,
    getDefaultBaseCode,
} from "./ts-util";

export const DUMMY_SIG_PREFIX = "$SIG";
const DUMMY_SIG = "01234567890ABCDEFGHIJKLMNOP";

/**
 * Dummy implementation of a wallet signer.
 * WARNING, THIS CLASS DOES NOT CREATE REAL CRYPTOGRAPHIC SIGNATURES!
 */
export class DummySigner implements WalletSignerDummy {
    public async sign(
        input: PDFDocument,
        attributes: WalletAttribute[],
    ): Promise<Uint8Array> {
        return (
            await editPdf(
                input,
                generateDummySignature(attributes),
                //await generateSuccessCode(attributes),
            )
        ).save();
    }

    public check(input: string): boolean {
        if (input.includes(DUMMY_SIG)) {
            console.log(`Valid sig "${input}" found!`);
            return true;
        }
        return false;
    }

    public decode(input: string): [SignatureDummy, boolean] {
        let result = <SignatureDummy>{};
        let valid = false;
        try {
            result = JSON.parse(input);
            for (const ATTRIBUTE of result.attributes) {
                ATTRIBUTE.value = atob(ATTRIBUTE.value.toString());
            }
            valid = true;
        } catch {
            console.error("Could not parse signature!");
        }
        return [result, valid];
    }
}

/**
 * Function to generate dummy signatures.
 * @param input Attributes used to generate the signature.
 * @returns A dummy signature.
 */
function generateDummySignature(input: WalletAttribute[]): string {
    for (const attribute of input) {
        attribute.value = btoa(attribute.value.toString());
    }

    const resultSignature: SignatureDummy = {
        signature: DUMMY_SIG_PREFIX + DUMMY_SIG,
        attributes: input,
        date: new Date().toISOString(),
    };

    return JSON.stringify(resultSignature);
}

async function generateSuccessCode(input: WalletAttribute[]): Promise<string> {
    let result = `${DEFAULT_BASE_CODE}-`;
    let code = 0;

    await getDefaultBaseCode().then((resultBaseCode) => {
        if (resultBaseCode != null) {
            result = `${resultBaseCode}-`;
        }
    });

    for (const attribute of input) {
        switch (attribute.attributeType) {
            case WalletAttributeType.Name: {
                code = code + NAME_CODE;
                break;
            }
            case WalletAttributeType.Address: {
                code = code + ADDRESS_CODE;
                break;
            }
            case WalletAttributeType.Email: {
                code = code + EMAIL_CODE;
                break;
            }
        }
    }

    result = result.concat(code.toString());

    return result;
}