import {
  Editor,
  html,
  nord,
  ReactEditor,
  register,
  rootCtx,
  useEditor,
} from "../deps.js";

// import { setupCollab } from "../utils/collab.js";

// const initialContent = `
// milkdown
// `;

export const Page = () => {
  const { editor } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
      })
      .use(nord)
      .use(gfm)
      .use(math)
      .use(collaborative)
  );

  // setupCollab(editor, {
  //   initialContent,
  // });

  return html`<${ReactEditor} editor=${editor} />`;
  // return html`<p>Hi</p>`;
};

register(Page, "x-page", ["name"]);
