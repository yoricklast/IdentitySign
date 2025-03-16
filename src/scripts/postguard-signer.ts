import type { PDFDocument } from "pdf-lib";

import type { WalletSigner } from "./wallet-signer";
import { WalletAttributeType } from "./wallet-attribute";
import { editPdf } from "./edit-pdf";
import type { Signature } from "./signature";

export const DUMMY_SIG_PREFIX = "$SIG";
const DUMMY_SIG = "01234567890ABCDEFGHIJKLMNOP";

import { type AttributeCon, type ISealOptions, type ISigningKey, StreamUnsealer } from "@e4a/pg-wasm";

import { METRICS_HEADER, PKG_URL } from "./Constants";

type AttType =
  | "pbdf.sidn-pbdf.email.email"
  | "pbdf.gemeente.personalData.fullname"
  | "pbdf.nijmegen.address.street";

export const ATTRIBUTES: Array<AttType> = [
  "pbdf.sidn-pbdf.email.email",
  "pbdf.gemeente.personalData.fullname",
  "pbdf.nijmegen.address.street",
];

export type SigningKeys = {
  pubSignKey: ISigningKey;
  privSignKey: ISigningKey;
};

async function getParameters(): Promise<string> {
  const resp = await fetch(`${PKG_URL}/v2/parameters`, {
    headers: METRICS_HEADER,
  });
  const params = await resp.json();
  return params.publicKey;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder("utf-8");
  const decodedString = decoder.decode(buffer);
  return btoa(encodeURIComponent(decodedString));
}


async function applyEncryption(pubSignKey: ISigningKey, file: PDFDocument): Promise<PDFDocument>
{
  const mpk = await getParameters();
  const { sealStream } = await import("@e4a/pg-wasm");

  const options: ISealOptions = {
    skipEncryption: true,
    pubSignKey: pubSignKey,
  };

  const chunks: Uint8Array[] = [];
  const writable = new WritableStream({
    write(chunk: Uint8Array) {
      chunks.push(chunk)
    },
    close() {
      console.log('Stream is closed.')
    }
  })

  const pdfAsUint8Arr = await file.save()
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(pdfAsUint8Arr);
      controller.close();
    },
  });

  // Seal PDFDocument
  try {
    await sealStream(mpk, options, readable, writable)
  } catch (e) {
    console.log('error during sealing: ', e)
  }

  // Convert sealed document to a base64string so we can attach it to the existing PDF as a new page
  const arrayBuffer: ArrayBuffer = await new Blob(chunks).arrayBuffer()
  const base64String = arrayBufferToBase64(arrayBuffer);

  const page = file.addPage();
  page.setFontSize(1)
  page.drawText(base64String)

  // Return
  return file;
}


/**
 * Implementation of a wallet signer.
 */
export class PostGuardSigner implements WalletSigner {

  set signKeys(value: SigningKeys) {
    this._signKeys = value;
  }

  private _signKeys: SigningKeys;

  public async sign(
    input: PDFDocument,
    attributeTypes: WalletAttributeType[],
  ): Promise<Uint8Array> {
    const pubSignKey: ISigningKey = this._signKeys.pubSignKey;
    const con: AttributeCon = pubSignKey.policy.con;

    await editPdf(input, this.generateVisibleSignature(con));

    input = await applyEncryption(pubSignKey, input);

    return input.save();
  }

  /**
   * Function to generate a signature that is visible within PDF
   * @param input Attributes used to generate the signature.
   * @returns A dummy signature.
   */
  private generateVisibleSignature(input: AttributeCon): string {
    const resultSignature: Signature = {
      signature: DUMMY_SIG_PREFIX + DUMMY_SIG,
      attributes: input,
      date: new Date().toISOString(),
    };

    return JSON.stringify(resultSignature);
  }

  public async check(input: string): Promise<boolean> {
    const vk = await fetch(`${PKG_URL}/v2/sign/parameters`)
      .then((r) => r.json())
      .then((j) => j.publicKey);

    console.log("retrieved verification key: ", vk);

    function base64ToArrayBuffer(input: string) {
      const temp = decodeURIComponent(atob( input ));
      const encoder = new TextEncoder();
      return encoder.encode(temp);
    }

    const encodedInpt = base64ToArrayBuffer(input)

    console.log("String to check: ", encodedInpt);

    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(base64ToArrayBuffer(encodedInpt));
        controller.close();
      },
    });

    const unsealer = await StreamUnsealer.new(readable, vk);
    const recipients = unsealer.inspect_header();
    console.log("header contains the following recipients", recipients);

    const usk = await fetch(`${PKG_URL}/v2/request/key/0`, {
      headers: {
        ...METRICS_HEADER,
      },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.status !== "DONE" || json.proofStatus !== "VALID")
          throw new Error("not done and valid");
        return json.key;
      })
      .catch((e: Error) => console.log("error: ", e));

    const chunks: Uint8Array[] = []; // Store incoming chunks
    const writable = new WritableStream({
      write: (chunk) => {
        if (chunk instanceof Uint8Array) {
          chunks.push(chunk);
        } else {
          throw new Error("Expected Uint8Array chunk");
        }
      },
      close: () => {
        console.log("WritableStream closed.");
      },
      abort: (err) => {
        console.error("WritableStream aborted:", err);
      },
    });

    try {
      const pol = await unsealer.unseal("Default", usk, writable);
      console.log("pol: ", pol);
      return true;
    } catch (e) {
      console.log("error: ", e);
      return false;
    }
  }

  public decode(input: string): Signature {
    let result = <Signature>{};
    try {
      result = JSON.parse(input);
    } catch {
      console.error("Could not parse signature!");
    }
    return result;
  }
}
