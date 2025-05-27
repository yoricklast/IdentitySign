<script lang="ts">
  import {
    DISCLOSE_ADDRESS,
    DISCLOSE_EMAIL,
    DISCLOSE_FULL_NAME,
    disclosePopup,
  } from "../../scripts/yivi-disclose";
  import { getDefaultYiviUrl } from "../../scripts/util";
  import { issuePopup } from "../../scripts/yivi-issue";
  import {
    DEFAULT_BASE_CODE,
    getDefaultBaseCode,
    getProductionVersion,
  } from "../../scripts/ts-util";
  import { onMount } from "svelte";

  const URL_PARAMS = new URLSearchParams(window.location.search);
  const PARAM_URL = URL_PARAMS.get("url");
  const PARAM_DEVMODE = URL_PARAMS.get("devmode");
  const PARAM_GOHOME = URL_PARAMS.get("gohome");

  if (PARAM_URL || PARAM_DEVMODE) {
    if (PARAM_URL && PARAM_URL != "null") {
      localStorage.setItem("yiviUrl", PARAM_URL);
    }
    if (PARAM_DEVMODE == "true") {
      localStorage.setItem("devMode", "true");
    }
    if (PARAM_DEVMODE == "false") {
      localStorage.setItem("devMode", "false");
    }
    if (PARAM_GOHOME == "true") {
      window.location.href = "/";
    }
  }

  let devMode = $state(localStorage.getItem("devMode"));
  let yiviUrl = $state(localStorage.getItem("yiviUrl"));
  let productionVersion = $state(localStorage.getItem("productionVersion"));
  let baseCode: string | null = $state(null);
  let loadedYiviUrlFromDefaults = $state(false);
  let loadedBaseCodeFromDefaults = $state(false);

  onMount(() => {
    if (yiviUrl == null) {
      getDefaultYiviUrl().then((result) => {
        if (result != null) {
          yiviUrl = result;
          loadedYiviUrlFromDefaults = true;
        }
      });
    }
    if (baseCode == null) {
      getDefaultBaseCode().then((result) => {
        if (result != null) {
          baseCode = `${result}`;
          loadedBaseCodeFromDefaults = true;
        } else {
          baseCode = DEFAULT_BASE_CODE;
        }
      });
    }
    if (productionVersion == null) {
      getProductionVersion().then((result) => {
        if (result != null) {
          productionVersion = `${result}`;
          localStorage.setItem("productionVersion", productionVersion);
          reloadPage();
        }
      });
    }
  });

  let link = $state(genLink());
  let goHome = $state(false);

  function enableDevMode() {
    setDevMode(true);
  }

  function disableDevMode() {
    setDevMode(false);
  }

  function setDevMode(value: boolean) {
    localStorage.setItem("devMode", value.toString());
    devMode = localStorage.getItem("devMode");
    reloadPage();
  }

  function setVersion1() {
    setProdVersion("0");
  }

  function setVersion2() {
    setProdVersion("1");
  }

  function setProdVersion(value: string) {
    localStorage.setItem("productionVersion", value);
    productionVersion = localStorage.getItem("productionVersion");
    reloadPage();
  }

  function clearSettings() {
    localStorage.clear();
    alert("Settings cleared!");
    reloadPage();
  }

  function saveYiviUrl() {
    if (yiviUrl != null) {
      localStorage.setItem("yiviUrl", yiviUrl);
      reloadPage();
    } else {
      alert("Cannot set Yivi URL to null, please check your input!");
    }
  }

  function reloadPage() {
    window.location.href = "/setup";
    console.log("Reloading page...");
  }

  function btnCopyClick() {
    navigator.clipboard.writeText(link);
  }

  function checkGoHome() {
    if (goHome) {
      link = link + "&gohome=true";
    } else {
      link = genLink();
    }
  }

  function genLink(): string {
    return `${window.location.origin}/setup?url=${yiviUrl}&devmode=${devMode}`;
  }

  function discloseFullName() {
    disclosePopup(DISCLOSE_FULL_NAME);
  }

  function discloseAddress() {
    disclosePopup(DISCLOSE_ADDRESS);
  }

  function discloseEmail() {
    disclosePopup(DISCLOSE_EMAIL);
  }
</script>

<h1 style="margin-top: 5%;">
  <i class="bi bi-gear-wide-connected"></i>
  Setup
</h1>

<p style="color: var(--bs-danger);">
  Please note: this page is not meant for end users!
</p>
<p>
  Use this page to configure the application. Settings are saved to <a
    href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
    >localStorage</a
  >.
</p>

