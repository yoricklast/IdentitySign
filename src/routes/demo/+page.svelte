<script lang="ts">
  import { issuePopup } from "../../scripts/yivi-issue";
  import { resolve } from "$app/paths";

  const version = localStorage.getItem("productionVersion");

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
        ><span><i class="bi bi-arrow-right"></i></span> Verify</a
      >
    </nav>
  </div>
  <div class="col-auto order-lg-first">
    <!-- TODO: Add Screenshots -->
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
          Clicking on the button below will show you a pop-up containing a
          QR-code which you can scan using the Yivi app on your smartphone. This
          will add the required personal data to your Yivi app.
        </p>

        <button class="btn btn-primary" onclick={issuePopup}>
          Add personal data
        </button>

        <p class="note infoblock-text">
          <i class="bi bi-exclamation-triangle"></i>
          Note that personal data would normally come from a trusted source such as
          a municipality. Using this data is only possible during this demo!
        </p>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-check-circle heading-icon"></i>
          Done!
        </h2>

        <p class="main-text infoblock-text">
          That's it! You're now all set up to use IdentitySign! Check out some
          of its features by using the 'Signing a document' and 'Verifying a
          signature' section down below!
        </p>
      </div>

      <!-- Sign -->
      <h1 id="sign-section">Signing a document</h1>

      <p class="main-text">
        IdentitySign lets you add an invisible signature to your documents such
        that others can verifiy if it has actually been issued by you. Let's go
        through the signing process step-by-step:
      </p>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-1-circle heading-icon"></i>
          Open the Sign page
        </h2>

        <p class="main-text infoblock-text">
          You can find the page <a href={resolve("/sign")} target="_blank"
            >here</a
          >. It will open in a new browser tab so you can come back to keep
          track of the following steps.
        </p>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-2-circle heading-icon"></i>
          Select a document
        </h2>

        <p class="main-text infoblock-text">
          Use the file input field on the Sign page to select a document for
          signing. Clicking the button below will download a PDF document you
          can use to sign.
        </p>

        <!-- eslint-disable-next-line -->
        <a href="/demo/DemoPDF.pdf" download="demo_file">
          <button class="btn btn-primary"> Download Demo PDF</button>
        </a>

        <p class="note infoblock-text">
          <i class="bi bi-info-circle"></i>
          When "uploading" a file on IdentitySign, no information is sent to another
          device or service!
        </p>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-3-circle heading-icon"></i>
          Select personal data
        </h2>

        <p class="main-text infoblock-text">
          By selecting personal data, you can decide what information about you
          is included in the signature. The selected information will later be
          added by Yivi.
          {#if version == "0"}
            There are 3 options: Your legal name, your address (i.e. street,
            house no., postal code and city) and your email address.
          {:else}
            There are 2 options: Your legal name (Robin Stevens) and your email
            address (robin.stevens@example.com).
          {/if}
        </p>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-4-circle heading-icon"></i>
          Use Yivi to sign
        </h2>

        <p class="main-text infoblock-text">
          After clicking "Next", scan the QR code {#if isMobile}
            or click on the "Open Yivi app" button
          {/if}
          to access the Yivi app. Check if the credentials are correct and the ones
          you want sign with.
        </p>
        <!-- TODO: Add warning note -->
        <p class="note infoblock-text">
          <i class="bi bi-exclamation-triangle"></i>
          Yivi will show a warning because ... In the context of this demo, you can
          safely ignore it and continue!
        </p>
      </div>
      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-5-circle heading-icon"></i>
          Sign
        </h2>

        <p class="main-text infoblock-text">
          If the data is correct, accept to share the data in Yivi. The document
          is now ready to be signed! All you have to do is clicking the "Sign"
          button in IdentitySign to complete the process.
        </p>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-check-circle heading-icon"></i>
          Done!
        </h2>

        <p class="main-text infoblock-text">
          That's it! You successfully signed a document! You can find the signed
          document in your download folder of your device. You can also click
          "Download again" to save the signed document manually.
        </p>
        <!-- Note that the signature is visible at the buttom of the document since we're using the demo version of IdentitySign. 
         Cryptographic signatures are not easily read or identifiable by humans -->
      </div>

      <!-- Verify -->
      <h1 id="verify-section">Verifying a signature</h1>
      <p class="main-text">
        Let's verify if a signed document is trustworthy! Please follow the
        steps below.
      </p>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-1-circle heading-icon"></i>
          Open the Verify page
        </h2>

        <p class="main-text infoblock-text">
          You can find the page <a href={resolve("/verify")} target="_blank"
            >here</a
          >. It will open in a new browser tab so you can come back to keep
          track of the following steps.
        </p>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-2-circle heading-icon"></i>
          Select a document
        </h2>

        <p class="main-text infoblock-text">
          Select a document with a signature from your device. For example, use
          the demo PDF you just signed to check the information stored in the
          signature.
        </p>

        <p class="note infoblock-text">
          <i class="bi bi-info-circle"></i>
          Nice to know: IdentitySign also identifies if the document holds no signature
          or an invalid one!
        </p>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-3-circle heading-icon"></i>
          Check the signature details
        </h2>

        <p class="main-text infoblock-text">
          If a signature was found, you can investigate the personal data the
          document was signed with. Using the questions
          {#if isMobile}
            below each of the data points
          {:else}
            next to the data
          {/if}
          , you can indicate whether this data belongs to the person or organization
          you expect the signature from. <br />
          After answering all questions, you will receive feedback to interpret your
          answer(s)!
        </p>

        <h3 class="mt-2">
          <i class="bi bi-lightbulb"></i> Tips on verifying a signature
        </h3>
        Note that the sender of the document is not necessarily the one that should
        have signed the document (e.g. a graduation certificate would be signed by
        the university/school).<br />
        <p class="main-text infoblock-text">
          You can also check out our <a
            href={resolve("/help/trust")}
            target="_blank"
            class="helplink"
          >
            help page
          </a>
          about ''When should I not trust a document?''. <br />

          If you're still unsure, you can select ''Not sure''.
          <br />
        </p>
      </div>

      <div class="infoblock rounded border">
        <h2>
          <i class="bi bi-4-circle heading-icon"></i>
          Evaluate the result
        </h2>

        <!-- TODO: Add screenshot, add additional description? -->
        <p class="main-text infoblock-text">
          Depending on your answers, you receive feedback if the signature can
          be trusted. Click on the buttons below to take a look at the possible
          feedback messages.
        </p>

        <p class="note infoblock-text">
          <i class="bi bi-info-circle"></i>
          IdentitySign cannot guarantee a valid signature is trustworthy but supports
          you on making an informed decision!
        </p>
        <div class="d-flex flex-wrap justify-content-evenly mb-3">
          <button
            class="btn btn-danger"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#noAlert"
            aria-expanded="false"
            aria-controls="noAlert"
          >
            Result: "No trust"
          </button>
          <button
            class="btn btn-warning"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#notSureAlert"
            aria-expanded="false"
            aria-controls="notSureAlert"
          >
            Result: "Uncertain"
          </button>
          <button
            class="btn btn-primary"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#yesAlert"
            aria-expanded="false"
            aria-controls="yesAlert"
          >
            Result: "Credible"
          </button>
        </div>
        <div class="collapse" id="noAlert">
          <div class="card card-body">
            <p class="main-text infoblock-text text-wrap">
              If at least one of your answers was "No", the document should not
              be trusted.
            </p>
            <hr />
            <div class="alert alert-danger">
              <strong>
                <i class="bi bi-exclamation-triangle-fill alert-icon"></i> This document
                should not be trusted!
              </strong>
              <hr />
              <p>
                You indicated that the document may have been signed by the
                wrong person or organization, or that relevant information (such
                as their name or email) is missing.
              </p>
              <p>
                You can use our
                <a href={resolve("/request")} target="_blank">
                  signature request tool
                </a>
                to request a signature that contains this information.
              </p>
            </div>
          </div>
        </div>
        <div class="collapse" id="notSureAlert">
          <div class="card card-body">
            <p class="main-text infoblock-text text-wrap">
              You indicated uncertainty in your answer(s). Ask yourself what the
              reasons behind your uncertainty are and refer to the tips and
              tricks in the feedback message. You can still change your answers
              towards "Yes" or "No" or contact the signer.
            </p>
            <hr />
            <div class="alert alert-warning">
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
                  : " or email"}), use our
                <a href={resolve("/request")} target="_blank">
                  signature request tool
                </a>
                to create a signature request with the information you need.
              </p>
            </div>
          </div>
        </div>
        <div class="collapse" id="yesAlert">
          <div class="card card-body">
            <p class="main-text infoblock-text text-wrap">
              If all of your answer(s) are "Yes", you rated the document as
              trustworthy.
            </p>
            <hr />
            <div class="alert alert-primary">
              <strong
                ><i class="bi bi-info-circle-fill alert-icon"></i> This document can
                most likely be trusted!</strong
              > <br />
              <hr />
              You indicated that this document was signed by the correct person or
              organization.
            </div>
          </div>
        </div>
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
