<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";

  let { children } = $props();

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
