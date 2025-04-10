<!-- TypeScript -->

<script lang="ts">
  import { PDFDocument } from "pdf-lib";
  import { DummySigner } from "../../scripts/dummy-signer";
  import {
    WalletAttributeType,
    type WalletAttribute,
  } from "../../scripts/wallet-attribute";
  import type { WalletSigner } from "../../scripts/wallet-signer";

  import {
    DISCLOSE_ADDRESS,
    DISCLOSE_EMAIL,
    DISCLOSE_FULL_NAME,
    disclose,
  } from "../../scripts/yivi-disclose";

  const PARAM_NAME = "name";
  const PARAM_MAIL = "mail";
  const PARAM_ADDRESS = "address";
  const PARAM_FILE = "filename";

  const SIGNED_FILE_ADDITION = "_signed.pdf";

  const urlParams = new URLSearchParams(window.location.search);

  let paramName = urlParams.get(PARAM_NAME);
  let paramMail = urlParams.get(PARAM_MAIL);
  let paramAddress = urlParams.get(PARAM_ADDRESS);
  let paramFile = urlParams.get(PARAM_FILE);

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

  let selectedAttributes: WalletAttributeType[] = [];

  let yiviAttributes: WalletAttribute[] | null = $state(null);

  let fileSelected = $state(false);
  let attributeSelected = $state(false);
  let yiviActive = $state(false);
  let yiviDone = $state(false);
  let signedDone = $state(false);

  let signedPdfName: string | null = null;
  let signedPdfBytes: Uint8Array | null = null;

  // avoid use of effect if possible, needs to be changed in future work
  $effect(() => {
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
        if (attributeSelected) {
          progress = 50;
        }
      }
    }
  });

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

  async function signPdf(inputFile: File) {
    if (yiviAttributes != null) {
      const existingPdfBytes = await inputFile.arrayBuffer();
      const pdfDocument = await PDFDocument.load(existingPdfBytes);

      const signer: WalletSigner = new DummySigner();

      signer.sign(pdfDocument, yiviAttributes).then((pdfBytes) => {
        signedPdfBytes = pdfBytes;
        signedPdfName =
          inputFile.name.substring(0, inputFile.name.lastIndexOf(".")) +
          SIGNED_FILE_ADDITION;
        downloadPdf(signedPdfName, signedPdfBytes);
        signedDone = true;
      });
    }
  }

  async function runYivi() {
    getYiviData(selectedAttributes).then((result) => {
      yiviAttributes = result;
      yiviDone = true;
      progress = 100;
    });
  }

  /**
   * Obtain attribute data from Yivi.
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
  function downloadPdf(fileName: string, bytes: Uint8Array) {
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
      await signPdf(files[0]);
    } else {
      alert(
        "Please select a file and attributes and authenticate using Yivi first!",
      );
    }
  }

  /**
   * Logic for the "Next" button
   */
  async function btnNext() {
    selectAttributes();
    if (fileSelected && attributeSelected) {
      yiviActive = true;
      runYivi();
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

<div class="row" style="margin-top: 5%;">
  <div class="col-sm-5">
    {#if paramsGiven()}
      <div class="card request-card">
        <div
          class="card-container position-relative top-50 start-50 translate-middle"
        >
          <div class="card-body">
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
      </div>
    {:else}
      <img
        class="page-image"
        src="/img/img_sign.svg"
        alt="Signing a document"
      />
    {/if}
  </div>
  <div class="col-sm-7">
    <div class="position-relative top-50 end-0 translate-middle-y">
      <h1>
        <i class="bi bi-pencil-square page-icon"></i>
        Sign a document
      </h1>

      <p>
        Select a document and the personal data to sign with and create a
        signature using <a href="https://www.yivi.app/en" target="_blank"
          >Yivi</a
        >.
      </p>

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
              >Select a document to sign.</label
            >
            <input
              class="form-control"
              accept="application/pdf"
              type="file"
              bind:files
            />
          </div>
          <h2 style="margin-top: 30px;">Select personal data</h2>
          <label for="attr-checks" class="form-label"
            >Select the personal data you want to sign with. A signature will
            always contain the date and time.</label
          >
          {#if !attributeSelected && fileSelected}
            <div id="attr-checks">
              <div class="mb-3 form-check form-check-inline">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="checkName"
                  bind:checked={nameChecked}
                />
                <label class="form-check-label" for="checkName">Name</label>
              </div>
              <div class="mb-3 form-check form-check-inline">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="checkMail"
                  bind:checked={mailChecked}
                />
                <label class="form-check-label" for="checkMail">Email</label>
              </div>
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
                <label class="form-check-label" for="checkName">Name</label>
              </div>
              <div class="mb-3 form-check form-check-inline">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="checkMail"
                  disabled
                  bind:checked={mailChecked}
                />
                <label class="form-check-label" for="checkMail">Email</label>
              </div>
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
            </div>
            <div class="form-text">
              The document's signature will be based on the personal data you
              select. You can find out more on this in <a href="/about">about</a
              >.
            </div>
          {/if}
        {/if}
        {#if !signedDone && fileSelected && attributeSelected && yiviActive && !yiviDone}
          <div class="row">
            <div class="yivi-text col">
              <h2>Prove your identity</h2>
              <p>
                Now that you have selected your file and personal data, you have
                to prove these are correct using <a
                  href="https://www.yivi.app/en"
                  target="_blank">Yivi</a
                >.
              </p>
              <h3>How do I do this?</h3>
              {#if isMobile}
                <p>
                  Click the "Open Yivi app" button and follow the instructions
                  in the Yivi app to continue. <br />
                  <b>Alternatively</b>, you can click "Show QR code" and use the
                  Yivi app on another device to scan the QR-code.
                </p>
              {:else}
                <p>Use the Yivi app on your smartphone to scan the QR-code.</p>
              {/if}
              <p>
                Don't have the Yivi app? You can get it
                <a href="https://www.yivi.app/en/download" target="_blank"
                  >here</a
                >. Follow the instructions in the Yivi app to continue.
              </p>
            </div>
            <div class="yivi-web-form col" id="yivi-web-form"></div>
          </div>
        {/if}
        {#if !signedDone && yiviDone}
          <h2>Ready to sign!</h2>
          <p>Your document will be signed using the following personal data:</p>
          {#if yiviAttributes != null}
            {#each yiviAttributes as attribute}
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
          {/if}
        {/if}
        {#if signedDone}
          <h2 class="text-success">
            <i class="bi bi-check-circle"></i>
            Done!
          </h2>
          You can find the signed file in your downloads folder.
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
            class="btn btn-primary btn-sign"
            type="button"
            onclick={btnResetClick}
            ><i class="bi bi-plus-lg btn-sign-icon"></i>Sign another file</button
          >
          <button
            class="btn btn-primary btn-sign"
            type="button"
            onclick={btnDownloadAgainClick}
            ><i class="bi bi-download btn-sign-icon"></i>Download again</button
          >
        {/if}
      </div>

      <div class="progress" role="progressbar" aria-label="Progress">
        <div class="progress-bar" style="width: {progress}%"></div>
      </div>
      <div class="progress-label-div row">
        <div class="progress-label text-wrap col text-begin">
          Select file & personal data
        </div>
        <div class="progress-label text-wrap col text-center">
          Prove your identity
        </div>
        <div class="progress-label text-wrap col text-end">Sign file</div>
      </div>
    </div>
  </div>
</div>

<!-- CSS specific to page -->

<style>
  h1 {
    margin-bottom: 50px;
  }
  .page-image {
    margin-top: 20px;
  }
  .btn-sign {
    margin-right: 10px;
  }
  .btn-sign-div {
    margin-top: 30px;
  }
  .btn-sign-icon {
    margin-right: 7px;
  }
  .request-card {
    margin-top: 2%;
    margin-right: 10%;
    height: 100%;
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
  .progress {
    margin-top: 30px;
  }
  .progress-label-div {
    padding-top: 10px;
  }
  .progress-label {
    width: 33%;
    font-weight: 600;
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
  .card-container {
    width: 90%;
  }
  .yivi-web-form {
    margin-left: 10px;
    margin-right: 10px;
  }
</style>
