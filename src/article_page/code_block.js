import React, { useState } from "react";
import Lang from "./content"
import "./code_block.css"
import { CopyBlock, dracula, monoBlue, paraisoLight, tomorrow } from "react-code-blocks";
const App = () => {
  return (
    <div className="codeblock">
        <CopyBlock
          language='objectivec'
          text={Lang.objectivec}
          showLineNumbers={true}
          theme={monoBlue}
          wrapLines={true}
          codeBlock
        />
    </div>
  );
};
export default App;
