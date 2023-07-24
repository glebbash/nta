<script lang="ts">
  export let title: string;
  export let open: boolean;
</script>

<details bind:open class="border-black border-2 p-1">
  <summary class="select-none">{title}</summary>
  <hr class="border-black border-t-2 mt-1" />
  <div class="p-2">
    <slot />
  </div>
</details>
