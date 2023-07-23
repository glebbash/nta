<script lang="ts">
  import {
    Page,
    Navbar,
    NavTitle,
    NavTitleLarge,
    Link,
    Toolbar,
    Block,
    List,
    ListItem,
    AccordionContent,
    ListInput,
  } from "framework7-svelte";
  import CodeMirror from "svelte-codemirror-editor";
  import { markdown } from "@codemirror/lang-markdown";
  import { githubDark } from "@uiw/codemirror-theme-github";

  import { getDataStore } from "../lib/store";

  export let f7route: unknown;
  export let f7router: unknown;

  const { data } = getDataStore();

  $: nextActions = $data.notes.filter(
    (node) => node.meta.list === "next actions",
  );
  $: inbox = $data.notes.filter((note) => note.meta.list === "inbox");

  let inboxInput = "";
  const addToInbox = () => {
    const value = inboxInput && inboxInput.trim();
    if (!value) {
      return;
    }

    $data.notes.push({
      id: crypto.randomUUID(),
      title: value,
      content: "",
      meta: { list: "inbox" },
    });
    inboxInput = "";
  };

  $: currentNote = $data.notes.find(
    (note) => note.id === $data.uiState.currentNoteId,
  ) ?? {
    title: "",
    content: "",
    meta: {},
  };
  const openNote = (noteId: string) => {
    $data.uiState.currentNoteId = noteId;
    $data.uiState.noteOpen = true;
  };
  const closeNote = () => {
    $data.uiState.noteOpen = false;
  };
</script>

<Page name="home">
  <!-- Top Navbar -->
  <Navbar large>
    <NavTitle>NTA</NavTitle>
    <NavTitleLarge>NTA</NavTitleLarge>
  </Navbar>
  <!-- Toolbar -->
  <Toolbar bottom>
    <Link>Left Link</Link>
    <Link>Right Link</Link>
  </Toolbar>
  <!-- Page content -->
  <Block>
    <div>
      <div hidden={$data.uiState.noteOpen}>
        <div>
          <List accordionList accordionOpposite strong insetMd>
            <ListItem
              title="Next Actions"
              accordionItem
              accordionItemOpened={$data.uiState.nextActionsOpen}
              on:accordionOpen={() => ($data.uiState.nextActionsOpen = true)}
              on:accordionClose={() => ($data.uiState.nextActionsOpen = false)}
            >
              <AccordionContent>
                <Block>
                  <ul>
                    {#each nextActions as note}
                      <li>
                        <a
                          href="/"
                          on:click|preventDefault={() => openNote(note.id)}
                        >
                          {note.title}
                        </a>
                        <button on:click={() => (note.meta.list = "inbox")}>
                          . . .
                        </button>
                      </li>
                    {:else}
                      Empty
                    {/each}
                  </ul>
                </Block>
              </AccordionContent>
            </ListItem>
          </List>
          <List accordionList accordionOpposite strong insetMd>
            <ListItem
              title="Inbox"
              accordionItem
              accordionItemOpened={$data.uiState.inboxOpen}
              on:accordionOpen={() => ($data.uiState.inboxOpen = true)}
              on:accordionClose={() => ($data.uiState.inboxOpen = false)}
            >
              <AccordionContent>
                <Block>
                  <ul>
                    {#each inbox as note}
                      <li>
                        <a
                          href="/"
                          on:click|preventDefault={() => openNote(note.id)}
                        >
                          {note.title}
                        </a>
                        <button
                          on:click={() => (note.meta.list = "next actions")}
                        >
                          . . .
                        </button>
                      </li>
                    {:else}
                      Empty
                    {/each}
                  </ul>
                </Block>
              </AccordionContent>
            </ListItem>
          </List>

          <form on:submit|preventDefault={addToInbox}>
            <List>
              <ListInput
                outline
                label="Add to inbox"
                floatingLabel
                type="text"
                clearButton
                bind:value={inboxInput}
              />
            </List>
          </form>
          <details>
            <summary class="select-none">Data</summary>
            <pre>{JSON.stringify($data, null, 2)}</pre>
          </details>
        </div>
      </div>
      <div hidden={!$data.uiState.noteOpen}>
        <div>
          <div>
            <button on:click={closeNote}>&lt;</button>
            <input type="text" bind:value={currentNote.title} />
          </div>
          <pre>{JSON.stringify(currentNote.meta)}</pre>
          <CodeMirror
            bind:value={currentNote.content}
            extensions={[markdown()]}
            theme={githubDark}
          />
        </div>
      </div>
    </div>
  </Block>
</Page>
