<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { onMount } from "svelte";
  import { getProductionVersion } from "../scripts/ts-util";

  let { children } = $props();

  let productionVersion = $state(localStorage.getItem("productionVersion"));

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
    const dataSpy = document.querySelector('[data-bs-spy="scroll"]');
    if (dataSpy) {
      new window.bootstrap.ScrollSpy(dataSpy);
    }
  });

  beforeNavigate(() => {
    const activePopoverList = document.querySelectorAll(".popover.show");
    if (activePopoverList) {
      activePopoverList.forEach((popover) => popover.remove());
    }

    const dataSpy = document.querySelector('[data-bs-spy="scroll"]');
    console.log(dataSpy);
    if (dataSpy && window.bootstrap.ScrollSpy.getInstance(dataSpy)) {
      window.bootstrap.ScrollSpy.getInstance(dataSpy).dispose();
    }
  });
</script>

{@render children()}
