<!-- TypeScript -->

<script lang="ts">
  import { PDFDocument } from "pdf-lib";
  import * as pdfjs from "pdfjs-dist";
  import {
    ATTRIBUTES,
    PostGuardSigner,
  } from "../../scripts/crypto/postguard-signer";
  import { DummySigner } from "../../scripts/dummy/dummy-signer";
  import { type WalletSignerDummy } from "../../scripts/dummy/dummy-wallet-signer";
  import {
    WalletAttributeType,
    type WalletAttribute,
  } from "../../scripts/wallet-attribute";
  import type { AttributeCon } from "@e4a/pg-wasm";
  import { tick } from "svelte";
  import { getFriendlyAttributeName } from "../../scripts/ts-util";

  import {
    DISCLOSE_ADDRESS,
    DISCLOSE_EMAIL,
    DISCLOSE_FULL_NAME,
    disclose,
  } from "../../scripts/yivi-disclose";
  import { resolve } from "$app/paths";
  import type { RenderParameters } from "pdfjs-dist/types/src/display/api";

  // Get PDF.js worker from CDN, as using the one provided by the NPM package seems to cause issues in TypeScript
  // https://github.com/mozilla/pdf.js#including-via-a-cdn
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`;

  const version = localStorage.getItem("productionVersion");

  const signerCrypto: PostGuardSigner = new PostGuardSigner();
  const signerDummy: WalletSignerDummy = new DummySigner();

  const PARAM_NAME = "name";
  const PARAM_MAIL = "mail";
  const PARAM_ADDRESS = "address";
  const PARAM_FILE = "filename";
  const PARAM_VERSION = "prod";

  const SIGNED_FILE_ADDITION = "_signed.pdf";

  const urlParams = new URLSearchParams(window.location.search);

  let paramName = urlParams.get(PARAM_NAME);
  let paramMail = urlParams.get(PARAM_MAIL);
  let paramAddress = urlParams.get(PARAM_ADDRESS);
  let paramFile = urlParams.get(PARAM_FILE);
  let paramVersion = urlParams.get(PARAM_VERSION);

  let isMobile =
    /Android|iPad|iPhone|iPod/i.test(window.navigator.userAgent) ||
    (/Macintosh/i.test(window.navigator.userAgent) &&
      navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 2);

  let progress = $state(0);

  let files = $state<FileList>();

  let nameChecked = $state<boolean>();
  let mailChecked = $state<boolean>();
  let addressChecked = $state<boolean>();

  let checkedAttributes = $derived.by(() => {
    return [
      nameChecked ? "name" : null,
      mailChecked ? "email" : null,
      addressChecked ? "address" : null,
    ].filter((x) => x != null);
  });

  function join(attributesList: string[]) {
    if (attributesList.length === 1) return attributesList[0];
    return `${attributesList.slice(0, -1).join(", ")} and ${attributesList[attributesList.length - 1]}`;
  }

  let selectedAttributes: WalletAttributeType[] = [];

  let yiviAttributesCrypto: AttributeCon | null = $state(null);
  let yiviAttributesDummy: WalletAttribute[] | null = $state(null);

  let fileSelected = $state(false);
  let attributeSelected = $state(false);
  let yiviActive = $state(false);
  let yiviDone = $state(false);
  let signedDone = $state(false);

  let signedPdfName: string | null = null;
  let signedPdfBytes: Uint8Array<ArrayBuffer> | null = null;

  if (paramAttributesGiven()) {
    attributeSelected = true;
    selectedAttributes = [];
    if (paramName) {
      selectedAttributes.push(WalletAttributeType.Name);
      nameChecked = true;
    }
    if (paramMail) {
      selectedAttributes.push(WalletAttributeType.Email);
      mailChecked = true;
    }
    if (paramAddress) {
      selectedAttributes.push(WalletAttributeType.Address);
      addressChecked = true;
    }
  }
  if (paramVersion) {
    if (paramVersion !== version) {
      if (paramVersion == "0") {
        localStorage.setItem("productionVersion", "0");
        location.reload();
      } else if (paramVersion == "1") {
        localStorage.setItem("productionVersion", "1");
        location.reload();
      }
    }
  }

  function processFile() {
    if (files) {
      if (files[0].type != "application/pdf") {
        alert("The selected file is not a PDF!");
        progress = 0;
      } else if (paramFile && files[0].name != paramFile) {
        alert("The selected file is not the one requested!");
        progress = 0;
      } else {
        fileSelected = true;
        progress = 0;
        renderPDFCanvas(files[0]);
      }
    }
  }

  function renderPDFCanvas(inputFile: File) {
    inputFile.arrayBuffer().then((value) => {
      // @ts-ignore
      pdfjs.getDocument(value).promise.then((pdf) => {
        pdf.getPage(1).then((page) => {
          const scale = 1;
          const canvas = document.getElementById(
            "pdf-canvas",
          ) as HTMLCanvasElement;
          const viewport = page.getViewport({
            scale: scale,
          });
          const context = canvas.getContext("2d");
          if (context) {
            canvas.height = Math.ceil(viewport.height);
            canvas.width = Math.ceil(viewport.width);
            canvas.style.width =
              Math.ceil(viewport.width) / (window.devicePixelRatio || 1) + "px";
            canvas.style.height =
              Math.ceil(viewport.height) / (window.devicePixelRatio || 1) +
              "px";
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            } as RenderParameters;
            page.render(renderContext).promise.then(() => {
              progress = 20;
            });
          } else {
            console.error("Could not get canvas context for rendering PDF.");
          }
        });
      });
    });
  }

  async function signPdfDummy(inputFile: File) {
    if (yiviAttributesDummy != null) {
      const existingPdfBytes = await inputFile.arrayBuffer();
      const pdfDocument = await PDFDocument.load(existingPdfBytes);
      signerDummy.sign(pdfDocument, yiviAttributesDummy).then((pdfBytes) => {
        signedPdfBytes = pdfBytes;
        signedPdfName =
          inputFile.name.substring(0, inputFile.name.lastIndexOf(".")) +
          SIGNED_FILE_ADDITION;
        downloadPdf(signedPdfName, signedPdfBytes);
        signedDone = true;
        progress = 100;
      });
    }
  }

  async function signPdfCrypto(inputFile: File) {
    if (yiviAttributesCrypto != null) {
      const existingPdfBytes = await inputFile.arrayBuffer();
      const pdfDocument = await PDFDocument.load(existingPdfBytes);
      signerCrypto.sign(pdfDocument).then((pdfBytes) => {
        signedPdfBytes = pdfBytes;
        signedPdfName =
          inputFile.name.substring(0, inputFile.name.lastIndexOf(".")) +
          SIGNED_FILE_ADDITION;
        downloadPdf(signedPdfName, signedPdfBytes);
        signedDone = true;
        progress = 100;
      });
    }
  }

  /* For signing with dummy signatures */
  async function runYivi() {
    getYiviData(selectedAttributes).then((result) => {
      yiviAttributesDummy = result;
      yiviDone = true;
      progress = 82;
    });
  }

  /**
   * Obtain attribute data from Yivi. Used for dummy signing.
   * @param inputAttributes Attributes to obtain.
   */
  async function getYiviData(
    inputAttributes: WalletAttributeType[],
  ): Promise<WalletAttribute[]> {
    // Build string for disclosure
    let attributesToDisclose = Array<string>();
    for (const x of inputAttributes) {
      switch (x) {
        case WalletAttributeType.Name: {
          attributesToDisclose =
            attributesToDisclose.concat(DISCLOSE_FULL_NAME);
          break;
        }
        case WalletAttributeType.Email: {
          attributesToDisclose = attributesToDisclose.concat(DISCLOSE_EMAIL);
          break;
        }
        case WalletAttributeType.Address: {
          attributesToDisclose = attributesToDisclose.concat(DISCLOSE_ADDRESS);
          break;
        }
      }
    }
    // Disclose attributes
    let attributes = Array<WalletAttribute>();
    await disclose(attributesToDisclose).then((result) => {
      let address = null;
      for (const x of result) {
        if (DISCLOSE_FULL_NAME.includes(x.id)) {
          const y: WalletAttribute = {
            attributeType: WalletAttributeType.Name,
            value: x.rawvalue,
          };
          attributes.push(y);
        } else if (DISCLOSE_EMAIL.includes(x.id)) {
          const y: WalletAttribute = {
            attributeType: WalletAttributeType.Email,
            value: x.rawvalue,
          };
          attributes.push(y);
        } else if (DISCLOSE_ADDRESS.includes(x.id)) {
          if (address == null) {
            address = x.rawvalue;
          } else {
            address = address + " " + x.rawvalue;
          }
        }
      }
      if (address != null) {
        const y: WalletAttribute = {
          attributeType: WalletAttributeType.Address,
          value: address,
        };
        attributes.push(y);
      }
    });

    return attributes;
  }

  /**
   * Download a file.
   * @param fileName Name of the file.
   * @param bytes File content as bytes.
   */
  function downloadPdf(fileName: string, bytes: Uint8Array<ArrayBuffer>) {
    var blob = new Blob([bytes], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  /**
   * Logic for the "Sign" button.
   */
  async function btnSignClick() {
    if (files && fileSelected && attributeSelected && yiviDone) {
      if (version == "0") {
        await signPdfDummy(files[0]);
      } else if (version == "1") {
        await signPdfCrypto(files[0]);
      } else {
        alert("Select a supported production version in the settings first!");
      }
    } else {
      alert(
        "Please select a file and attributes and authenticate using Yivi first!",
      );
    }
  }

  /**
   * Logic for the "Next" button
   */
  async function btnProveIdentity() {
    selectAttributes();
    if (fileSelected && attributeSelected) {
      yiviActive = true;
      await tick();

      // Build string for disclosure
      const attributesToDisclose: { t: string }[] = [];
      for (const x of selectedAttributes) {
        switch (x) {
          case WalletAttributeType.Name: {
            attributesToDisclose.push({ t: ATTRIBUTES[1] });
            break;
          }
          case WalletAttributeType.Email: {
            attributesToDisclose.push({ t: ATTRIBUTES[0] });
            break;
          }
        }
      }
      yiviAttributesCrypto =
        await signerCrypto.obtainSignKeys(attributesToDisclose);
      yiviDone = true;
      progress = 80;
    }
  }

  function btnNext() {
    if (version == "0") {
      // Dummy signer
      selectAttributes();
      if (fileSelected && attributeSelected) {
        yiviActive = true;
        runYivi();
      }
    } else if (version == "1") {
      // Crypto signer
      btnProveIdentity();
    } else {
      alert("Select a supported production version in the settings first!");
    }
  }

  /**
   * Set selectedAttributes from UI.
   */
  function selectAttributes() {
    selectedAttributes = [];
    if (nameChecked) {
      selectedAttributes.push(WalletAttributeType.Name);
    }
    if (addressChecked) {
      selectedAttributes.push(WalletAttributeType.Address);
    }
    if (mailChecked) {
      selectedAttributes.push(WalletAttributeType.Email);
    }
    if (selectedAttributes.length > 0) {
      attributeSelected = true;
      progress = 50;
      console.log(selectedAttributes);
    } else {
      alert("Please select one or more personal data to sign with!");
    }
  }

  /**
   * Logic for "Cancel" button.
   */
  function btnResetClick() {
    window.location.href = "/sign";
  }

  /**
   * Check if URL parameters (attributes or file) are given
   */
  function paramsGiven(): boolean {
    if (paramAttributesGiven() || paramFile) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Check if URL paramaters for attributes are given
   */
  function paramAttributesGiven(): boolean {
    if (paramName || paramMail || paramAddress) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Logic for the "Download again" button
   */
  function btnDownloadAgainClick() {
    if (signedPdfBytes != null && signedPdfName != null) {
      downloadPdf(signedPdfName, signedPdfBytes);
    }
  }
</script>

<!-- HTML / Svelte -->

<div
  class="{paramsGiven() ? 'row flex-wrap mx-auto w-100' : 'mx-auto'} {files &&
  fileSelected
    ? 'w-100'
    : 'w-75 widthMobile'}"
  style="margin-top: 3%;"
>
  <div
    class="{paramsGiven()
      ? 'col-lg-5 col-md-8 col-sm-8 align-self-start flex-sm-fill mb-4'
      : ''} "
    style="max-width: 720px;"
  >
    {#if paramsGiven()}
      <div class="card request-card">
        <div class="card-body" style="padding: 1.5rem !important;">
          <h2 class="card-title">You have opened a sign request!</h2>
          <p class="card-text">You are requested to sign file:</p>
          {#if paramFile != null}
            <div class="card card-attr">
              <div class="card-body">
                <i class="bi bi-file-earmark attr-icon"></i>
                {paramFile}
              </div>
            </div>
          {/if}
          {#if paramAttributesGiven()}
            <p class="card-text">You are requested to sign with your:</p>
          {/if}
          {#if paramName != null}
            <div class="card card-attr">
              <div class="card-body">
                <i class="bi bi-person attr-icon"></i>
                Name
              </div>
            </div>
          {/if}
          {#if paramMail != null}
            <div class="card card-attr">
              <div class="card-body">
                <i class="bi bi-at attr-icon"></i>
                Email address
              </div>
            </div>
          {/if}
          {#if paramAddress != null}
            <div class="card card-attr">
              <div class="card-body">
                <i class="bi bi-house attr-icon"></i>
                Address
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
  <div
    class="{paramsGiven() && !files && !fileSelected
      ? 'col-lg-7'
      : 'col-12 mx-auto'} {files && fileSelected ? 'col-12' : ''}"
  >
    <div class="row justify-content-between">
      <div class={files && fileSelected ? "col-lg-7" : "col-12"}>
        <div
          class="position-relative {paramsGiven()
            ? 'end-0 translate-middle-y top-50'
            : ''}"
        >
          <div class="spacer"></div>
          <div class="progress-label-div row">
            <div
              class="progress-label text-wrap position-absolute start-0 text-start align-self-end px-0 overflow-x-visible"
            >
              <i class="bi bi-1-circle"></i> Select file &
              <br class="d-sm-none d-block" /> personal data
            </div>
            <div
              class="progress-label text-wrap position-absolute start-50 text-center translate-middle-x align-self-end px-0"
            >
              <i class="bi bi-2-circle"></i> Prove your identity
            </div>
            <div
              class="progress-label text-wrap text-center position-absolute translate-middle-x align-self-end px-0"
              style="left: 74%;"
            >
              <i class="bi bi-3-circle"></i> <br class="d-sm-none d-block" /> Sign
            </div>
            <div
              class="progress-label text-wrap position-absolute end-0 text-end align-self-end px-0"
            >
              <i class="bi bi-4-circle"></i> <br class="d-sm-none d-block" /> Done
            </div>
          </div>
          <div class="progress" role="progressbar" aria-label="Progress">
            <div class="progress-bar" style="width: {progress}%"></div>
          </div>

          <h1>
            <i class="bi bi-pencil-square page-icon" style="margin-top: 1%;"
            ></i>Sign a document
          </h1>
          <div class="infoblock rounded border">
            {#if !signedDone && (!attributeSelected || paramsGiven()) && !yiviActive}
              {#if paramsGiven()}
                <p class="request-note text-primary-emphasis">
                  Creating a signature from a sign request.
                </p>
              {/if}
              <h2>Select document</h2>

              <div class="mb-3 file-select">
                <label for="formFile" class="form-label"
                  >This document will be signed.
                  <span
                    class="d-inline-block"
                    data-bs-trigger="hover focus"
                    data-bs-toggle="popover"
                    data-bs-placement="right"
                    data-bs-container="body"
                    data-bs-content="Click on 'Browse...' and choose a PDF document from your device that you want to sign."
                  >
                    <button
                      type="button"
                      class="btn btn-link mb-1"
                      tabindex="0"
                      aria-label="How to select a document"
                    >
                      <i class="bi bi-question-circle"></i>
                    </button></span
                  ></label
                >
                <input
                  class="form-control"
                  accept="application/pdf"
                  type="file"
                  bind:files
                  onchange={processFile}
                />
              </div>
              <h2 style="margin-top: 30px;">Select personal data</h2>
              <label for="attr-checks" class="form-label"
                >Signatures will be created using personal data, and will always
                contain the date and time.
                <span
                  class="d-inline-block"
                  data-bs-trigger="hover focus"
                  data-bs-toggle="popover"
                  data-bs-placement="right"
                  data-bs-container="body"
                  data-bs-content="A document has to be selected first. You can sign with: name (first name + last name), email and address (street, house number, zip code and city)"
                >
                  <button
                    type="button"
                    class="btn btn-link mb-1"
                    tabindex="0"
                    aria-label="How to select personal data"
                    ><i class="bi bi-question-circle"> </i>
                  </button>
                </span>
              </label>
              {#if !attributeSelected && fileSelected}
                <div id="attr-checks">
                  <div class="mb-3 form-check form-check-inline">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="checkName"
                      bind:checked={nameChecked}
                    />
                    <label class="form-check-label" for="checkName"
                      >Legal name</label
                    >
                  </div>
                  <div class="mb-3 form-check form-check-inline">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="checkMail"
                      bind:checked={mailChecked}
                    />
                    <label class="form-check-label" for="checkMail">Email</label
                    >
                  </div>
                  {#if version == "0"}
                    <div class="mb-3 form-check form-check-inline">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="checkAddress"
                        bind:checked={addressChecked}
                      />
                      <label class="form-check-label" for="checkAddress"
                        >Address</label
                      >
                    </div>
                  {/if}
                </div>
              {:else}
                <div id="attr-checks">
                  <div class="mb-3 form-check form-check-inline">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="checkName"
                      disabled
                      bind:checked={nameChecked}
                    />
                    <label class="form-check-label" for="checkName"
                      >Legal name</label
                    >
                  </div>
                  <div class="mb-3 form-check form-check-inline">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="checkMail"
                      disabled
                      bind:checked={mailChecked}
                    />
                    <label class="form-check-label" for="checkMail">Email</label
                    >
                  </div>
                  {#if version == "0"}
                    <div class="mb-3 form-check form-check-inline">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="checkAddress"
                        disabled
                        bind:checked={addressChecked}
                      />
                      <label class="form-check-label" for="checkAddress"
                        >Address</label
                      >
                    </div>
                  {/if}
                </div>
                <div class="form-text">
                  The document's signature will be based on the personal data
                  you select. You can find out more on this in <a
                    href={resolve("/about")}>about</a
                  >.
                </div>
              {/if}
            {/if}
            {#if !signedDone && fileSelected && attributeSelected && yiviActive && !yiviDone}
              <h2>Prove your identity</h2>
              <p>
                To sign with your {join(checkedAttributes)}, you need to prove
                that {checkedAttributes.length > 1 ? "they are" : "it is"}
                really yours. You do this with the
                <a href="https://www.yivi.app/en" target="_blank">Yivi</a> app.
              </p>
              <div class="row flex-wrap-reverse flex-sm-wrap-reverse">
                <div class="yivi-text col-md" style="min-width: 33.33%;">
                  <h3>How do I do this?</h3>
                  {#if isMobile}
                    <p>
                      Click the "Open Yivi app" button and follow the
                      instructions in the Yivi app to continue. <br />
                      <b>Alternatively</b>, you can click "Show QR code" and use
                      the Yivi app on another device to scan the QR-code.
                    </p>
                  {:else}
                    <p>
                      Use the Yivi app on your smartphone to scan the QR-code.
                    </p>
                  {/if}
                  <p>
                    Don't have the Yivi app? You can get it
                    <a href="https://www.yivi.app/en/download" target="_blank"
                      >here</a
                    >. Follow the instructions in the Yivi app to continue.
                  </p>
                </div>
                <div class="yivi-web-form col-xl mb-3" id="yivi-web-form"></div>
              </div>
            {/if}
            {#if !signedDone && yiviDone}
              <h2>Ready to sign!</h2>
              <p>
                Your document will be signed using the following personal data:
              </p>
              {#if version == "0" && yiviAttributesDummy != null}
                {#each yiviAttributesDummy as attribute (attribute.attributeType)}
                  <div class="card attribute-card">
                    <div class="card-header">
                      <i class="bi bi-patch-check card-icon"></i><b
                        >{WalletAttributeType[attribute.attributeType]}</b
                      >
                    </div>
                    <div class="card-body">
                      <p>{attribute.value.toString()}</p>
                    </div>
                  </div>
                {/each}
              {:else if version == "1" && yiviAttributesCrypto != null}
                {#each yiviAttributesCrypto as attribute (attribute.t)}
                  <!--or (yiviAttributesCrypto.indexOf(attribute)) as key ?-->
                  <div class="card attribute-card">
                    <div class="card-header">
                      <i class="bi bi-patch-check card-icon"></i><b
                        >{getFriendlyAttributeName(attribute.t)}</b
                      >
                    </div>
                    <div class="card-body">
                      <p>{attribute.v?.toString()}</p>
                    </div>
                  </div>
                {/each}
              {/if}
            {/if}
            {#if signedDone}
              <h2 class="text-success">
                <i class="bi bi-check-circle"></i>
                Done!
              </h2>
              <p>
                You can find the signed file in your downloads folder. <br />
              </p>
              <p>
                <i class="text-primary-emphasis"
                  >Please note that IdentitySign signatures only work on <b
                    >digital</b
                  > documents! Printed documents will stay display the IdentitySign
                  banner, but no longer contain a signature (even when scanned).</i
                >
              </p>
            {/if}
          </div>

          <div class="btn-sign-div">
            {#if fileSelected && !signedDone}
              <button
                class="btn btn-secondary btn-sign"
                type="button"
                onclick={btnResetClick}
                ><i class="bi bi-x-octagon btn-sign-icon"></i>Cancel</button
              >
            {/if}
            {#if fileSelected && !yiviDone && !signedDone && !yiviActive}
              <button
                class="btn btn-primary btn-sign"
                type="button"
                onclick={btnNext}
                ><i class="bi bi-arrow-right-circle btn-sign-icon"></i>Next
              </button>
            {/if}
            {#if !signedDone && fileSelected && attributeSelected && yiviActive && !yiviDone}
              <p
                class="ms-2 mb-0 btn-sign align-self-center text-primary-emphasis"
              >
                <i class="bi bi-qr-code-scan btn-sign-icon"></i>Scan QR to
                continue
              </p>
            {/if}
            {#if fileSelected && yiviDone && !signedDone}
              <button
                class="btn btn-primary btn-sign"
                type="button"
                onclick={btnSignClick}
                ><i class="bi bi-pencil-square btn-sign-icon"></i>Sign
              </button>
            {/if}
            {#if signedDone}
              <button
                class="btn btn-secondary btn-sign"
                type="button"
                onclick={btnResetClick}
                ><i class="bi bi-plus-lg btn-sign-icon"></i>Sign another file</button
              >
              <button
                class="btn btn-secondary btn-sign"
                type="button"
                onclick={btnDownloadAgainClick}
                ><i class="bi bi-download btn-sign-icon"></i>Download again</button
              >
            {/if}
          </div>
        </div>
      </div>
      <div
        class={files && fileSelected
          ? "col-lg-5 col-md-9 col-sm-11 align-self-start"
          : ""}
      >
        {#if files && fileSelected}
          <p class="mb-0">PDF Preview:</p>
          <canvas
            id="pdf-canvas"
            class="h-100 w-100 align-self-start border border-secondary mt-3"
            style="max-height: 90vh; max-width:max-content;"
          ></canvas>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- CSS specific to page -->

<style>
  h1 {
    margin-top: 40px;
    margin-bottom: 25px;
  }
  .btn-sign {
    margin-right: 10px;
  }
  .btn-sign-div {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
  }
  .btn-sign-icon {
    margin-right: 7px;
  }
  .request-card {
    margin-right: 10%;
    margin-bottom: 20px;
  }
  .card-attr {
    margin-bottom: 15px;
  }
  .attr-icon {
    margin-right: 5px;
  }
  .form-check {
    font-size: 18px;
  }
  .request-note {
    font-size: 20px;
    font-weight: 600;
  }
  .infoblock {
    background-color: var(--bs-body-bg);
    overflow: scroll;
  }
  .card-title {
    margin-bottom: 15px;
  }
  .card-text {
    margin-top: 25px;
    font-weight: 600;
  }
  .request-card {
    background-color: var(--bs-tertiary-bg);
  }
  .yivi-web-form {
    margin-left: 10px;
    margin-right: 10px;
  }
  .spacer {
    @media screen and (max-width: 768px) {
      height: 8vh;
    }
  }
</style>
