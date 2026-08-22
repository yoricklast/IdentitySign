<script lang="ts">
  import { issuePopup } from "../../scripts/yivi-issue";
  import { resolve } from "$app/paths";

  let isMobile =
    /Android|iPad|iPhone|iPod/i.test(window.navigator.userAgent) ||
    (/Macintosh/i.test(window.navigator.userAgent) &&
      navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 2);
</script>

<div class="row column-gap-3 justify-content-center mx-auto">
  <div
    class="narrower col-lg-auto px-4 order-lg-last align-self-start sticky-top bg-body-tertiary rounded-3"
  >
    <p class="pt-2 ps-2 text-lg-center">Quick links:</p>

    <nav
      id="quick-links"
      class="nav nav-underline nav-justified flex-row flex-lg-column"
    >
      <a href="#setup-section" class="nav-link"
        ><span><i class="bi bi-arrow-right"></i></span> Setup</a
      >

      <a href="#sign-section" class="nav-link"
        ><span><i class="bi bi-arrow-right"></i></span> Signing</a
      >

      <a href="#verify-section" class="nav-link"
        ><span><i class="bi bi-arrow-right"></i></span> Verifying</a
      >
    </nav>
  </div>
  <div class="col-auto order-lg-first">
    <div
      class="narrower position-relative start-50 translate-middle-x"
      data-bs-spy="scroll"
      data-bs-target="#quick-links"
      data-bs-smooth-scroll="true"
    >
      <!-- Setup -->
      <h1 id="setup-section">Setup Yivi</h1>

      <p class="main-text">
        Let's get you started with setting up Yivi for use with IdentitySign!
        Please follow the steps below.
      </p>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-1-circle heading-icon"></i>
          Download and install Yivi
        </h2>

        <p class="main-text infoblock-text">
          If you haven't done so already, please download and install Yivi on
          your smartphone. You can find out where to download Yivi <a
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
          Clicking on the button below will show you a pop-up containing a QR
          code which you can scan using the Yivi app on your smartphone. This
          will add the required personal data to your Yivi app.
        </p>

        <button class="btn btn-primary" onclick={issuePopup}>
          Add personal data
        </button>

        <p class="note infoblock-text">
          <i class="bi bi-exclamation-triangle"></i>
          Note that personal data would normally come from a trusted source, such
          as a municipality. Using this data is only possible for this demo!
        </p>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-check-circle heading-icon"></i>
          Done!
        </h2>

        <p class="main-text infoblock-text">
          That's it! You're now all set up to try IdentitySign! Check out some
          of its features by using the 'Signing a document' and 'Verifying a
          signature' section down below!
        </p>
      </div>

      <!-- Sign -->
      <h1 id="sign-section">Signing a document</h1>

      <p class="main-text">
        IdentitySign lets you add a signature to your documents. Let's go
        through the signing process step by step:
      </p>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-1-circle heading-icon"></i>
          Open the Sign page
        </h2>

        <p class="main-text infoblock-text">
          You can find the "Sign document" page in the menu at the top right of
          this page, or by simply clicking <a
            href={resolve("/sign")}
            target="_blank">here</a
          > (this link will open in a new browser tab so you can come back to keep
          track of the following steps).
        </p>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-2-circle heading-icon"></i>
          Select a document
        </h2>

        <div class="row clearfix">
          <div class="mb-3 col">
            <p class="main-text infoblock-text">
              Use the file input field on the Signing page to select a document
              for signing. Optionally, clicking the button below will download a
              sample document you can use to sign.
            </p>

            <!-- eslint-disable-next-line -->
            <a href="/demo/DemoPDF.pdf" download="demo_file">
              <button class="btn btn-primary"> Download Sample PDF</button>
            </a>
          </div>

          <img
            src="Upload_File_Sign.png"
            alt="Sign page with file upload form highlighted"
            class="ms-md-2 float-md-end col-md-6 px-0 px-md-0 px-sm-5 object-fit-contain"
          />
        </div>

        <p class="note infoblock-text">
          <i class="bi bi-info-circle"></i>
          IdentitySign runs client-side in your browser. In other words, when "uploading"
          a file for signing in IdentitySign, it is <b>not</b> sent to another device
          or service!
        </p>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-3-circle heading-icon"></i>
          Select personal data
        </h2>
        <div class="row clearfix">
          <p class="main-text infoblock-text col mb-3">
            You can select what personal data is included in the signature. The
            selected data will be obtained from Yivi in the next step.
          </p>

          <img
            src="Personal_Data.png"
            alt="Sign page with personal data options highlighted"
            class="ms-md-2 float-md-end col-md-6 px-0 px-md-0 px-sm-5 object-fit-contain"
          />
        </div>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-4-circle heading-icon"></i>
          Obtain data from Yivi
        </h2>

        <p class="main-text infoblock-text">
          After clicking "Next", scan the QR code {#if isMobile}
            or click on the "Open Yivi app" button
          {/if}
          to access the Yivi app. Yivi will show you what data is being shared and
          will ask you to confirm.
        </p>

        <p class="note infoblock-text">
          <i class="bi bi-exclamation-triangle"></i>
          The Yivi app will show a warning because (this hosted instance of) IdentitySign
          is not registered as a trusted organization at Yivi. As we are not using
          real data in this demo, you can ignore this warning.
        </p>
      </div>
      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-5-circle heading-icon"></i>
          Sign
        </h2>

        <div class="row clearfix">
          <p class="main-text infoblock-text mb-3 col">
            IdentitySign now displays the data it obtained from Yivi. You can
            complete the signature process by clicking the "Sign" button!
          </p>

          <img
            src="Sign.png"
            alt="The 'Ready to sign!' page with the 'Sign' button at the bottom right highlighted"
            class="ms-md-2 float-md-end col-md-6 px-0 px-md-0 px-sm-5 object-fit-contain"
          />
        </div>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-check-circle heading-icon"></i>
          Done!
        </h2>

        <p class="main-text infoblock-text">
          That's it! You can find the signed document in the downloads folder of
          your device. You can also click "Download again" to save the signed
          document manually.
        </p>
      </div>

      <!-- Verify -->
      <h1 id="verify-section">Verifying a signature</h1>
      <p class="main-text">
        Let's verify a signature made with IdentitySign! Please follow the steps
        below.
      </p>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-1-circle heading-icon"></i>
          Open the Verify page
        </h2>

        <p class="main-text infoblock-text">
          You can find the "Verify signature" in the menu at the top right of
          this page, or by simply clicking <a
            href={resolve("/verify")}
            target="_blank">here</a
          > (this link will open in a new browser tab so you can come back to keep
          track of the following steps).
        </p>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-2-circle heading-icon"></i>
          Select a document
        </h2>

        <div class="row clearfix gx-2 gy-2">
          <p class="main-text infoblock-text col">
            Select a document with a signature from your device. For example,
            use the signed sample PDF you just signed to check its signature.
          </p>

          <img
            src="Upload_File_Verify.png"
            alt="Verify page with file upload form highlighted"
            class="float-md-end col-md-6 px-0 px-md-0 px-sm-5 object-fit-contain"
          />
        </div>

        <p class="note infoblock-text">
          <i class="bi bi-info-circle"></i>
          IdentitySign also identifies when the document holds no signature or an
          invalid one!
        </p>

        <div class="row justify-content-center gy-2 gx-2">
          <img
            src="Found.png"
            alt="Example of 'Signature found...' feedback"
            class="col-md-4 col-6 object-fit-contain"
          />
          <img
            src="No_Signature.png"
            alt="Example of 'No signature found!' feedback"
            class="col-md-4 col-6 object-fit-contain"
          />
          <img
            src="Invalid.png"
            alt="Example of 'Signature invalid!' feedback"
            class="col-md-4 col-6 object-fit-contain"
          />
        </div>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-3-circle heading-icon"></i>
          Check the signature details
        </h2>

        <p class="main-text infoblock-text">
          If a signature was found, you can investigate the personal data used
          to sign the document. Using the questions
          {#if isMobile}
            below each of the data points
          {:else}
            next to the data
          {/if}
          , you can indicate whether this data belongs to the person or organization
          you expect the signature from. After answering all questions, you will receive
          further feedback from IdentitySign.
        </p>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-check-circle heading-icon"></i>
          Done!
        </h2>

        <p class="main-text infoblock-text">
          That's it! You successfully verified and evaluated a signature using
          IdentitySign!
        </p>
      </div>

      <div class="text-center">
        <h3>
          <i class="bi bi-award"></i> Congratulations, you've tried the two main features
          of IdentitySign!
        </h3>
      </div>
    </div>
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
