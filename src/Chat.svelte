<script lang="ts">
  import iconTrash from "@ktibow/iconset-material-symbols/delete-rounded";
  import iconSend from "@ktibow/iconset-material-symbols/send-rounded";
  import Icon from "./Icon.svelte";
  import Markdown from "./Markdown.svelte";
  import stream from "./stream";

  export let groqKey: string;
  let textarea: HTMLTextAreaElement;

  // const hasSpecdec = async () => {
  //   if (localStorage.bamHasSpecdec) return JSON.parse(localStorage.bamHasSpecdec);
  //   const r = await fetch("https://api.groq.com/openai/v1/models", {
  //     headers: {
  //       Authorization: `Bearer ${groqKey}`,
  //     },
  //   });
  //   const models = await r.json();

  //   const hasSpecdec = models.data.find((m) => m.id == "llama-3.3-70b-specdec") != undefined;
  //   localStorage.bamHasSpecdec = JSON.stringify(hasSpecdec);
  //   return hasSpecdec;
  // };
  const generate = async (prompt: string) => {
    conversation = [...conversation, { role: "user", content: prompt }];
    let r: Response;
    // if (await hasSpecdec()) {
    //   r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${groqKey}`,
    //     },
    //     body: JSON.stringify({
    //       model: "llama-3.3-70b-specdec",
    //       messages: conversation,
    //       stream: true,
    //       temperature: 0.7,
    //     }),
    //   });
    // }
    if (!r || !r.ok) {
      r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: conversation,
          stream: true,
          temperature: 0.7,
        }),
      });
    }

    const message = { role: "assistant", content: "" };
    conversation = [...conversation, message];
    for await (const chunk of stream(r.body)) {
      message.content += chunk;
      conversation = conversation;
    }
  };

  const maybeFocus = (e: KeyboardEvent) => {
    const isAlphanumeric = /^[a-zA-Z0-9]$/.test(e.key);
    if (e.target == document.body && isAlphanumeric && !e.ctrlKey) {
      textarea.focus();
    }
  };

  let conversation: { role: string; content: string }[] = [];
  const searchParams = new URLSearchParams(window.location.search);
  const q = searchParams.get("q");
  if (q) {
    generate(q);
  }
</script>

<svelte:window on:keydown={maybeFocus} />
<button on:click={() => (conversation = [])}>
  <Icon icon={iconTrash} width="1.5rem" height="1.5rem" />
</button>
<div class="wrapper">
  {#each conversation.toReversed() as message}
    {#if message.role == "assistant"}
      <Markdown text={message.content} />
    {:else}
      <div class="user">{message.content}</div>
    {/if}
  {/each}
</div>
<form
  style:margin="0 0.5rem 0.5rem 0.5rem"
  on:submit|preventDefault={(e) => {
    const textarea = e.currentTarget.querySelector("textarea");

    generate(textarea.value);
    textarea.value = "";
  }}
>
  <textarea
    name="query"
    bind:this={textarea}
    on:keydown={(e) => {
      if (e.key == "Enter" && !e.shiftKey) {
        e.currentTarget.form.requestSubmit();
        e.preventDefault();
      }
    }}
  ></textarea>
  <button>
    <Icon icon={iconSend} width="1.5rem" height="1.5rem" />
  </button>
</form>

<style>
  .wrapper {
    display: flex;
    flex-direction: column-reverse;
    overflow: hidden scroll;

    height: 100%;
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;

    width: 100%;
    max-width: 40rem;
    align-self: center;
  }

  .user {
    white-space: pre-wrap;
    background-color: rgb(var(--m3-scheme-primary-container) / 0.2);
    margin: -0.25rem;
    padding: 0.25rem;
    border-radius: 0.5rem;
  }

  form {
    display: flex;
    gap: 0.5rem;
  }
  textarea {
    flex: 1;

    background-color: rgb(var(--m3-scheme-surface-container-low));

    border-radius: 0.5rem;
    padding: 0.5rem;
  }
  button {
    display: flex;

    align-items: center;
    justify-content: center;

    background-color: rgb(var(--m3-scheme-primary-container));
    color: rgb(var(--m3-scheme-on-primary-container));

    min-height: 2rem;
    border-radius: 0.5rem;
    padding: 0 0.5rem;

    cursor: pointer;
  }
  button:nth-child(1) {
    border-radius: 0 0 0.5rem 0.5rem;
  }
</style>
