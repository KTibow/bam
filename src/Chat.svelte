<script lang="ts">
  import iconTrash from "@ktibow/iconset-material-symbols/delete-rounded";
  import iconSend from "@ktibow/iconset-material-symbols/send-rounded";
  import Icon from "./Icon.svelte";
  import stream from "./stream";

  export let groqKey: string;

  const generate = async (prompt: string) => {
    conversation = [...conversation, { role: "user", content: prompt }];
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: conversation,
        stream: true,
        temperature: 0.7,
      }),
    });

    const message = { role: "assistant", content: "" };
    conversation = [...conversation, message];
    for await (const chunk of stream(r.body)) {
      message.content += chunk;
      conversation = conversation;
    }
  };

  let conversation: { role: string; content: string }[] = [];
  const searchParams = new URLSearchParams(window.location.search);
  const q = searchParams.get("q");
  if (q) {
    generate(q);
  }
</script>

<button on:click={() => (conversation = [])}>
  <Icon icon={iconTrash} width="1.5rem" height="1.5rem" />
</button>
<div class="wrapper">
  {#each conversation.toReversed() as message}
    <div class="message">{message.content}</div>
    <p class="role">{message.role == "user" ? "You" : "Llama 70b"}</p>
  {/each}
</div>
<form
  on:submit|preventDefault={(e) => {
    const textarea = e.currentTarget.querySelector("textarea");

    generate(textarea.value);
    textarea.value = "";
  }}
>
  <textarea
    name="query"
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
    overflow-y: scroll;
    height: 100%;
    padding: 0.5rem 0;
  }
  .role {
    opacity: 0.8;
    margin-top: 0.5rem;
  }
  .message {
    white-space: pre-wrap;
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
</style>
