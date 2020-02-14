import React, { useState } from "react";

const defaultValue = `
# it's h1
## it's h2
### it's h3
#### it's h4
##### it's h5
###### it's h6

i have a **bold** text
__bold__

i have a *italic* text
_italic_

i am mixing *italic* with __bold__
i am mixing _italic_ with **bold**
i am mixing _italic_ with __bold__
i am mixing *italic* with **bold**

\`code snippet\`
here is a \`code snippet\` for you
here is a \`code snippet\` mixed with __bold__
here is a \`code snippet\` mixed with __bold__ and  _italic_
`;

const parseMarkdown = value => {
  // const value = event.target.value;

  // Create a queue of commands
  const queue = value.split("\n");

  // Parse
  const parsedStack = queue
    .map(el => {
      //
      // The Headers Tags
      //
      const h1 = /(?<=^#\s)(.*)/g;
      const h2 = /(?<=^##\s)(.*)/g;
      const h3 = /(?<=^###\s)(.*)/g;
      const h4 = /(?<=^####\s)(.*)/g;
      const h5 = /(?<=^#####\s)(.*)/g;
      const h6 = /(?<=^######\s)(.*)/g;

      if (el.match(h1)) return `<h1>${el.match(h1)}</h1>`;
      if (el.match(h2)) return `<h2>${el.match(h2)}</h2>`;
      if (el.match(h3)) return `<h3>${el.match(h3)}</h3>`;
      if (el.match(h4)) return `<h4>${el.match(h4)}</h4>`;
      if (el.match(h5)) return `<h5>${el.match(h5)}</h5>`;
      if (el.match(h6)) return `<h6>${el.match(h6)}</h6>`;

      //
      // The Bold and italic Tags
      //
      const bold = /(?<=\*\*)(.*)(?=\*\*)|(?<=__)(.*)(?=__)/g;
      const italic = /(?<=\*)(.*)(?=\*)|(?<=_)(.*)(?=_)/g;

      if (el.match(bold))
        return el.replace(/(\*\*.*\*\*)|(__.*__)/g, `<b>${el.match(bold)}</b>`);

      if (el.match(italic))
        return el.replace(/(\*.*\*)|(_.*_)/g, `<i>${el.match(italic)}</i>`);

      //
      // Code Snippets
      //

      const code = /(?<=`)(.*)(?=`)/g;

      if (el.match(code))
        return el.replace(/(`.*`)/g, `<code>${el.match(code)}</code>`);

      return null;
    })
    .filter(el => el !== null);

  return parsedStack.join("<br />");
};

function App() {
  const [htmlStack, setHtmlStack] = useState("");

  const parse = event => {
    const value = event.target.value;
    const parsedValue = parseMarkdown(value);
    setHtmlStack(parsedValue);
  };

  return (
    <main>
      <textarea
        value={defaultValue}
        onBlur={parse}
        style={{ width: "100%", height: 250 }}
        readOnly
      />
      <div dangerouslySetInnerHTML={{ __html: htmlStack }} />
    </main>
  );
}

export default App;
