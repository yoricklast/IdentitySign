<script lang="ts">
  import { resolve } from "$app/paths";
</script>

<div class="w-75 mx-auto widthMobile">
  <p class="main-text" style="margin-top: 5%;">
    <a href={resolve("/about")}>About</a> > Credits
  </p>

  <h1>Credits</h1>

  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Web framework</h5>
          <p class="credit-title">Svelte</p>
          <p>The Svelte contributors</p>
          <a href="https://svelte.dev/">https://svelte.dev/</a><br />
          <a href="https://github.com/sveltejs/svelte"
            >https://github.com/sveltejs/svelte</a
          >
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Styling & Icons</h5>
          <p class="credit-title">Bootstrap</p>
          <p>The Bootstrap Authors</p>
          <a href="https://getbootstrap.com/">https://getbootstrap.com/</a><br
          />
          <a href="https://github.com/twbs/bootstrap"
            >https://github.com/twbs/bootstrap</a
          >
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h5 class="card-title">PDF reading</h5>
          <p class="credit-title">PDF.js</p>
          <p>Mozilla and individual contributors</p>
          <a href="https://mozilla.github.io/pdf.js/"
            >https://mozilla.github.io/pdf.js/</a
          ><br />
          <a href="https://github.com/mozilla/pdf.js/"
            >https://github.com/mozilla/pdf.js/</a
          >
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Font</h5>
          <p class="credit-title">Open Sans</p>
          <p>The Open Sans Project Authors</p>
          <a href="https://github.com/googlefonts/opensans"
            >https://github.com/googlefonts/opensans</a
          >
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h5 class="card-title">PDF editing</h5>
          <p class="credit-title">PDF-lib</p>
          <p>Andrew Dillon</p>
          <a href="https://pdf-lib.js.org/">https://pdf-lib.js.org/</a><br />
          <a href="https://github.com/Hopding/pdf-lib"
            >https://github.com/Hopding/pdf-lib</a
          >
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Identity Wallet</h5>
          <p class="credit-title">Yivi</p>
          <p>SIDN</p>
          <a href="https://www.yivi.app/">https://www.yivi.app/</a><br />
          <a href="https://github.com/privacybydesign/yivi-frontend-packages"
            >https://github.com/privacybydesign/yivi-frontend-packages</a
          ><br />
          <a href="https://www.sidn.nl/">https://www.sidn.nl/</a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  p {
    margin-bottom: 5px;
  }
  .credit-title {
    font-weight: 600;
  }
  .card {
    margin-bottom: 20px;
  }
  h1 {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
