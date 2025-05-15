<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { onMount } from "svelte";
  import { getProductionVersion } from "../scripts/ts-util";

  let { children } = $props();

  let prodVersion = $state(localStorage.getItem("prodVersion"));

  onMount(() => {
    if (prodVersion == null) {
      getProductionVersion().then((result) => {
        if (result != null) {
          prodVersion = `${result}`;
          localStorage.setItem("prodVersion", prodVersion);
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
