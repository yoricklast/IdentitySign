<script lang="ts">
  // Use PDF.js for reading PDF files
  import * as PDFjs from "pdfjs-dist";
  import type { WalletSigner } from "../../scripts/wallet-signer";
  import { DUMMY_SIG_PREFIX, DummySigner } from "../../scripts/dummy-signer";
  import type { Signature } from "../../scripts/signature";
  import { WalletAttributeType } from "../../scripts/wallet-attribute";

  // Get PDF.js worker from CDN, as using the one provided by the NPM package seems to cause issues in TypeScript
  // https://github.com/mozilla/pdf.js#including-via-a-cdn
  PDFjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFjs.version}/build/pdf.worker.mjs`;

  let files = $state<FileList>();
  let sigValid = $state<boolean>();
  let sigFound = $state<boolean>();
  // Prevents showing sigValid status before processing is done
  let processDone = $state(false);
  let sig = $state<Signature>();
  let transitionDone = $state(false);

  let progress = $state(0);

  function processFile(): void {
    const signer: WalletSigner = new DummySigner();
    processDone = false;
    sigValid = false;
    sigFound = false;
    if (!files || files.length === 0) {
      alert("No file selected!");
      return;
    }
    const file = files[0];
    if (file.type != "application/pdf") {
      alert("The selected file is not a PDF!");
    } else {
      console.log(
        `${file.name}: ${file.size} bytes, type: ${file.type}, last modified: ${file.lastModified}`,
      );
      file.arrayBuffer().then((value) => {
        PDFjs.getDocument(value).promise.then((document) => {
          document.getPage(document.numPages).then((page) => {
            page.getTextContent().then((text) => {
              text.items.forEach((x) => {
                let itemValue = Object.values(x)[0];
                if (typeof itemValue == "string" && itemValue !== "") {
                  // Prevent unnecessary checking when sig prefix is not present (change when no longer using dummy signatures!)
                  if (itemValue.includes(DUMMY_SIG_PREFIX)) {
                    sigFound = true;
                    if (signer.check(itemValue)) {
                      sig = signer.decode(itemValue);
                      sigValid = true;
                      transitionDone = false;
                    }
                  }
                }
              });
              processDone = true;
              console.log(`Check done, sig validity: ${sigValid}`);
            });
          });
        });
      });
    }
  }
</script>

<div class="row" style="margin-top: 7%;">
  <div class="col-sm-5">
    <img
      class="page-image"
      src="/img/img_check.svg"
      alt="Verifying a document"
    />
  </div>
  <div class="col-sm-7">
    <div class="position-relative top-50 end-0 translate-middle-y">
      <h1 style="margin-bottom: 30px;">
        <i class="bi bi-file-earmark-check page-icon"></i>
        Verify a document's signature
      </h1>

      <div class="infoblock rounded border">
        <h2>Select document</h2>
        <div class="mb-3 file-select">
          <label for="formFile" class="form-label"
            >Select a document to verify its signature.</label
          >
          <input
            class="form-control"
            accept="application/pdf"
            type="file"
            bind:files
            onchange={processFile}
          />
        </div>
        <!-- {#if !signedDone && fileSelected && attributeSelected && yiviActive && !yiviDone}
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
              <p>
                <b>If you are on a laptop or desktop</b> then use the Yivi app
                on your smartphone to scan the QR-code. Don't have the Yivi app?
                You can get it
                <a href="https://www.yivi.app/en/download" target="_blank"
                  >here</a
                >. Follow the instructions in the Yivi app to continue.
              </p>
              <p>
                <b>If you are on a mobile device</b> then click the "open Yivi app"
                button. Follow the instructions in the Yivi app to continue.
              </p>
            </div>
            <div class="yivi-web-form col" id="yivi-web-form"></div>
          </div>
        {/if} -->
        <!-- {#if !signedDone && yiviDone}
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
        {/if} -->
      </div>

      <div class="progress" role="progressbar" aria-label="Progress">
        <div class="progress-bar" style="width: {progress}%"></div>
      </div>
      <div class="progress-label-div row">
        <div class="progress-label text-wrap col text-begin">Select file</div>
        <div class="progress-label text-wrap col text-center">
          Check signature details
        </div>
        <div class="progress-label text-wrap col text-end">Verify file</div>
      </div>
    </div>
  </div>
</div>

<style>
  /* h6 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 2px;
  }
  .explainer {
    font-size: 14px;
  }
  .attribute-value {
    font-weight: 500;
    color: var(--bs-emphasis-color);
  }
  .attribute-heading {
    color: var(--bs-secondary);
  }
  .validity {
    text-align: center;
    margin-top: 50px;
  }
  .validity-text {
    text-align: center;
  }
  .valid {
    color: var(--bs-emphasis-color);
  }
  .invalid {
    color: var(--bs-danger);
  }
  .notfound {
    color: var(--bs-warning);
  }
  .signature-details {
      margin-top: 50px;
    }
  .file-select {
    margin-top: 50px;
  }
  .helplink {
    text-decoration: none;
  } */
  /* .animateInput {
      animation-name: slideLeft;
      animation-duration: 2s;
      animation-timing-function: ease;
      animation-fill-mode: both;
      animation-play-state: paused;
    }
  
    @keyframes slideLeft {
      from {
        left: 50%;
      }
      to {
        left: 0%;
      }
    }
  
    @keyframes changeFlex {
      from {
        flex-direction: row;
        align-items: center;
      }
      to {
        flex-direction: column;
        align-items: start;
      }
    } */
</style>
