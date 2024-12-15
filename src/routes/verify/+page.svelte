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
  let signatureAttributes = $derived.by(() => {
    if (sig && sig.attributes) {
      return [
        {
          name: "name",
          value: sig.attributes.find(
            (x) => x.attributeType == WalletAttributeType.Name,
          )?.value,
          trust: personTrust,
        },
        {
          name: "address",
          value: sig.attributes.find(
            (x) => x.attributeType == WalletAttributeType.Address,
          )?.value,
          trust: addressTrust,
        },
        {
          name: "email",
          value: sig.attributes.find(
            (x) => x.attributeType == WalletAttributeType.Email,
          )?.value,
          trust: emailTrust,
        },
      ].filter((x) => x.value !== undefined);
    }
  });

  let options = ["Yes", "No", "Not sure"];

  let personTrust = $state<String>();
  let addressTrust = $state<String>();
  let emailTrust = $state<String>();
  let alertData = $derived.by(() => {
    if (
      signatureAttributes?.filter((x) => x.trust !== undefined).length ==
      signatureAttributes?.length
    ) {
      if (
        personTrust === "No" ||
        addressTrust === "No" ||
        emailTrust === "No"
      ) {
        const noAttributes = signatureAttributes
          ?.filter((x) => x.trust === "No")
          .map((x) => x.name)
          .join(", ");
        return { type: "danger", info: noAttributes };
      } else if (
        personTrust === "Not sure" ||
        addressTrust === "Not sure" ||
        emailTrust === "Not sure"
      ) {
        const notSureAttributes = signatureAttributes
          ?.filter((x) => x.trust === "Not sure")
          .map((x) => x.name)
          .join(", ");
        return { type: "warning", info: notSureAttributes };
      } else {
        const allAttributes = signatureAttributes
          ?.map((x) => x.name)
          .join(", ");
        return { type: "primary", info: allAttributes };
      }
    }
  });

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
                      // Reset trust values
                      personTrust = undefined;
                      addressTrust = undefined;
                      emailTrust = undefined;
                      console.log(`Length: ${signatureAttributes?.length}`);
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

{#snippet personAnswers(label: any)}
  <div class="form-check">
    <input
      class="form-check-input"
      type="radio"
      name="flexRadioName"
      id={label}
      bind:group={personTrust}
      value={label}
    />
    <label class="form-check-label" for={label}> {label} </label>
  </div>
{/snippet}
{#snippet addressAnswers(label: any)}
  <div class="form-check">
    <input
      class="form-check-input"
      type="radio"
      name="flexRadioAddress"
      id={label}
      bind:group={addressTrust}
      value={label}
    />
    <label class="form-check-label" for={label}> {label} </label>
  </div>
{/snippet}
{#snippet emailAnswers(label: any)}
  <div class="form-check">
    <input
      class="form-check-input"
      type="radio"
      name="flexRadioEmail"
      id={label}
      bind:group={emailTrust}
      value={label}
    />
    <label class="form-check-label" for={label}> {label} </label>
  </div>
{/snippet}

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
            {#if alertData}
              {#if alertData.type === "danger"}
                <i class="bi bi-x-octagon"></i>
              {:else if alertData.type === "warning"}
                <i class="bi bi-exclamation-triangle"></i>
              {:else}
                <i class="bi bi-search"></i>
              {/if}
            {:else}
              <i class="bi bi-search"></i>
            {/if}
            <br />
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
          {#if sig && sig.attributes}
            <div class="container signature-details">
              <h3 class="attribute-heading">Signed with:</h3>
              {#each sig.attributes as attribute}
                <div class="row row-cols-2">
                  <div class="col-8">
                    <div class="card attribute-card">
                      <div class="card-header">
                        {#if attribute.attributeType == WalletAttributeType.Name}
                          <i class="bi bi-person card-icon"></i><b>Name</b>
                        {:else if attribute.attributeType == WalletAttributeType.Address}
                          <i class="bi bi-mailbox card-icon"></i><b>Address</b>
                        {:else if attribute.attributeType == WalletAttributeType.Email}
                          <i class="bi bi-envelope-at card-icon"></i><b>Email</b
                          >
                        {/if}
                      </div>
                      <div class="card-body">
                        <p class="attribute-value">
                          {attribute.value.toString()}
                        </p>
                        <h6>
                          <i class="bi bi-question-circle"></i>
                          What does this mean?
                        </h6>
                        {#if attribute.attributeType == WalletAttributeType.Name}
                          <p class="explainer">
                            The document was signed by a person or organization
                            with this name.
                          </p>
                        {:else if attribute.attributeType == WalletAttributeType.Address}
                          <p class="explainer">
                            The document was signed by a person or organization
                            registered at this address.
                          </p>
                        {:else if attribute.attributeType == WalletAttributeType.Email}
                          <p class="explainer">
                            The document was signed by a person or organization
                            that owns this email address.
                          </p>
                        {/if}
                      </div>
                    </div>
                  </div>
                  <div class="col-4">
                    {#if attribute.attributeType == WalletAttributeType.Name}
                      <p class="question">Do you trust this person?</p>
                      {#each options as label}
                        {@render personAnswers(label)}
                      {/each}
                    {:else if attribute.attributeType == WalletAttributeType.Address}
                      <p class="question">Do you trust this address?</p>
                      {#each options as label}
                        {@render addressAnswers(label)}
                      {/each}
                    {:else if attribute.attributeType == WalletAttributeType.Email}
                      <p class="question">Do you trust this email?</p>
                      {#each options as label}
                        {@render emailAnswers(label)}
                      {/each}
                    {/if}
                  </div>
                </div>
              {/each}
              {#if alertData}
                <div class="row justify-content-end">
                  <div class="col-4 alert alert-{alertData.type}" role="alert">
                    {#if alertData.type === "danger"}
                      <strong
                        >This document was not signed by someone you trust!</strong
                      > <br />
                      You marked {alertData.info} as not trusted. <br />
                      Do not trust it solely because of this signature!
                    {:else if alertData.type === "warning"}
                      Be careful with trusting documents without a trusted
                      signature! <br />
                      You marked {alertData.info} as having uncertain trust.
                      <br />
                      Are the assurances of this person enough?
                    {:else if alertData.type === "primary"}
                      This document was signed by someone you <strong
                        >trust</strong
                      >! <br />
                      You marked all given signature details: {alertData.info} as
                      trustworthy.
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        {/if}
        {#if !sigValid && sigFound}
          <h2 class="validity invalid">
            <i class="bi bi-x-circle-fill"></i><br />
            Signature invalid!
          </h2>
          <p class="validity-text">
            This document contains an invalid signature. Do <b>NOT</b> trust this
            document!
          </p>
        {/if}
        {#if !sigFound}
          <h2 class="validity notfound">
            <i class="bi bi-exclamation-triangle-fill"></i><br />
            No signature found!
          </h2>
          <p class="validity-text">
            IdentitySign could not find a signature in this document. Verify
            that it has indeed been signed using IdentitySign.
          </p>
        {/if}
      {/if}
    </div>
  </div>
</div>

<style>
  h6 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 2px;
  }
  .question {
    margin-bottom: 0.5rem;
    font-weight: bold;
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
  }
</style>
