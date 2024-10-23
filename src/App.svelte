<script lang="ts">
  import iconKey from "@ktibow/iconset-material-symbols/key-rounded";
  import Icon from "./Icon.svelte";
  import Chat from "./Chat.svelte";

  let groqKey = localStorage.groqKey || "";

  $: if (groqKey) {
    localStorage.groqKey = groqKey;
  }
</script>

{#if groqKey}
  <Chat {groqKey} />
{:else}
  <div class="center">
    <Icon icon={iconKey} width="1.5rem" height="1.5rem" />
    <h1>Enter your Groq key</h1>
    <input bind:value={groqKey} />
  </div>
{/if}

<style>
  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    margin: auto;
  }

  .center :global(svg) {
    color: rgb(var(--m3-scheme-secondary));
  }
  h1 {
    font-size: 1.5rem;
    font-weight: 400;
  }
  input {
    width: 100%;
    background-color: rgb(var(--m3-scheme-surface-container));
    padding: 0.5rem;
    border-radius: 0.5rem;
    margin-top: 1rem;
  }
</style>
