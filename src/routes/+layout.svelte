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
    if (dataSpy && window.bootstrap.ScrollSpy.getInstance(dataSpy)) {
      window.bootstrap.ScrollSpy.getInstance(dataSpy).dispose();
    }
  });
</script>

{@render children()}
