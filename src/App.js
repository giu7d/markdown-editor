import React, { useState } from "react";
import uuid from "uuid/v4";

const DICTIONARY = {
  elements: {
    header: /(?<=#)(.*)/g,
    markers: /(__.*?__)|(\*\*.*?\*\*)|(_.*?_)|(\*.*?\*)|(`.*?`)/g
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

const ClickableLine = ({ children }) => {
  return <span onClick={e => console.log("click")}>{children}</span>;
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
          else return subItem;
        })}
    </p>
  );
};

const markdownEngine = stack => {
  return stack
    .map(item => {
      if (item.match(DICTIONARY.elements.header))
        return <ClickableLine key={uuid()}>{headerParser(item)}</ClickableLine>;
      else if (item)
        return (
          <ClickableLine key={uuid()}>{paragraphParser(item)}</ClickableLine>
        );
      else return <br key={uuid()} />;
    })
    .filter(item => item !== null);
};

function App() {
  const [textareaValue, setTextareaValue] = useState("");
  const [html, setHtml] = useState([]);

  const parse = value => {
    // Create a opertions stack
    const stack = value.split("\n");
    // Parse Markdown to HTML
    const parsedHtml = markdownEngine(stack);
    // Inject the result
    setHtml(oldValue => oldValue.concat(...parsedHtml));
  };

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      parse(textareaValue);
      setTextareaValue("");
      console.log(html);
    }
  };

  return (
    <main>
      <div>
        {html}
        <input
          value={textareaValue}
          onChange={e => setTextareaValue(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </main>
  );
}

export default App;
