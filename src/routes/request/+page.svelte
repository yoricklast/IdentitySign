<script lang="ts">
  import { fade } from "svelte/transition";

  let files = $state<FileList>();

  let name = $state(false);
  let mail = $state(false);
  let address = $state(false);

  let request = $state("");
  let link = "";

  function btnGenerateClick() {
    if (!files || files.length === 0) {
      alert("No file selected!");
      return;
    }
    const file = files[0];
    if (file.type != "application/pdf") {
      alert("The selected file is not a PDF!");
    } else {
      let request_message = `Hi! Could you please sign file "${file.name}" with IdentitySign using the link below:\n`;
      let request_end = "\nThank you!";
      link = `${window.location.origin}/sign?`;
      if (name) {
        link = link + "&name=true";
      }
      if (mail) {
        link = link + "&mail=true";
      }
      if (address) {
        link = link + "&address=true";
      }
      if (file.name != null) {
        link = link + `&filename=${file.name}`;
      }
      request = request_message + link + request_end;
    }
  }

  function btnCopyClick() {
    navigator.clipboard.writeText(request);
  }

  function btnCopyLinkClick() {
    navigator.clipboard.writeText(link);
  }

  function btnClearClick() {
    location.reload();
  }
</script>

<div class="row flex-wrap-reverse" style="margin-top: 5%;">
  <div class="col-lg-5 col-md-8 col-sm-8">
    <img
      class="page-image position-relative top-0 start-0 pt-5"
      src="/img/img_request.svg"
      alt="Verifying a document"
    />
  </div>
  <div class="col-lg-7">
    <div class="position-relative top-50 end-0 translate-middle-y">
      <h1>
        <i class="bi bi-envelope-check page-icon"></i>
        Request a signature
      </h1>
      <p class="main-text">
        Create a signature request link to share by email.
      </p>
      <div class="mb-3">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Document</h4>
            <label for="formFile" class="form-label"
              >Select a document you want the other person to sign.</label
            >
            <input
              class="form-control"
              accept="application/pdf"
              type="file"
              bind:files
            />
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Personal data</h4>
            <label for="attr-checks" class="form-label"
              >Select the personal data you want the other person to sign with.</label
            >
            <div id="attr-checks">
              <div class="mb-3 form-check form-check-inline">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="checkName"
                  bind:checked={name}
                />
                <label class="form-check-label" for="checkName">Name</label>
              </div>
              <div class="mb-3 form-check form-check-inline">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="checkMail"
                  bind:checked={mail}
                />
                <label class="form-check-label" for="checkMail">Email</label>
              </div>
              <div class="mb-3 form-check form-check-inline">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="checkAddress"
                  bind:checked={address}
                />
                <label class="form-check-label" for="checkAddress"
                  >Address</label
                >
              </div>
              <div class="form-text">
                Signatures will always contain the date and time of signing.
              </div>
            </div>
          </div>
        </div>

        {#if !files || (!name && !mail && !address)}
          <button
            type="submit"
            id="btn-generate-disabled"
            class="btn btn-primary btn-generate"
            disabled>Generate request</button
          >
        {:else}
          <div class="d-flex gap-4">
            <button
              type="submit"
              class="btn btn-primary btn-generate"
              onclick={btnGenerateClick}>Generate request</button
            >
            {#if request != ""}
              <p class="btn-generate mb-0 align-self-center" in:fade>
                <span class="bi bi-arrow-down-circle-fill me-2"></span>See
                request below
              </p>
            {/if}
          </div>
        {/if}
      </div>

      {#if request != ""}
        <div class="mb-3 request">
          <label for="request-textarea" class="form-label">
            Please note: this request does <b>not</b> include the document itself!
          </label>
          <textarea
            class="form-control"
            id="request-textarea"
            rows="3"
            bind:value={request}
            disabled
          ></textarea>
          <div style="margin-top: 5px;">
            <button
              type="button"
              class="btn btn-light mt-2"
              onclick={btnCopyClick}
              ><i class="bi bi-clipboard btn-icon"></i>Copy to clipboard</button
            >
            <button
              type="button"
              class="btn btn-light mt-2"
              style="margin-right: 5px;"
              onclick={btnCopyLinkClick}
              ><i class="bi bi-link-45deg btn-icon"></i>Copy link only</button
            >
            <button
              type="button"
              class="btn btn-primary mt-2"
              onclick={btnClearClick}
              ><i class="bi bi-plus-lg btn-icon"></i>New request</button
            >
          </div>
          <h5 class="verify-warning text-primary">
            <i class="bi bi-exclamation-circle"></i>
            Verify the signature using IdentitySign before trusting a document you
            receive!
          </h5>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  h1 {
    margin-bottom: 30px;
  }
  .verify-warning {
    margin-top: 20px;
  }
  .form-check {
    font-size: 18px;
  }
  .btn-generate {
    margin-top: 10px;
  }
  .request {
    margin-top: 20px;
  }
  .btn-icon {
    margin-right: 5px;
  }
  .card {
    margin-bottom: 15px;
  }
</style>
