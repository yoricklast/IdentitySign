<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { onMount } from "svelte";
  import { getProductionVersion } from "../scripts/ts-util";
  // import { resolve } from "$app/paths";

  let { children } = $props();

  let productionVersion = $state(localStorage.getItem("productionVersion"));

  // using a pathname
  // const homePage = resolve(`/`);
  // const signPage = resolve(`/sign`);
  // const verifyPage = resolve(`/verify`);
  // const requestPage = resolve(`/request`);
  // const aboutPage = resolve(`/about`);
  // const aboutCreditPage = resolve(`/about/credit`);
  // const faqPage = resolve(`/faq`);
  // const helpPage = resolve(`/help/trust`);

  // using a route ID plus parameters
  // const resolved = resolve("/blog/[slug]", {
  //   slug: "hello-world",
  // });

  onMount(() => {
    if (productionVersion == null) {
      getProductionVersion().then((result) => {
        if (result != null) {
          productionVersion = `${result}`;
          localStorage.setItem("productionVersion", productionVersion);
          window.location.reload();
        }
      });
    }
  });

  afterNavigate(() => {
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]',
    );
    [...popoverTriggerList].map(
      (popoverTriggerEl) => new window.bootstrap.Popover(popoverTriggerEl),
    );
  });

  beforeNavigate(() => {
    const activePopoverList = document.querySelectorAll(".popover.show");
    if (activePopoverList) {
      activePopoverList.forEach((popover) => popover.remove());
    }
  });
</script>

{@render children()}
