<script lang="ts">
  /*global APPLICATION_VERSION*/
  const version: string = APPLICATION_VERSION;
</script>

<div class="narrower position-relative start-50 translate-middle-x">
  <h1 style="margin-top: 10%;">
    <i class="bi bi-info-circle page-icon"></i>
    About IdentitySign
  </h1>

  <div class="infoblock rounded border">
    <h3>Application info</h3>
    <p class="version-text">
      <b>Version:</b>
      {version}
    </p>
    <p class="infoblock-text credits">
      <a href="/about/credit">Credits</a>
    </p>
  </div>

  <div class="infoblock rounded warning-block">
    <p class="infoblock-text main-text prototype-warning">
      Please note that this application is only a prototype and does not
      actually sign files using a cryptographic signature. It is meant solely
      for testing and research purposes.<br />
    </p>
    <p class="infoblock-text main-text prototype-warning warning-emph">
      Do NOT use this application for actually signing documents!
    </p>
  </div>

  <div class="infoblock rounded border">
    <h3>What is IdentitySign?</h3>

    <p class="main-text">
      IdentitySign is a free and open-source application for creating, verifying
      and requesting signatures on PDF documents. It aims to be easy to use and
      is available to everyone that wants or needs to work with signatures on
      PDF documents.
    </p>

    <p class="main-text">
      IdentitySign is a project developed by researchers from the <a
        class="text-reset"
        href="https://en.cs.uni-paderborn.de/its">Human-Centered IT Security</a
      >
      group at Paderborn University (Germany), and
      <a class="text-reset" href="https://ihub.ru.nl/">iHub</a> at Radboud University
      (The Netherlands).
    </p>

    <h3>Got any questions?</h3>

    <p class="main-text infoblock-text">
      Check out our <a href="/faq">frequently asked questions</a>, we might have
      already answered them for you!
    </p>
  </div>
</div>

<style>
  .warning-block {
    border-style: solid;
    border-color: var(--bs-danger);
    background: none;
  }
  .prototype-warning {
    color: var(--bs-danger);
  }
  .warning-emph {
    margin-top: 10px;
    font-weight: bold;
  }
  .version-text {
    margin-bottom: 0px;
  }
  .credits {
    margin-top: 5px;
    font-size: 14px;
  }
</style>
