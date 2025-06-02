import React, { useState } from "react";
import { generateYaml } from "../utils/yamlGenerator";

export default function YamlDisplay({ config }) {
  const [copied, setCopied] = useState(false);
  const yamlText = generateYaml(config);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(yamlText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Error al copiar: ", err);
        const textarea = document.createElement("textarea");
        textarea.value = yamlText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="yaml-display">
      <div className="yaml-header">
        <h3>Configuration</h3>
        <button
          onClick={copyToClipboard}
          className={`copy-button ${copied ? "copied" : ""}`}
          disabled={!yamlText}
        >
          {copied ? (
            <>
              <i className="fas fa-check"></i> Copied!
            </>
          ) : (
            <>
              <i className="fas fa-copy"></i> Copy
            </>
          )}
        </button>
      </div>
      <pre>{yamlText}</pre>
    </div>
  );
}
