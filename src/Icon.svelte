<script lang="ts">
  import type { IconifyIcon } from "@iconify/types";
  let icon: IconifyIcon;
  let width: string = "1em";
  let height: string = "1em";
  export { icon, width, height };
</script>

<svg {width} {height} viewBox="0 0 {icon.width} {icon.height}">
  {@html icon.body}
</svg>
