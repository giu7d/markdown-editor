import React, { useState } from "react";
import uuid from "uuid/v4";

const defaultValue = `
# it's h1
## it's h2
### it's h3
#### it's h4
##### it's h5
###### it's h6

i have a **bold** text
i have a text that is **bold**
__bold__

i have a *italic* text
i have a text that is *italic*
_italic_

i am mixing *italic* with __bold__
i am mixing _italic_ with **bold**
i am mixing _italic_ with __bold__
i am mixing *italic* with **bold**

i am mixing __bold__ with _italic_
i am mixing **bold** with *italic*
i am mixing __bold__ with *italic*
i am mixing **bold** with _italic_

\`code snippet\`
here is a \`code snippet\` for you
here is a \`code snippet\` mixed with __bold__
here is a \`code snippet\` mixed with __bold__ and  _italic_
here is a \`code snippet\` mixed with __bold__ and _italic_ and **bold** and *italic*

2nd paragraph. *Italic* and **bold**, and \`monospace\`. Itemized lists look like:
`;

const DICTIONARY = {
  elements: {
    header: /(?<=#)(.*)/g,
    markers: /(__.*__)|(\*\*.*\*\*)|(_.*_)|(\*.*\*)|(`.*`)/g
  },
  opertions: {
    h1: /(?<=^#\s)(.*)/g,
    h2: /(?<=^##\s)(.*)/g,
    h3: /(?<=^###\s)(.*)/g,
    h4: /(?<=^####\s)(.*)/g,
    h5: /(?<=^#####\s)(.*)/g,
    h6: /(?<=^######\s)(.*)/g,
    bold: /(?<=\*\*)(.*)(?=\*\*)|(?<=__)(.*)(?=__)/g,
    italic: /(?<=\*)(.*)(?=\*)|(?<=_)(.*)(?=_)/g,
    code: /(?<=`)(.*)(?=`)/g
  }
};

const headerParser = item => {
  const { h1, h2, h3, h4, h5, h6 } = DICTIONARY.opertions;
  if (item.match(h1)) return <h1 key={uuid()}>{item.match(h1)}</h1>;
  else if (item.match(h2)) return <h2 key={uuid()}>{item.match(h2)}</h2>;
  else if (item.match(h3)) return <h3 key={uuid()}>{item.match(h3)}</h3>;
  else if (item.match(h4)) return <h4 key={uuid()}>{item.match(h4)}</h4>;
  else if (item.match(h5)) return <h5 key={uuid()}>{item.match(h5)}</h5>;
  else if (item.match(h6)) return <h6 key={uuid()}>{item.match(h6)}</h6>;
  else return null;
};

const paragraphParser = item => {
  const { bold, italic, code } = DICTIONARY.opertions;
  return (
    <p key={uuid()}>
      {item
        .split(DICTIONARY.elements.markers)
        .filter(subItem => subItem !== undefined)
        .map(subItem => {
          if (subItem.match(bold))
            return <b key={uuid()}>{subItem.match(bold)}</b>;
          else if (subItem.match(italic))
            return <i key={uuid()}>{subItem.match(italic)}</i>;
          else if (subItem.match(code))
            return <code key={uuid()}>{subItem.match(code)}</code>;
          return subItem;
        })}
    </p>
  );
};

const markdownEngine = stack => {
  return stack
    .map(item => {
      if (item.match(DICTIONARY.elements.header)) return headerParser(item);
      else return paragraphParser(item);
    })
    .filter(item => item !== null);
};

function App() {
  const [html, setHtml] = useState([]);

  const parse = event => {
    // Get the field value
    const value = event.target.value;
    // Create a opertions stack
    const stack = value.split("\n");
    // Parse Markdown to HTML
    const parsedHtml = markdownEngine(stack);
    // Inject the result
    setHtml(parsedHtml);
  };

  return (
    <main>
      <textarea
        defaultValue={defaultValue}
        onBlur={parse}
        style={{ width: "100%", height: 250 }}
      />
      <div>{html}</div>
    </main>
  );
}

export default App;
