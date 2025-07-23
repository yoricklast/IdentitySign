import type { PDFDocument } from "pdf-lib";

import type { WalletSignerCrypto } from "./crypto-wallet-signer";
import { editPdf } from "../edit-pdf";
import type { SignatureCrypto } from "../signature";

export const DUMMY_SIG_PREFIX = "$SIG";
const DUMMY_SIG = "01234567890ABCDEFGHIJKLMNOP";
const DEFAULT_BASE_CODE = "SCODE";

import {
  type AttributeCon,
  type ISealOptions,
  type ISigningKey,
  StreamUnsealer,
} from "@e4a/pg-wasm";

import { METRICS_HEADER, PKG_URL, POSTGUARD_FILE } from "./Constants";

// @ts-ignore
import YiviCore from "@privacybydesign/yivi-core";
// @ts-ignore
import YiviWeb from "@privacybydesign/yivi-web";
// @ts-ignore
import YiviClient from "@privacybydesign/yivi-client";

type AttType =
  | "pbdf.sidn-pbdf.email.email"
  | "pbdf.gemeente.personalData.fullname";

export const ATTRIBUTES: Array<AttType> = [
  "pbdf.sidn-pbdf.email.email",
  "pbdf.gemeente.personalData.fullname",
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

async function applyEncryption(
  pubSignKey: ISigningKey,
  file: PDFDocument,
): Promise<PDFDocument> {
  const mpk = await getParameters();
  const { sealStream } = await import("@e4a/pg-wasm");

  const options: ISealOptions = {
    skipEncryption: true,
    pubSignKey: pubSignKey,
  };

  const chunks: Uint8Array[] = [];
  const writable = new WritableStream({
    write(chunk: Uint8Array) {
      chunks.push(chunk);
    },
    close() {
      console.log("Stream is closed.");
    },
  });

  const pdfAsUint8Arr = await file.save();
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(pdfAsUint8Arr);
      controller.close();
    },
  });

  // Seal PDFDocument
  try {
    await sealStream(mpk, options, readable, writable);
  } catch (e) {
    console.log("error during sealing: ", e);
  }

  // Convert sealed document to a base64string so we can attach it to the existing PDF as a new page
  const arrayBuffer: ArrayBuffer = await new Blob(chunks).arrayBuffer();
  //const base64String = arrayBufferToBase64(arrayBuffer);

  console.log("Base 64 encrypted string: ", arrayBuffer);

  const currentDate = new Date();

  await file.attach(arrayBuffer, POSTGUARD_FILE, {
    mimeType: "image/jpeg",
    description: "️PostGuard encrypted PDF file",
    creationDate: currentDate,
    modificationDate: currentDate,
  });

  //const page = file.addPage();
  //page.setFontSize(1)
  //page.drawText(base64String)

  // Return
  return file;
}

/**
 * Implementation of a wallet signer.
 */
export class PostGuardSigner implements WalletSignerCrypto {
  set signKeys(value: SigningKeys) {
    this._signKeys = value;
  }

  public async obtainSignKeys(pub: AttributeCon): Promise<AttributeCon> {
    const session = {
      url: PKG_URL,
      start: {
        // @ts-ignore
        url: (o) => `${o.url}/v2/request/start`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ con: [...pub] }),
      },
      result: {
        // @ts-ignore
        url: (o, { sessionToken }) => `${o.url}/v2/request/jwt/${sessionToken}`,
        // @ts-ignore
        parseResponse: (r) => {
          return (
            r
              .text()
              // @ts-ignore
              .then((jwt) =>
                fetch(`${PKG_URL}/v2/irma/sign/key`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    pubSignId: pub,
                  }),
                }),
              )
              .then((r: Response) => r.json())
              .then(
                (json: {
                  status: string;
                  proofStatus: string;
                  pubSignKey: ISigningKey;
                  privSignKey: ISigningKey;
                }): SigningKeys => {
                  if (json.status !== "DONE" || json.proofStatus !== "VALID")
                    throw new Error("not done and valid");
                  return {
                    pubSignKey: json.pubSignKey,
                    privSignKey: json.privSignKey,
                  };
                },
              )
              .catch((e: Error) => console.log("error: ", e))
          );
        },
      },
    };

    const yivi = new YiviCore({
      debugging: true,
      element: "#yivi-web-form",
      session,
      state: {
        serverSentEvents: false,
        polling: {
          endpoint: "status",
          interval: 500,
          startState: "INITIALIZED",
        },
      },
      language: "en",
    });

    yivi.use(YiviWeb);
    yivi.use(YiviClient);

    const signKeys: SigningKeys = await yivi
      .start()
      .catch((e: Error) => console.error("failed Yivi session: ", e));

    this._signKeys = signKeys;

    return signKeys.pubSignKey.policy.con;
  }

  // @ts-ignore
  private _signature: Signature;
  // @ts-ignore
  private _signKeys: SigningKeys;

  public async sign(input: PDFDocument): Promise<Uint8Array> {
    const pubSignKey: ISigningKey = this._signKeys.pubSignKey;
    const con: AttributeCon = pubSignKey.policy.con;

    await editPdf(input, this.generateVisibleSignature(con), DEFAULT_BASE_CODE);

    input = await applyEncryption(pubSignKey, input);

    return input.save();
  }

  /**
   * Function to generate a signature that is visible within PDF
   * @param input Attributes used to generate the signature.
   * @returns A dummy signature.
   */
  private generateVisibleSignature(input: AttributeCon): string {
    const resultSignature: SignatureCrypto = {
      signature: DUMMY_SIG_PREFIX + DUMMY_SIG,
      attributes: input,
      date: new Date().toISOString(),
    };

    return JSON.stringify(resultSignature);
  }

  public async check(input: Uint8Array): Promise<boolean> {
    const vk = await fetch(`${PKG_URL}/v2/sign/parameters`)
      .then((r) => r.json())
      .then((j) => j.publicKey);

    console.log("retrieved verification key: ", vk);

    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(input);
        controller.close();
      },
    });

    try {
      const unsealer = await StreamUnsealer.new(readable, vk);
      const recipients = unsealer.inspect_header();
      console.log("header contains the following recipients", recipients);

      const usk = await fetch(`${PKG_URL}/v2/request/key-default/0`, {
        headers: {
          ...METRICS_HEADER,
        },
      })
        .then((r) => r.json())
        .then((json) => {
          if (json.status !== "DONE") throw new Error("not done");
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

      const pol = await unsealer.unseal("Default", usk, writable);
      this._signature = {
        signature: "Signature",
        attributes: pol.public.con,
        date: new Date(pol.public.ts).toISOString(),
      };
      return true;
    } catch (e) {
      console.log("error: ", e);
      return false;
    }
  }

  // eslint-disable-next-line
  public decode(input: string): SignatureCrypto {
    return this._signature;
  }
}
