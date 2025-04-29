<script lang="ts">
  // Use PDF.js for reading PDF files
  import * as PDFjs from "pdfjs-dist";
  import type { WalletSigner } from "../../scripts/wallet-signer";
  import { ATTRIBUTES, PostGuardSigner } from "../../scripts/postguard-signer";
  import type { Signature } from "../../scripts/signature";
  import { fade, fly } from "svelte/transition";
  import { POSTGUARD_FILE } from "../../scripts/Constants";

  // Get PDF.js worker from CDN, as using the one provided by the NPM package seems to cause issues in TypeScript
  // https://github.com/mozilla/pdf.js#including-via-a-cdn
  PDFjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFjs.version}/build/pdf.worker.mjs`;

  let small = $derived(window.innerWidth < 992);
  let x = $derived(small ? "35%" : "0");
  let y = $derived(small ? "0" : "35%");
  let files = $state<FileList>();
  let sigValid = $state<boolean>();
  let sigFound = $state<boolean>();
  // Prevents showing sigValid status before processing is done
  let processDone = $state(false);
  let sig = $state<Signature>();
  let transitionDone = $state(false);
  let imageVisible = $derived(!sigValid);

  let signatureAttributes = $derived.by(() => {
    if (sig && sig.attributes) {
      return [
        {
          name: "name",
          value: sig.attributes.find((x) => x.t == ATTRIBUTES[1])?.v,
          trust: personTrust,
        },
        {
          name: "address",
          value: sig.attributes.find((x) => x.t == ATTRIBUTES[2])?.v,
          trust: addressTrust,
        },
        {
          name: "email",
          value: sig.attributes.find((x) => x.t == ATTRIBUTES[0])?.v,
          trust: emailTrust,
        },
      ].filter((x) => x.value !== undefined);
    }
  });

  let trustSet = $state<string[]>([]);
  let progress = $state(0);
  let options = ["Yes", "No", "Not sure"];

  let personTrust = $state<string>();
  let addressTrust = $state<string>();
  let emailTrust = $state<string>();

  // Change to alertType only, if alert message changes permanently
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

  function setProgress(): void {
    signatureAttributes?.forEach((x) => {
      if (x.trust != undefined && !trustSet.includes(x.name)) {
        progress += 50 / signatureAttributes.length;
        trustSet.push(x.name);
      }
    });
  }

  function processFile(): void {
    const signer: WalletSigner = new PostGuardSigner();
    processDone = false;
    sigValid = false;
    sigFound = false;
    if (small) {
      transitionDone = true;
    } else {
      transitionDone = false;
    }
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
          document.getAttachments().then((attachments) => {
            for (const [name, attachment] of Object.entries(attachments)) {
              if (name === POSTGUARD_FILE) {
                const content = attachment.content;
                sigFound = true;
                signer.check(content).then((hasSignature) => {
                  if (hasSignature) {
                    sig = signer.decode("not needed");
                    sigValid = true;
                    // Reset trust values
                    personTrust = undefined;
                    addressTrust = undefined;
                    emailTrust = undefined;
                    trustSet = [];
                    processDone = true;
                    progress = 50;
                  }
                });
              }
            }
          });
        });
      });
    }
  }

  $effect(() => {
    console.log("Done:" + transitionDone);
  });
</script>

{#snippet personAnswers(label: string)}
  <div class="form-check">
    <input
      class="form-check-input"
      type="radio"
      name="flexRadioName"
      id={label}
      bind:group={personTrust}
      value={label}
      onchange={setProgress}
    />
    <label class="form-check-label" for={label}> {label} </label>
  </div>
{/snippet}
{#snippet addressAnswers(label: string)}
  <div class="form-check">
    <input
      class="form-check-input"
      type="radio"
      name="flexRadioAddress"
      id={label}
      bind:group={addressTrust}
      value={label}
      onchange={setProgress}
    />
    <label class="form-check-label" for={label}> {label} </label>
  </div>
{/snippet}
{#snippet emailAnswers(label: string)}
  <div class="form-check">
    <input
      class="form-check-input"
      type="radio"
      name="flexRadioEmail"
      id={label}
      bind:group={emailTrust}
      value={label}
      onchange={setProgress}
    />
    <label class="form-check-label" for={label}> {label} </label>
  </div>
{/snippet}

<div class="row" style="margin-top: 7%;">
  <div
    class="col-lg {processDone && sigValid
      ? 'align-self-start'
      : 'align-self-center'}"
  >
    <div class="position-relative">
      <div class="spacer"></div>
      <div class="progress-label-div row">
        <div
          class="progress-label text-wrap col position-absolute start-0 ps-0 text-start align-self-end"
        >
          <i class="bi bi-1-circle"></i> Select document
        </div>
        <div
          class="progress-label text-wrap col position-absolute start-50 translate-middle-x text-center align-self-end"
        >
          <i class="bi bi-2-circle"></i> Check signature
        </div>
        <div
          class="progress-label text-wrap col position-absolute end-0 text-end align-self-end pe-0"
        >
          <i class="bi bi-3-circle"></i> Done
        </div>
      </div>
      <div class="progress" role="progressbar" aria-label="Progress">
        <div class="progress-bar" style="width: {progress}%"></div>
      </div>

      <h1 style="margin-bottom: 35px; margin-top: 50px;">
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
        {#if sigValid && transitionDone}
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
  <div
    class="col-lg-5 ps-5 {processDone && sigValid ? 'fill-space' : ''} "
    style={processDone && sigValid
      ? "width: 55%; transition: width 0.5s ease;"
      : "transition: all 0s;"}
    ontransitionend={() => (transitionDone = true)}
  >
    {#if imageVisible}
      <img
        class="w-100 pt-5 small-image"
        in:fade={{ duration: 1000, delay: 100 }}
        src="/img/img_check.svg"
        alt="Verifying a document"
      />
    {/if}
    {#if processDone && sigValid && transitionDone}
      {#if sig && sig.attributes}
        <div
          class="container-xl"
          in:fly|global={{
            x,
            y,
            duration: 500,
            delay: 100,
          }}
        >
          <h3 class="attribute-heading">Signed with:</h3>
          {#each sig.attributes as attribute}
            <div class="row row-cols-sm-1">
              <div class="col-xxl-6">
                <div class="card attribute-card">
                  <div class="card-header">
                    {#if attribute.t === ATTRIBUTES[1]}
                      <i class="bi bi-person card-icon"></i><b>Fullname</b>
                    {:else if attribute.t === ATTRIBUTES[2]}
                      <i class="bi bi-mailbox card-icon"></i><b>Street</b>
                    {:else if attribute.t === ATTRIBUTES[0]}
                      <i class="bi bi-envelope-at card-icon"></i><b>Email</b>
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
                  {#each options as label}
                    {@render personAnswers(label)}
                  {/each}
                  <div class="mb-4"></div>
                {:else if attribute.t === ATTRIBUTES[2]}
                  <p class="question">
                    Is the person or organization who signed the document
                    located at this address?
                  </p>
                  {#each options as label}
                    {@render addressAnswers(label)}
                  {/each}
                  <div class="mb-4"></div>
                {:else if attribute.t === ATTRIBUTES[0]}
                  <p class="question">
                    Is this the correct email address for the person or
                    organization who signed the document?
                  </p>
                  {#each options as label}
                    {@render emailAnswers(label)}
                  {/each}
                  <div class="mb-4"></div>
                {/if}
              </div>
            </div>
          {/each}
          {#if alertData}
            <div class="row justify-content-center">
              <div class="alert alert-{alertData.type}" role="alert">
                {#if alertData.type === "danger"}
                  <strong>
                    <i class="bi bi-exclamation-triangle-fill alert-icon"></i> This
                    document should not be trusted!
                  </strong><br />
                  <hr />
                  <p>
                    You indicated that the document may have been signed by the
                    wrong person or organization, or the signer may have
                    forgotten to include relevant information (such as their
                    name or address).
                  </p>
                  <p>
                    You can use our
                    <a href="/request" target="_blank">
                      signature request tool
                    </a>
                    to request a signature that contains this information.
                  </p>
                {:else if alertData.type === "warning"}
                  <strong
                    ><i class="bi bi-exclamation-triangle-fill alert-icon"></i> You
                    may need more information before trusting this document</strong
                  ><br />
                  <hr />
                  <p>
                    Before trusting this document, consider if you know enough
                    about the signer. For example:
                  </p>
                  <ul>
                    <li>Do you know who owns this email address?</li>
                    <li>
                      Does this person/organization have the authority to sign
                      this document?
                    </li>
                    <li>Should someone else have signed the file?</li>
                    <li>
                      Do you need additional information (such as a name or
                      address) to be sure?
                    </li>
                  </ul>
                  <p>
                    If you have any doubts, use our
                    <a href="/request" target="_blank">
                      signature request tool
                    </a>
                    to request a signature that contains the contains the information
                    you need.
                  </p>
                {:else if alertData.type === "primary"}
                  <strong
                    ><i class="bi bi-info-circle-fill alert-icon"></i> This document
                    can most likely be trusted!</strong
                  > <br />
                  <hr />
                  You indicated that this document was signed by the correct person
                  or organization.
                {/if}
              </div>
            </div>
          {/if}
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
  @media (max-width: 992px) {
    .fill-space {
      width: 99.99% !important;
      transition: width 0s !important;
      padding-left: 0 !important;
    }
  }
  @media (max-width: 992px) {
    .small-image {
      width: 75% !important;
    }
  }
</style>