<div class="card">
  <div class="card-body">
    <h5 class="card-title">Production Version</h5>
    <p>
      Version 1 uses dummy signatures for 3 personal attributes (name, email,
      address). <br />
      Version 2 uses cryptographic signatures for 2 personal attributes (name, email).
    </p>
    <p>
      You are currently using {#if productionVersion == "0"}<b
          style="color: var(--bs-primary);">Version 1</b
        >{:else if productionVersion == "1"}<b style="color: var(--bs-warning);"
          >Version 2</b
        >{/if}.
    </p>
    <div class="d-grid gap-2 d-md-block">
      <button class="btn btn-primary" onclick={setVersion1}
        >Version 1 (dummy)</button
      >
      <button class="btn btn-secondary" onclick={setVersion2}
        >Version 2 (cryptographic)</button
      >
    </div>
  </div>
</div>

<div class="card">
  <div class="card-body">
    <h5 class="card-title">Yivi</h5>
    <p>Setup demo cards for Yivi.</p>
    <div class="d-grid gap-2 d-md-block">
      <button class="btn btn-primary" onclick={issuePopup}>
        Setup all demo cards
      </button>
      <button class="btn btn-secondary" onclick={discloseFullName}
        >Setup personal data demo card</button
      >
      <button class="btn btn-secondary" onclick={discloseAddress}
        >Setup address demo card</button
      >
      <button class="btn btn-secondary" onclick={discloseEmail}
        >Setup email demo card</button
      >
    </div>
    <div class="urlform">
      <label for="urlfield" class="form-label">Yivi server URL</label>
      {#if loadedYiviUrlFromDefaults}<p class="text-warning">
          Loaded URL from server default settings
        </p>{/if}
      <input
        type="text"
        class="form-control"
        id="urlfield"
        bind:value={yiviUrl}
      />
      <button class="btn btn-primary urlbtn" onclick={saveYiviUrl}
        >Save URL</button
      >
    </div>
  </div>
</div>

<div class="card">
  <div class="card-body">
    <h5 class="card-title">Success-code</h5>
    <div class="urlform">
      <label for="basecodefield" class="form-label"
        >Base for success-code:</label
      >
      {#if loadedBaseCodeFromDefaults}<p class="text-warning">
          Loaded base code from server default settings
        </p>
      {:else}
        <p class="text-primary">Using default value (not set on server)</p>
      {/if}
      <input
        type="text"
        class="form-control"
        id="basecodefield"
        disabled
        bind:value={baseCode}
      />
    </div>
  </div>
</div>

<div class="card">
  <div class="card-body">
    <h5 class="card-title">Developer mode</h5>
    <p>
      Manage developer mode. Developer mode shows the setup page in the
      navigation bar and enables more verbose console output.
    </p>
    <p>
      Developer mode is currently {#if devMode == "true"}<b
          style="color: var(--bs-success);">enabled</b
        >{:else}<b style="color: var(--bs-danger);">disabled</b>{/if}.
    </p>
    <div class="d-grid gap-2 d-md-block">
      <button class="btn btn-primary" onclick={enableDevMode}
        >Enable developer mode</button
      >
      <button class="btn btn-secondary" onclick={disableDevMode}
        >Disable developer mode</button
      >
    </div>
  </div>
</div>

<div class="card">
  <div class="card-body">
    <h5 class="card-title">Quick setup link</h5>
    <p>A quick setup link for the current settings.</p>
    <div class="d-grid gap-2 d-md-block">
      <textarea class="form-control linkbox" bind:value={link} rows="3" disabled
      ></textarea>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="checkHome"
          bind:checked={goHome}
          onchange={checkGoHome}
        />
        <label class="form-check-label" for="checkHome">
          Go to home screen after applying settings.
        </label>
      </div>
      <button class="btn btn-secondary" onclick={btnCopyClick}
        >Copy to clipboard</button
      >
    </div>
  </div>
</div>

<div class="card">
  <div class="card-body">
    <h5 class="card-title">Clear settings</h5>
    <p>
      Clear all stored settings. <b style="color: var(--bs-danger);"
        >Warning, this action cannot be undone!</b
      >
    </p>
    <button class="btn btn-danger" onclick={clearSettings}
      >Clear settings</button
    >
  </div>
</div>

<style>
  .card {
    margin-bottom: 30px;
  }
  .urlform {
    margin-top: 10px;
  }
  .urlbtn {
    margin-top: 15px;
  }
  .linkbox {
    margin-bottom: 10px;
  }
  .form-check {
    margin-bottom: 15px;
  }
</style>
