import { useState } from "react";
import DefaultPlugins from "./plugins/DefaultPlugins";
import ConfigurablePlugins from "./plugins/Configurable";
import ModerationPlugins from "./plugins/Moderation";
import LogsPlugins from "./plugins/Logs";
import YamlDisplay from "./YamlDisplay";

export default function ConfigPanel() {
  const [newId, setNewId] = useState("");
  const [newLevel, setNewLevel] = useState(50);
  const [config, setConfig] = useState({
    prefix: "!",
    levels: {},
    plugins: {
      utility: false,
      reminders: false,
      slowmode: false,
      time_and_date: false,
      tag: false,
      automod: false,
      common: { success_emoji: "", error_emoji: "" },
      starboard: { channel_id: "", stars_required: 5, color: "0xFFD700" },
      cases: { case_log_channel: "" },
      mod_actions: {},
      mutes: {},
    },
  });

  return (
    <div className="config-panel">
      {/* Prefix */}
      <div className="plugin-section">
        <h3 className="plugin-title">Prefix</h3>
        <div className="plugin-content">
          <div className="form-group">
            <input
              type="text"
              value={config.prefix}
              onChange={(e) => setConfig({ ...config, prefix: e.target.value })}
              placeholder="Ej: !"
            />
          </div>
        </div>
      </div>

      {/* Levels */}
      <div className="plugin-section">
        <h3 className="plugin-title">Levels</h3>
        <div className="plugin-content">
          <div className="form-group">
            <label>Add New Level</label>
            <div className="flex gap-sm">
              <input
                type="text"
                placeholder="User/Role ID"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
              />
              <select
                value={newLevel}
                onChange={(e) => setNewLevel(parseInt(e.target.value))}
              >
                <option value={50}>Mod level</option>
                <option value={100}>Admin level</option>
              </select>
              <button
                className="btn-primary"
                onClick={() => {
                  if (newId.trim() && !config.levels[newId]) {
                    setConfig({
                      ...config,
                      levels: { ...config.levels, [newId]: newLevel },
                    });
                    setNewId("");
                  }
                }}
                disabled={!newId.trim()}
              >
                Add
              </button>
            </div>
          </div>

          <div className="levels-list">
            {Object.entries(config.levels).map(([id, level]) => (
              <div key={id} className="level-item">
                <span className="level-info">
                  ID: {id} → Level: {level}
                </span>
                <button
                  className="btn-icon"
                  onClick={() => {
                    const { [id]: _, ...rest } = config.levels;
                    setConfig({ ...config, levels: rest });
                  }}
                  aria-label="Remove level"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Other plugins */}
      <DefaultPlugins config={config} setConfig={setConfig} />
      <ConfigurablePlugins config={config} setConfig={setConfig} />
      <ModerationPlugins config={config} setConfig={setConfig} />
      <LogsPlugins config={config} setConfig={setConfig} />

      <YamlDisplay config={config} />
    </div>
  );
}
