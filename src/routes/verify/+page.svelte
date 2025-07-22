<script lang="ts">
  // Use PDF.js for reading PDF files
  import * as PDFjs from "pdfjs-dist";
  import type { WalletSignerCrypto } from "../../scripts/crypto/crypto-wallet-signer";
  import type { WalletSignerDummy } from "../../scripts/dummy/dummy-wallet-signer";
  import {
    ATTRIBUTES,
    PostGuardSigner,
  } from "../../scripts/crypto/postguard-signer";
  import {
    DUMMY_SIG_PREFIX,
    DummySigner,
  } from "../../scripts/dummy/dummy-signer";
  import { WalletAttributeType } from "../../scripts/wallet-attribute";
  import type {
    SignatureDummy,
    SignatureCrypto,
  } from "../../scripts/signature";
  import { fade } from "svelte/transition";
  import { POSTGUARD_FILE } from "../../scripts/crypto/Constants";
  import { getFriendlyAttributeName } from "../../scripts/ts-util";

  // Get PDF.js worker from CDN, as using the one provided by the NPM package seems to cause issues in TypeScript
  // https://github.com/mozilla/pdf.js#including-via-a-cdn
  PDFjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFjs.version}/build/pdf.worker.mjs`;

  const version = localStorage.getItem("productionVersion");

  let files = $state<FileList>();
  let sigValid = $state<boolean>();
  let sigFound = $state<boolean>();

  // Prevents showing sigValid status before processing is done
  let processDone = $state(false);
  let sigCrypto = $state<SignatureCrypto>();
  let sigDummy = $state<SignatureDummy>();

  /* For cryptographic signatures */
  let signatureAttributesCrypto = $derived.by(() => {
    if (sigCrypto && sigCrypto.attributes) {
      return [
        {
          name: "name",
          value: sigCrypto.attributes.find((x) => x.t == ATTRIBUTES[1])?.v,
          trust: personTrust,
        },
        {
          name: "email",
          value: sigCrypto.attributes.find((x) => x.t == ATTRIBUTES[0])?.v,
          trust: emailTrust,
        },
      ].filter((x) => x.value !== undefined);
    }
  });
  /* For dummy signatures */
  let signatureAttributesDummy = $derived.by(() => {
    if (sigDummy && sigDummy.attributes) {
      return [
        {
          name: "name",
          value: sigDummy.attributes.find(
            (x) => x.attributeType == WalletAttributeType.Name,
          )?.value,
          trust: personTrust,
        },
        {
          name: "address",
          value: sigDummy.attributes.find(
            (x) => x.attributeType == WalletAttributeType.Address,
          )?.value,
          trust: addressTrust,
        },
        {
          name: "email",
          value: sigDummy.attributes.find(
            (x) => x.attributeType == WalletAttributeType.Email,
          )?.value,
          trust: emailTrust,
        },
      ].filter((x) => x.value !== undefined);
    }
  });
  let signatureAttributes = $derived.by(() => {
    if (version == "0") {
      return signatureAttributesDummy;
    } else if (version == "1") {
      return signatureAttributesCrypto;
    }
  });

  let trustSet = $state<string[]>([]);
  let progress = $state(0);
  let options = [
    { label: "Yes", icon: '<i class="bi bi-check2"></i>' },
    { label: "No", icon: '<i class="bi bi-x"></i>' },
    { label: "Not sure", icon: '<i class="bi bi-question-lg"></i>' },
  ];

  let personTrust = $state<string>();
  let addressTrust = $state<string>();
  let emailTrust = $state<string>();

  let alertData = $state<string | undefined>();

  function setAlertData(): string | undefined {
    if (
      signatureAttributes?.filter((x) => x.trust !== undefined).length ==
      signatureAttributes?.length
    ) {
      if (
        personTrust === "No" ||
        addressTrust === "No" ||
        emailTrust === "No"
      ) {
        return "danger";
      } else if (
        personTrust === "Not sure" ||
        addressTrust === "Not sure" ||
        emailTrust === "Not sure"
      ) {
        return "warning";
      } else {
        return "primary";
      }
    }
  }

  function scrollToAlert(): void {
    const element = document.getElementById("alert-div");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  function setProgress(): void {
    signatureAttributes?.forEach((x) => {
      if (x.trust != undefined && !trustSet.includes(x.name)) {
        progress += 50 / signatureAttributes.length;
        trustSet.push(x.name);
      }
    });
    console.log(`AlerData: ${alertData}`);
    if (alertData !== setAlertData()) {
      if (alertData === undefined) {
        console.log("No alert data set, setting new alert data");
        alertData = setAlertData();
      }
      setTimeout(scrollToAlert, 100);
    }
    alertData = setAlertData();
  }

  function processFile(): void {
    if (version == "0") {
      processFileDummy();
    } else if (version == "1") {
      processFileCrypto();
    }
  }

  function processFileDummy(): void {
    const signer: WalletSignerDummy = new DummySigner();
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
        PDFjs.getDocument(value).promise.then((doc) => {
          doc.getPage(doc.numPages).then((page) => {
            page.getTextContent().then((text) => {
              text.items.forEach((x) => {
                let itemValue = Object.values(x)[0];
                if (typeof itemValue == "string" && itemValue !== "") {
                  // Prevent unnecessary checking when sig prefix is not present (change when no longer using dummy signatures!)
                  if (itemValue.includes(DUMMY_SIG_PREFIX)) {
                    sigFound = true;
                    if (signer.check(itemValue)) {
                      [sigDummy, sigValid] = signer.decode(itemValue);
                      // Reset trust values
                      personTrust = undefined;
                      addressTrust = undefined;
                      emailTrust = undefined;
                      trustSet = [];
                      console.log(`Length: ${signatureAttributes?.length}`);
                    }
                  }
                }
              });
              processDone = true;
              progress = 50;

              console.log(`Check done, sig validity: ${sigValid}`);
            });
          });
        });
      });
    }
  }

  function processFileCrypto(): void {
    const signer: WalletSignerCrypto = new PostGuardSigner();
    processDone = false;
    sigFound = false;
    sigValid = false;
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
        PDFjs.getDocument(value).promise.then((doc) => {
          doc
            .getAttachments()
            .then(async (attachments) => {
              if (attachments !== null) {
                for (const [name, attachment] of Object.entries(attachments)) {
                  if (name === POSTGUARD_FILE) {
                    const content = attachment.content;
                    await signer.check(content).then((hasSignature) => {
                      if (hasSignature) {
                        sigCrypto = signer.decode("not needed");
                        sigValid = true;
                        // Reset trust values
                        personTrust = undefined;
                        addressTrust = undefined;
                        emailTrust = undefined;
                        trustSet = [];
                        const element =
                          document.getElementById("attribute-list");
                        if (element) {
                          element.scrollIntoView({
                            behavior: "auto",
                            block: "center",
                          });
                        }
                      }
                    });
                  }
                }
                sigFound = true;
              }
            })
            .then(() => {
              processDone = true;
              progress = 50;
            });
        });
      });
    }
  }
</script>

{#snippet personAnswers(label: string)}
  <input
    class="btn-check"
    type="radio"
    name="RadioGroupName"
    id="{label}Person"
    value={label}
    autocomplete="off"
    onchange={setProgress}
    bind:group={personTrust}
  />
  <label
    class="btn questionnaire-button radio-group-{label}"
    for="{label}Person"
  >
    {label}
  </label>
{/snippet}
{#snippet addressAnswers(label: string)}
  <input
    class="btn-check"
    type="radio"
    name="RadioGroupAddress"
    id="{label}Address"
    value={label}
    autocomplete="off"
    onchange={setProgress}
    bind:group={addressTrust}
  />
  <label
    class="btn questionnaire-button radio-group-{label}"
    for="{label}Address"
  >
    {label}
  </label>
{/snippet}
{#snippet emailAnswers(label: string)}
  <input
    class="btn-check"
    type="radio"
    name="RadioGroupEmail"
    id="{label}Email"
    value={label}
    autocomplete="off"
    onchange={setProgress}
    bind:group={emailTrust}
  />
  <label
    class="btn questionnaire-button radio-group-{label}"
    for="{label}Email"
  >
    {label}
  </label>
{/snippet}

<div class="mx-auto">
  <!--   <div
    class="col-lg {processDone && sigValid
      ? 'align-self-start'
      : 'align-self-center'}"
  > -->
  <div class="sticky-top card border-invisible" style="z-index: 1000;">
    <div class="position-relative card-body w-75 mx-auto">
      <div class="spacer"></div>
      <div class="progress-label-div row">
        <div
          class="progress-label text-wrap position-absolute start-0 px-0 text-start align-self-end"
        >
          <i class="bi bi-1-circle"></i>
          Select document
        </div>
        <div
          class="progress-label text-wrap position-absolute start-50 translate-middle-x text-center align-self-end px-0"
        >
          <i class="bi bi-2-circle"></i>
          Check signature
        </div>
        <div
          class="progress-label text-wrap position-absolute end-0 text-end align-self-end px-0"
        >
          <i class="bi bi-3-circle"></i> <br class="d-sm-none d-block" /> Done
        </div>
      </div>
      <div class="progress" role="progressbar" aria-label="Progress">
        <div class="progress-bar" style="width: {progress}%"></div>
      </div>
    </div>
  </div>

  <div class="mx-auto w-75">
    <h1 style="margin-bottom: 35px;">
      <i class="bi bi-file-earmark-check page-icon"></i>
      Verify a document's signature
    </h1>
    <div class="mb-3 file-select">
      <label for="formFile" class="form-label"
        >Select a document to verify its signature.
        <span
          class="d-inline-block"
          data-bs-trigger="hover focus"
          data-bs-toggle="popover"
          data-bs-placement="right"
          data-bs-container="body"
          data-bs-content="Click on 'Browse...' and choose a signed PDF that you received from your device to check if it contains a valid IdentitySign signature."
        >
          <button
            type="button"
            class="btn btn-link mb-1"
            tabindex="0"
            aria-label="How to verify a document"
          >
            <i class="bi bi-question-circle"></i>
          </button>
        </span>
      </label>
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
          <i class="bi bi-search"></i>
          <br />
          Signature found…
        </h2>
        <p class="validity-text">
          Check who signed this document before trusting it.
        </p>
        <p class="validity-text">
          <a href="/help/trust" target="_blank" class="helplink">
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
    <div
      class="col-lg-5 {processDone && sigValid ? 'fill-space' : ''} "
      style={processDone && sigValid ? "width: 100%;" : ""}
    >
      {#if processDone && sigValid}
        {#if version == "0" && sigDummy && sigDummy.attributes}
          <div
            class="container-xl align-self-start"
            in:fade|global
            onintroend={() => {
              const element = document.getElementById("attribute-list");
              if (element) {
                element.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
          >
            <h3 id="attribute-list" class="attribute-heading">Signed with:</h3>
            {#each sigDummy.attributes as attribute}
              <div class="row row-cols-sm-1">
                <div class="col-xxl-6">
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
                <div class="col-xxl">
                  {#if attribute.attributeType == WalletAttributeType.Name}
                    <p class="question">
                      Was this document signed by the right person or
                      organization?
                    </p>
                    <div
                      class="btn-group"
                      role="group"
                      aria-label="Radio buttons for trust question of the name attribute"
                    >
                      {#each options as option}
                        {@render personAnswers(option.label, option.icon)}
                      {/each}
                    </div>
                  {:else if attribute.attributeType == WalletAttributeType.Address}
                    <p class="question">
                      Is this address owned by the right person or organization?
                    </p>
                    <div
                      class="btn-group"
                      role="group"
                      aria-label="Radio buttons for trust question of the address attribute"
                    >
                      {#each options as option}
                        {@render addressAnswers(option.label, option.icon)}
                      {/each}
                    </div>
                  {:else if attribute.attributeType == WalletAttributeType.Email}
                    <p class="question">
                      Is this the correct email address for the person or
                      organization who signed the document?
                    </p>
                    <div
                      class="btn-group"
                      role="group"
                      aria-label="Radio buttons for trust question of the email attribute"
                    >
                      {#each options as option}
                        {@render emailAnswers(option.label, option.icon)}
                      {/each}
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {:else if version == "1" && sigCrypto && sigCrypto.attributes}
          <div
            class="container-xl"
            in:fade|global
            onintroend={() => {
              const element = document.getElementById("attribute-list");
              if (element) {
                element.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
          >
            <h3 id="attribute-list" class="attribute-heading">Signed with:</h3>
            {#each sigCrypto.attributes as attribute}
              <div class="row row-cols-sm-1">
                <div class="col-xxl-6">
                  <div class="card attribute-card">
                    <div class="card-header">
                      {#if attribute.t === ATTRIBUTES[1]}
                        <i class="bi bi-person card-icon"></i><b
                          >{getFriendlyAttributeName(attribute.t)}</b
                        >
                      {:else if attribute.t === ATTRIBUTES[0]}
                        <i class="bi bi-envelope-at card-icon"></i><b
                          >{getFriendlyAttributeName(attribute.t)}</b
                        >
                      {/if}
                    </div>
                    <div class="card-body">
                      <p class="attribute-value">
                        {attribute.v?.toString()}
                      </p>
                      <h6>
                        <i class="bi bi-question-circle"></i>
                        What does this mean?
                      </h6>
                    </div>
                  </div>
                </div>
                <div class="col-xxl">
                  {#if attribute.t === ATTRIBUTES[1]}
                    <p class="question">
                      Was this document signed by the right person or
                      organization?
                    </p>
                    <div
                      class="btn-group"
                      role="group"
                      aria-label="Radio buttons for trust question of the name attribute"
                    >
                      {#each options as option}
                        {@render personAnswers(option.label, option.icon)}
                      {/each}
                    </div>
                  {:else if attribute.t === ATTRIBUTES[0]}
                    <p class="question">
                      Is this the correct email address for the person or
                      organization who signed the document?
                    </p>
                    <div
                      class="btn-group"
                      role="group"
                      aria-label="Radio buttons for trust question of the email attribute"
                    >
                      {#each options as option}
                        {@render emailAnswers(option.label, option.icon)}
                      {/each}
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    </div>
    <div id="alert-div">
      {#if alertData}
        <div class="alert alert-{alertData} mx-auto" role="alert">
          {#if alertData === "danger"}
            <strong>
              <i class="bi bi-exclamation-triangle-fill alert-icon"></i> This document
              should not be trusted!
            </strong><br />
            <hr />
            <p>
              You indicated that the document may have been signed by the wrong
              person or organization, or that relevant information (such as
              their name or email) is missing.
            </p>
            <p>
              You can use our
              <a href="/request" target="_blank"> signature request tool </a>
              to request a signature that contains this information.
            </p>
          {:else if alertData === "warning"}
            <strong
              ><i class="bi bi-exclamation-triangle-fill alert-icon"></i> You may
              need more information before trusting this document</strong
            ><br />
            <hr />
            <p>
              Before trusting this document, consider if you know enough about
              the signer. For example:
            </p>
            <ul>
              <li>Do you know who owns this email address?</li>
              <li>
                Does this person/organization have the authority to sign this
                document?
              </li>
              <li>Should someone else have signed the file?</li>
            </ul>
            <p>
              If you need additional information the signature doesn't contain
              yet (such as a name{version == "0"
                ? ", email or address"
                : "or email"}), use our
              <a href="/request" target="_blank"> signature request tool </a>
              to create a signature request with the information you need.
            </p>
          {:else if alertData === "primary"}
            <strong
              ><i class="bi bi-info-circle-fill alert-icon"></i> This document can
              most likely be trusted!</strong
            > <br />
            <hr />
            You indicated that this document was signed by the correct person or
            organization.
          {/if}
        </div>
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
    margin-bottom: 1.5rem;
    font-weight: bold;
  }
  .btn-group {
    width: 100%;
    margin-bottom: 2rem;
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
  .file-select {
    margin-top: 50px;
  }
  .helplink {
    text-decoration: none;
  }
  .alert {
    margin-top: 20px;
    max-width: 750px;
  }
  .alert-icon {
    font-size: 20px;
    margin-right: 5px;
  }
  .border-invisible {
    --bs-border-opacity: 0;
    border-color: rgba(
      var(--bs-success-rgb),
      var(--bs-border-opacity)
    ) !important;
  }

  .questionnaire-button {
    --bs-btn-bg: rgba(var(--bs-secondary-bg-rgb));
    --bs-btn-border-color: var(--bs-secondary);
    --bs-btn-disabled-color: var(--bs-secondary);
    --bs-btn-disabled-bg: transparent;
    --bs-btn-disabled-border-color: var(--bs-secondary);
  }
  .radio-group-Yes {
    --bs-btn-focus-shadow-rgb: 13, 110, 253;
    --bs-btn-active-color: var(--bs-primary-text-emphasis);
    --bs-btn-active-bg: var(--bs-primary-bg-subtle);
    --bs-btn-active-border-color: var(--bs-btn-active-color);
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  }
  .radio-group-No {
    --bs-btn-focus-shadow-rgb: 220, 53, 69;
    --bs-btn-active-color: var(--bs-danger-text-emphasis);
    --bs-btn-active-bg: var(--bs-danger-bg-subtle);
    --bs-btn-active-border-color: var(--bs-btn-active-color);
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  }
  .radio-group-Not /*sure*/ {
    --bs-btn-focus-shadow-rgb: 255, 193, 7;
    --bs-btn-active-color: var(--bs-warning-text-emphasis);
    --bs-btn-active-bg: var(--bs-warning-bg-subtle);
    --bs-btn-active-border-color: var(--bs-btn-active-color);
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  }

  @media (max-width: 992px) {
    .fill-space {
      width: 99.99% !important;
      padding-left: 0 !important;
    }
  }
  @media (max-width: 992px) {
    .small-image {
      width: 75% !important;
    }
  }
</style>
