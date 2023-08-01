<script lang="ts">
  import { issuePopup } from "../../scripts/yivi-issue";
</script>

<div class="narrower position-relative start-50 translate-middle-x">
  <h1>Yivi setup</h1>

  <p class="main-text">
    Let's get you started with setting up Yivi for use with IdentitySign! Please
    follow the steps below.
  </p>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-1-circle heading-icon" />
      Download and install Yivi
    </h2>

    <p class="main-text infoblock-text">
      If you haven't done so already, please download and install Yivi on your
      smartphone. You can find out where to download Yivi <a
        href="https://www.yivi.app/en/download">here</a
      >.
    </p>
  </div>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-2-circle heading-icon" />
      Add personal data to Yivi
    </h2>

    <p class="main-text infoblock-text">
      Clicking on the button below will show you a pop-up containing a QR-code
      which you can scan using the Yivi app on your smartphone. This will add
      the required personal data to your Yivi app.
    </p>

    <button class="btn btn-primary" on:click={issuePopup}>
      Add personal data
    </button>
  </div>

  <div class="infoblock rounded border">
    <h2>
      <i class="bi bi-check-circle heading-icon" />
      Done!
    </h2>

    <p class="main-text infoblock-text">
      That's it! You're now all set up to continue with the tasks in the survey!
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
</style>
