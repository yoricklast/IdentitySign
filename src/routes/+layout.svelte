<script>
  import { afterNavigate, beforeNavigate } from "$app/navigation";

  let { children } = $props();

  afterNavigate(() => {
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]',
    );
    const popoverList = [...popoverTriggerList].map(
      (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl),
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
