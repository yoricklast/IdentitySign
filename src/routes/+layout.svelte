<script>
  let { children } = $props();

  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]',
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new window.bootstrap.Popover(popoverTriggerEl),
  );
</script>

{@render children()}
