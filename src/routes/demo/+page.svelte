<script lang="ts">
  import { issuePopup } from "../../scripts/yivi-issue";
  import { resolve } from "$app/paths";

  const version = localStorage.getItem("productionVersion");
</script>

<!-- TODO: Add Screenshots -->
<div class="narrower position-relative start-50 translate-middle-x">
  <!-- Setup -->
  <h1>Setup Yivi</h1>

  <p class="main-text">
    Let's get you started with setting up Yivi for use with IdentitySign! Please
    follow the steps below.
  </p>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-1-circle heading-icon"></i>
      Download and install Yivi
    </h2>

    <p class="main-text infoblock-text">
      If you haven't done so already, please download and install Yivi on your
      smartphone. You can find out where to download Yivi <a
        href="https://www.yivi.app/en/download"
        target="_blank">here</a
      >.
    </p>
  </div>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-2-circle heading-icon"></i>
      Add demo data to Yivi
    </h2>

    <p class="main-text infoblock-text">
      Clicking on the button below will show you a pop-up containing a QR-code
      which you can scan using the Yivi app on your smartphone. This will add
      the required personal data to your Yivi app.
    </p>

    <button class="btn btn-primary" onclick={issuePopup}>
      Add personal data
    </button>

    <p class="note infoblock-text">
      <i class="bi bi-exclamation-triangle"></i>
      Note that personal data would normally come from a trusted source such as a
      municipality. Using this data is only possible during this demo!
    </p>
  </div>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-check-circle heading-icon"></i>
      Done!
    </h2>

    <p class="main-text infoblock-text">
      That's it! You're now all set up to use IdentitySign! Check out some of
      its features by using the 'Signing a document' and 'Verifying a signature'
      section down below!
    </p>
  </div>

  <!-- Sign -->
  <h1>Signing a document</h1>

  <p class="main-text">
    IdentitySign lets you add an invisible signature to your documents such that
    others can verifiy if it has actually been issued by you. Let's go through
    the signing process step-by-step:
  </p>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-1-circle heading-icon"></i>
      Open the Sign page
    </h2>

    <p class="main-text infoblock-text">
      You can find the page <a href={resolve("/sign")} target="_blank">here</a>.
      It will open in a new browser tab so you can come back to keep track of
      the following steps.
    </p>
  </div>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-2-circle heading-icon"></i>
      Upload a document
    </h2>

    <p class="main-text infoblock-text">
      Clicking on the button below will download a PDF document you can use to
      test the signing feature.
    </p>

    <!-- TODO: Add PDF -->
    <button class="btn btn-primary"> Download Demo PDF </button>

    <!-- <p class="note infoblock-text">
      <i class="bi bi-exclamation-triangle"></i>
      Note the demo PDF serves only the purpose of demonstrating features of IdentitySign.
    </p> -->
  </div>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-3-circle heading-icon"></i>
      Select personal data
    </h2>

    <p class="main-text infoblock-text">
      By selecting personal data, you can decide what information about you is
      included in the signature. The selected information will later be added by
      Yivi. <br />
      {#if version == "0"}
        There are 3 options: Your legal name, your address (i.e. street, ...)
        and your Email address.
      {:else}
        There are 2 options: Your legal name and your Email address.
      {/if}
    </p>
  </div>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-4-circle heading-icon"></i>
      Use Yivi to sign
    </h2>

    <p class="main-text infoblock-text">
      That's it! You're now all set up to continue with the tasks in the survey!
    </p>
  </div>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-check-circle heading-icon"></i>
      Done!
    </h2>

    <p class="main-text infoblock-text">
      That's it! You successfully signed a document! You can find the signed
      document in your download folder of your device.
    </p>
  </div>

  <!-- Verify -->
  <h1>Verifying a signature</h1>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-1-circle heading-icon"></i>
      Open the Verify page
    </h2>

    <p class="main-text infoblock-text">
      You can find the page <a href={resolve("/verify")} target="_blank">here</a
      >. It will open in a new browser tab so you can come back to keep track of
      the following steps.
    </p>
  </div>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-2-circle heading-icon"></i>
      Upload a document
    </h2>

    <p class="main-text infoblock-text">
      Upload a document with a signature. For example, use the demo PDF you just
      signed to check if it was signed succefully.
    </p>

    <p class="note infoblock-text">
      <i class="bi bi-info-square"></i>
      You can also try uploading a document without a signature. IdentitySign identifies
      the issue and lets you upload another document!
    </p>
  </div>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-3-circle heading-icon"></i>
      Check the signature
    </h2>

    <!-- TODO: Styling -->
    <!-- TODO: More on feedback/help/warnings etc -->
    <p class="main-text infoblock-text">
      If a signature was found, you can investigate the personal data the
      document was signed with. Using the questions
      <!-- #if mobile (to the right of the data/ below each of the data points) -->
      , you can indicate whether this data belongs to the person or organization you
      expect to be the signature from. <br />
    </p>
    <p class="main-text infoblock-text">
      If you need help, use the ''<a
        href={resolve("/help/trust")}
        target="_blank"
        class="helplink"
      >
        When should I not trust a document?
      </a>'' link. <br />
      If you're still unsure, you can select 'Not sure'. <br />
    </p>
    <p class="main-text infoblock-text">
      After answering all questions, you will receive feedback to interpret your
      answer(s)!
    </p>
  </div>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-check-circle heading-icon"></i>
      Done!
    </h2>

    <p class="main-text infoblock-text">
      That's it! You successfully verified a signature and evaluated if it's
      trustworthy!
    </p>
  </div>

  <div class="text-center">
    <h3>
      <i class="bi bi-award"></i> Congratulations, you completed the demo!
    </h3>

    <p class="main-text infoblock-text">
      Check out... (request page, github, ...?)
    </p>
  </div>
</div>

<style>
  .btn {
    margin-top: 20px;
    font-size: 20px;
  }
  .narrower {
    margin-top: 5%;
  }
  .heading-icon {
    margin-right: 10px;
  }
  .note {
    margin-top: 20px;
    color: var(--bs-primary);
  }
</style>
