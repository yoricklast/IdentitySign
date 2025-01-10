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

<!-- With animation but overlapping -->
<!-- <div
  class="position-relative"
  style="{processDone
    ? 'margin-top: 0%;'
    : 'margin-top: 7%;'} transition: margin-top 2s ease;"
>
  <div class="col-sm-5">
    <img
      class="{processDone ? 'w-50' : 'w-100'} pe-5"
      style="transition: width 0s ease;"
      src="/img/img_check.svg"
      alt="Verifying a document"
    />
    <div
      class="position-absolute top-0 mt-5 animateInput"
      style={processDone ? "animation-play-state: running;" : ""}
      onanimationend={() => (animationDone = true)}
    >
      <h1 style="margin-bottom: 30px;">
        <i class="bi bi-file-earmark-check page-icon"></i>
        Verify a document's signature
      </h1>
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
        {#if processDone}
          {#if sigValid}
            <h2 class="validity valid">
              <i class="bi bi-search"></i><br />
              Signature found…
            </h2>
            <p class="validity-text">
              <b
                >Verify the personal data below before trusting this document!</b
              >
            </p>
            <p class="validity-text">
              <a href="/help/#whentotrust" target="_blank" class="helplink">
                <i class="bi bi-question-circle"></i>
                When should I not trust a document?
              </a>
            </p>
          {/if}
        {/if}
      </div>
    </div>
  </div>
  <div class="col-md-7 offset-md-5">
    {#if processDone && animationDone}
      {#if sigValid}
        {#if sig && sig.attributes}
          <div class="container">
            <h3 class="attribute-heading">Signed with:</h3>
            {#each sig.attributes as attribute}
              <div class="card attribute-card">
                <div class="card-header">
                  {#if attribute.attributeType == WalletAttributeType.Name}
                    <i class="bi bi-person card-icon"></i><b>Name</b>
                  {:else if attribute.attributeType == WalletAttributeType.Address}
                    <i class="bi bi-mailbox card-icon"></i><b>Address</b>
                  {:else if attribute.attributeType == WalletAttributeType.Email}
                    <i class="bi bi-envelope-at card-icon"></i><b>Email</b>
                  {/if}
                </div>
                <div class="card-body">
                  <p class="attribute-value">{attribute.value.toString()}</p>
                  <h6>
                    <i class="bi bi-question-circle"></i>
                    What does this mean?
                  </h6>
                  {#if attribute.attributeType == WalletAttributeType.Name}
                    <p class="explainer">
                      The document was signed by a person or organization with
                      this name.
                    </p>
                  {:else if attribute.attributeType == WalletAttributeType.Address}
                    <p class="explainer">
                      The document was signed by a person or organization
                      registered at this address.
                    </p>
                  {:else if attribute.attributeType == WalletAttributeType.Email}
                    <p class="explainer">
                      The document was signed by a person or organization that
                      owns this email address.
                    </p>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      {/if}
      {#if !sigValid && sigFound}
        <h2 class="validity invalid">
          <i class="bi bi-x-circle-fill"></i><br />
          Signature invalid!
        </h2>
        <p class="validity-text">
          This document contains an invalid signature. Do <b>NOT</b> trust this document!
        </p>
      {/if}
      {#if !sigFound}
        <h2 class="validity notfound">
          <i class="bi bi-exclamation-triangle-fill"></i><br />
          No signature found!
        </h2>
        <p class="validity-text">
          IdentitySign could not find a signature in this document. Verify that
          it has indeed been signed using IdentitySign.
        </p>
      {/if}
    {/if}
  </div>
</div> -->

<!-- No transition/animation, wip for nonvalid signatures -->
<!-- <div
  class="row align-items-center justify-content-between"
  style={processDone && sigValid ? "margin-top: 0%;" : "margin-top: 7%;"}
>
  <div class="col-md-5">
    <img
      class="{processDone && sigValid ? 'w-50' : 'w-100'} pe-5"
      src="/img/img_check.svg"
      alt="Verifying a document"
    />
  </div>
  {#if processDone && sigValid}
    <div class="w-100"></div>
  {/if}
  <div
    class="col-md-auto {processDone && sigValid ? 'align-self-start' : ''}"
    ontransitionend={() => (animationDone = true)}
  >
    <h1 style="margin-bottom: 30px;">
      <i class="bi bi-file-earmark-check page-icon"></i>
      Verify a document's signature
    </h1>
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
  </div>
  {#if processDone}
    {#if sigValid}
      {#if sig && sig.attributes}
        <div class="col-md">
          <h3 class="attribute-heading">Signed with:</h3>
          {#each sig.attributes as attribute}
            <div class="card attribute-card">
              <div class="card-header">
                {#if attribute.attributeType == WalletAttributeType.Name}
                  <i class="bi bi-person card-icon"></i><b>Name</b>
                {:else if attribute.attributeType == WalletAttributeType.Address}
                  <i class="bi bi-mailbox card-icon"></i><b>Address</b>
                {:else if attribute.attributeType == WalletAttributeType.Email}
                  <i class="bi bi-envelope-at card-icon"></i><b>Email</b>
                {/if}
              </div>
              <div class="card-body">
                <p class="attribute-value">{attribute.value.toString()}</p>
                <h6>
                  <i class="bi bi-question-circle"></i>
                  What does this mean?
                </h6>
                {#if attribute.attributeType == WalletAttributeType.Name}
                  <p class="explainer">
                    The document was signed by a person or organization with
                    this name.
                  </p>
                {:else if attribute.attributeType == WalletAttributeType.Address}
                  <p class="explainer">
                    The document was signed by a person or organization
                    registered at this address.
                  </p>
                {:else if attribute.attributeType == WalletAttributeType.Email}
                  <p class="explainer">
                    The document was signed by a person or organization that
                    owns this email address.
                  </p>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
    {#if !sigValid && sigFound}
      <h2 class="validity invalid">
        <i class="bi bi-x-circle-fill"></i><br />
        Signature invalid!
      </h2>
      <p class="validity-text">
        This document contains an invalid signature. Do <b>NOT</b> trust this document!
      </p>
    {/if}
    {#if !sigFound}
      <h2 class="validity notfound">
        <i class="bi bi-exclamation-triangle-fill"></i><br />
        No signature found!
      </h2>
      <p class="validity-text">
        IdentitySign could not find a signature in this document. Verify that it
        has indeed been signed using IdentitySign.
      </p>
    {/if}
  {/if}
</div> -->

<!-- Flipped base layout, works as intended but with workarounds -->
<div class="row" style="margin-top: 7%;">
  <div
    class="col-sm {processDone && sigValid
      ? 'align-self-start'
      : 'align-self-center'}"
  >
    <h1 style="margin-bottom: 30px;">
      <i class="bi bi-file-earmark-check page-icon"></i>
      Verify a document's signature
    </h1>
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
    {#if processDone}
      {#if sigValid}
        <h2 class="validity valid">
          <i class="bi bi-search"></i><br />
          Signature found…
        </h2>
        <p class="validity-text">
          <b>Verify the personal data below before trusting this document!</b>
        </p>
        <p class="validity-text">
          <a href="/help/#whentotrust" target="_blank" class="helplink">
            <i class="bi bi-question-circle"></i>
            When should I not trust a document?
          </a>
        </p>
      {/if}
      {#if !sigValid && sigFound}
        <h2 class="validity invalid">
          <i class="bi bi-x-circle-fill"></i><br />
          Signature invalid!
        </h2>
        <p class="validity-text">
          This document contains an invalid signature. Do <b>NOT</b> trust this document!
        </p>
      {/if}
      {#if !sigFound}
        <h2 class="validity notfound">
          <i class="bi bi-exclamation-triangle-fill"></i><br />
          No signature found!
        </h2>
        <p class="validity-text">
          IdentitySign could not find a signature in this document. Verify that
          it has indeed been signed using IdentitySign.
        </p>
      {/if}
    {/if}
  </div>
  <div
    class="col-sm-5"
    style={processDone && sigValid
      ? "width: 55%; transition: width 1s ease;"
      : "transition: all 0s;"}
    ontransitionend={() => (transitionDone = true)}
  >
    <img
      class={processDone && sigValid
        ? "position-absolute end-0 z-n1 opacity-75"
        : "page-image"}
      style={processDone && sigValid
        ? "width: 30%; top: 10%; transition: all 1s ease, width 0s;"
        : "top: 20%; right: 10%; transition: all 0s;"}
      src="/img/img_check.svg"
      alt="Verifying a document"
    />
    {#if processDone && sigValid && transitionDone}
      {#if sig && sig.attributes}
        <div class="container" style="backdrop-filter: blur(6px);">
          <h3 class="attribute-heading">Signed with:</h3>
          {#each sig.attributes as attribute}
            <div class="card attribute-card">
              <div class="card-header">
                {#if attribute.attributeType == WalletAttributeType.Name}
                  <i class="bi bi-person card-icon"></i><b>Name</b>
                {:else if attribute.attributeType == WalletAttributeType.Address}
                  <i class="bi bi-mailbox card-icon"></i><b>Address</b>
                {:else if attribute.attributeType == WalletAttributeType.Email}
                  <i class="bi bi-envelope-at card-icon"></i><b>Email</b>
                {/if}
              </div>
              <div class="card-body">
                <p class="attribute-value">{attribute.value.toString()}</p>
                <h6>
                  <i class="bi bi-question-circle"></i>
                  What does this mean?
                </h6>
                {#if attribute.attributeType == WalletAttributeType.Name}
                  <p class="explainer">
                    The document was signed by a person or organization with
                    this name.
                  </p>
                {:else if attribute.attributeType == WalletAttributeType.Address}
                  <p class="explainer">
                    The document was signed by a person or organization
                    registered at this address.
                  </p>
                {:else if attribute.attributeType == WalletAttributeType.Email}
                  <p class="explainer">
                    The document was signed by a person or organization that
                    owns this email address.
                  </p>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  h6 {
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
  /* .signature-details {
    margin-top: 50px;
  } */
  .file-select {
    margin-top: 50px;
  }
  .helplink {
    text-decoration: none;
  }
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
