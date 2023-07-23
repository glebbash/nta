<script lang="ts">
  export let title: string;
</script>

<details>
  <summary class="select-none">{title}</summary>
  <slot />
</details>
