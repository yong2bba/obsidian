<%*
const KEY = 'updated';
const dateTimeFormat = "YYYY-MM-DD HH:mm";
const date = tp.date.now(dateTimeFormat);
const UPDATED = `${KEY}: ${date}`;

const editor = app.workspace.activeLeaf.view.editor;

const updatedFrontMatter = tp.frontmatter.updated;
if (updatedFrontMatter) {
  const replaceLine = async (query, text) => {
    let rowIndexFound = -1;
    for (let row = 0; row <= editor.lastLine(); row++) {
      if (editor.getLine(row).startsWith(query)) {
        rowIndexFound = row;
        break;
      }
    }

    if (rowIndexFound !== -1) {
      editor.replaceRange(
        text,
        { line: rowIndexFound, ch: 0 },
        { line: rowIndexFound, ch: editor.getLine(rowIndexFound).length }
      );
    }

    return rowIndexFound === -1 ? undefined : rowIndexFound;
  };

  const index = await replaceLine(KEY + ": ", UPDATED);
  if (index !== undefined) {
    new Notice("update 날짜와 시간을 업데이트하였습니다.");
  } else {
    new Notice("update 날짜와 시간을 업데이트하는데 실패하였습니다.");
  }
} else {
  const frontMatterBody = `
created: ${date}
updated: ${date}
`.trim();

  const hasFrontMatter = Object.keys(tp.frontmatter).length > 0;
  if (hasFrontMatter) {
    const insertAfterLine = async (query, text) => {
      let rowIndexFound = -1;
      for (let row = 0; row <= editor.lastLine(); row++) {
        if (editor.getLine(row) === query) {
          rowIndexFound = row;
          break;
        }
      }

      if (rowIndexFound !== -1) {
        editor.replaceRange("\n" + text, { line: rowIndexFound, ch: 0 });
      }

      return rowIndexFound === -1 ? undefined : rowIndexFound + 1;
    };

    await insertAfterLine("---", frontMatterBody);
  } else {
    const insertFirst = async (text) => {
      editor.replaceRange(text, { line: 0, ch: 0 });
    };

    const noteBody = `---
${frontMatterBody}
---
`;
    await insertFirst(noteBody);
  }
}
%>