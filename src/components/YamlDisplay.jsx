import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js/lib/core";
import yaml from "highlight.js/lib/languages/yaml";
import "highlight.js/styles/atom-one-dark-reasonable.css";
import { generateYaml } from "../utils/yamlGenerator";

hljs.registerLanguage("yaml", yaml);

export default function YamlDisplay({ config }) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const codeRef = useRef(null);

  useEffect(() => {
    const yamlText = generateYaml(config);
    const tempElement = document.createElement("code");
    tempElement.className = "language-yaml";
    tempElement.textContent = yamlText;
    hljs.highlightElement(tempElement);
    setHighlightedHtml(tempElement.innerHTML);
  }, [config]);

  const copyToClipboard = () => {
    const yamlText = generateYaml(config);
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
      <pre>
        <code
          ref={codeRef}
          className="language-yaml"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </pre>
    </div>
  );
}
