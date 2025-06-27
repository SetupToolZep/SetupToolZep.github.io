import { useState } from "react";

export default function DefaultPlugins({ config, setConfig }) {
  const defaultPlugins = [
    "utility",
    "reminders",
    "slowmode",
    "time_and_date",
    "tags",
    "automod",
  ];

  const handleToggle = (plugin) => {
    setConfig({
      ...config,
      plugins: {
        ...config.plugins,
        [plugin]: !config.plugins[plugin],
      },
    });
  };

  return (
    <div className="plugin-section">
      <h3 className="plugin-title">Default Plugins</h3>
      <div className="plugin-content">
        <div className="plugins-grid">
          {defaultPlugins.map((plugin) => (
            <label key={plugin} className="custom-checkbox plugin-option">
  <input
    type="checkbox"
    checked={config.plugins[plugin] || false}
    onChange={() => handleToggle(plugin)}
    className="styled-checkbox"
  />
  <span className="checkmark"></span>
  <span className="plugin-label">{plugin}</span>
</label>
          ))}
        </div>
      </div>
    </div>
  );
}
