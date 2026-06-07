<script lang="ts">
  /*global APPLICATION_VERSION*/
  const version: string = APPLICATION_VERSION;
  import { resolve } from "$app/paths";
</script>

<div class="w-75 mx-auto widthMobile">
  <h1 style="margin-top: 5%;">
    <i class="bi bi-info-circle page-icon"></i>About Identity&shy;Sign
  </h1>

  <div class="infoblock rounded border">
    <h3>Application info</h3>
    <p class="version-text">
      <b>Version:</b>
      {version}
    </p>
    <p class="infoblock-text credits">
      <a href={resolve("/about/credit")}>Credits</a>
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
        href="https://en.cs.uni-paderborn.de/its"
        target="_blank">Human-Centered IT Security</a
      >
      group at Paderborn University (Germany), and
      <a class="text-reset" href="https://ihub.ru.nl/" target="_blank">iHub</a> at
      Radboud University (The Netherlands).
    </p>

    <h3>Source code</h3>

    <p class="main-text" style="margin-bottom: 10px;">
      IdentitySign is an open-source application, licensed under the GNU General
      Public License (GPL) version 3.
    </p>
    <p class="main-text">
      <b>Links:</b><br />
      <a href="https://github.com/yoricklast/IdentitySign" target="_blank"
        ><i class="bi bi-github"></i> IdentitySign GitHub project</a
      >
    </p>

    <h3>Got any questions?</h3>

    <p class="main-text infoblock-text">
      Check out our <a href={resolve("/faq")}>frequently asked questions</a>, we
      might have already answered them for you!
    </p>
  </div>
</div>

<style>
  .version-text {
    margin-bottom: 0px;
  }
  .credits {
    margin-top: 5px;
    font-size: 14px;
  }
</style>
