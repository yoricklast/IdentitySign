<script lang="ts">
  import {
    DISCLOSE_ADDRESS,
    DISCLOSE_EMAIL,
    DISCLOSE_FULL_NAME,
    disclosePopup,
  } from "../../scripts/yivi-disclose";
  import { getDefaultYiviUrl } from "../../scripts/util";

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

  let devMode = localStorage.getItem("devMode");
  let yiviUrl = localStorage.getItem("yiviUrl");
  let loadedYiviUrlFromDefaults = false;

  if (yiviUrl == null) {
    getDefaultYiviUrl().then((result) => {
      if (result != null) {
        yiviUrl = result;
        loadedYiviUrlFromDefaults = true;
      }
    });
  }

  let link = genLink();
  let goHome = false;

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
  <i class="bi bi-gear-wide-connected" />
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
    <h5 class="card-title">Yivi</h5>
    <p>Setup demo cards for Yivi.</p>
    <div class="d-grid gap-2 d-md-block">
      <button class="btn btn-secondary" on:click={discloseFullName}
        >Setup personal data demo card</button
      >
      <button class="btn btn-secondary" on:click={discloseAddress}
        >Setup address demo card</button
      >
      <button class="btn btn-secondary" on:click={discloseEmail}
        >Setup email demo card</button
      >
    </div>
    <div class="urlform">
      <label for="urlfield" class="form-label">Yivi server URL</label>
      {#if loadedYiviUrlFromDefaults}<p class="default-setting-note">
          Loaded URL from server default settings
        </p>{/if}
      <input
        type="text"
        class="form-control"
        id="urlfield"
        bind:value={yiviUrl}
      />
      <button class="btn btn-primary urlbtn" on:click={saveYiviUrl}
        >Save URL</button
      >
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
      <button class="btn btn-primary" on:click={enableDevMode}
        >Enable developer mode</button
      >
      <button class="btn btn-secondary" on:click={disableDevMode}
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
      <textarea
        class="form-control linkbox"
        bind:value={link}
        rows="3"
        disabled
      />
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="checkHome"
          bind:checked={goHome}
          on:change={checkGoHome}
        />
        <label class="form-check-label" for="checkHome">
          Go to home screen after applying settings.
        </label>
      </div>
      <button class="btn btn-secondary" on:click={btnCopyClick}
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
    <button class="btn btn-danger" on:click={clearSettings}
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
  .default-setting-note {
    color: var(--bs-warning);
  }
</style>
