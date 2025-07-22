<div class="row topmargin">
  <div class="col-md-7">
    <h1>Welcome to IdentitySign</h1>

    <p class="subtitle">
      Sign documents, verify signatures and request signatures from others using
      IdentitySign!
    </p>
    
    <div class="infoblock rounded border">
      <h2>
        <i class="bi bi-patch-check heading-icon"></i>Know who you are working
        with
      </h2>

      <p class="main-text infoblock-text">
        Use IdentitySign to sign PDF documents with your verified name, email or
        home address. This way, the recipient knows the document comes from you
        and no one else. Verify signatures with IdentitySign to know for sure
        who signed the document.
      </p>
    </div>

    <!-- TODO: Less text(Images)/ more focus on verfication&request step/ Maybe move to signing page? -->
    <div class="infoblock rounded border">
      <h2>
        <i class="bi bi-pencil-square heading-icon"></i>Sign documents in three
        simple steps
      </h2>

      <!-- prettier-ignore -->
      <div class="main-text infoblock-text">
        <ol>
          <li>Select a document and personal data to sign with</li>
          <li>Use the <a href="https://www.yivi.app/en">Yivi</a> app to prove who you are</li>
          <li>Sign your document with a verified name, email, or address</li>
        </ol>

        Get started with <a class="signlink" href="/sign">signing a document</a>
        or <a href="/verify">verifying a signature</a> now!
      </div>
    </div>

    <!-- TODO: Move to /about -->
    <div class="infoblock rounded border">
      <h2>
        <i class="bi bi-emoji-laughing heading-icon"></i>Available for free to
        everyone
      </h2>

      <p class="main-text infoblock-text">
        This application can be freely used by everyone! Its source code is <a
          href="https://github.com/yoricklast/IdentitySign"
          target="_blank">available</a
        > so that anyone can inspect it or make improvements!
      </p>
    </div>

    <div class="infoblock rounded border">
      <h2>
        <i class="bi bi-shield-shaded heading-icon"></i>Documents stay on your
        device
      </h2>

      <p class="main-text infoblock-text">
        Documents you select never leave your device, keeping them (and their
        content) private! Read more on this in <a href="/about">about.</a>
      </p>
    </div>

    <div class="infoblock rounded warning-block">
    <p class="infoblock-text main-text prototype-warning">
      This application is a prototype and has not been audited!
      It is meant solely for testing, evaluation, and research purposes.
    </p>
  </div>

  </div>
  <div class="col-sm-5">
    <img
      class="page-image-r position-relative topmargin pt-3"
      src="/img/img_document.svg"
      alt="Signed document"
    />
  </div>
</div>

<style>
  h5 {
    font-weight: 600;
    margin-top: 10px;
    margin-bottom: 3px;
  }
  a {
    text-decoration: none;
  }
  .heading-icon {
    margin-right: 20px;
  }
  .topmargin {
    margin-top: 5%;
  }
  .warning-block {
    border-style: solid;
    border-color: var(--bs-danger);
    background: none;
  }
  .prototype-warning {
    color: var(--bs-danger);
  }
</style>
