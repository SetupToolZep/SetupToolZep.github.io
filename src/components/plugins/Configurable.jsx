import { useState } from "react";

export default function ConfigurablePlugins({ config, setConfig }) {
  const emojis = ["👍", "👎", "✅", "❌"];
  const [welcomeType, setWelcomeType] = useState("dm");
  const [welcomeChannelId, setWelcomeChannelId] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  const handleWelcomeTypeChange = (type) => {
    setWelcomeType(type);
    setConfig((prev) => ({
      ...prev,
      plugins: {
        ...prev.plugins,
        welcome_message: {
          config: {
            ...prev.plugins.welcome_message?.config,
            ...(type === "dm"
              ? { send_dm: true, send_to_channel: undefined }
              : {
                  send_dm: undefined,
                  send_to_channel: welcomeChannelId || "CHANNEL_ID_REQUIRED",
                }),
          },
        },
      },
    }));
  };

  const handleWelcomeChannelChange = (e) => {
    const channelId = e.target.value;
    setWelcomeChannelId(channelId);
    if (welcomeType === "channel") {
      setConfig((prev) => ({
        ...prev,
        plugins: {
          ...prev.plugins,
          welcome_message: {
            config: {
              ...prev.plugins.welcome_message?.config,
              send_to_channel: channelId,
            },
          },
        },
      }));
    }
  };

  const handleWelcomeMessageChange = (e) => {
    const message = e.target.value;
    setWelcomeMessage(message);
    setConfig((prev) => ({
      ...prev,
      plugins: {
        ...prev.plugins,
        welcome_message: {
          config: {
            ...prev.plugins.welcome_message?.config,
            message,
          },
        },
      },
    }));
  };

  const handleStarboardChange = (field, value) => {
    setConfig({
      ...config,
      plugins: {
        ...config.plugins,
        starboard: {
          ...config.plugins.starboard,
          [field]: value,
        },
      },
    });
  };

  const handleColorChange = (e) => {
    const rawValue = e.target.value;
    const hex = rawValue
      .replace(/[^0-9A-Fa-f]/g, "")
      .toUpperCase()
      .slice(0, 6);
    handleStarboardChange("color", hex ? `0x${hex}` : "0xFFD700");
  };

  return (
    <div className="plugin-section">
      <h3 className="plugin-title">Configurable Plugins</h3>

      <div className="plugin-content">
        {/* Common Plugin */}
        <div className="sub-section">
          <h4 className="sub-title">Common</h4>
          <div className="form-group">
            <label>Success Emoji</label>
            <select
              value={config.plugins.common?.success_emoji || ""}
              onChange={(e) =>
                setConfig({
                  ...config,
                  plugins: {
                    ...config.plugins,
                    common: {
                      ...config.plugins.common,
                      success_emoji: e.target.value,
                    },
                  },
                })
              }
            >
              {emojis.map((emoji) => (
                <option key={emoji} value={emoji}>
                  {emoji}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Error Emoji</label>
            <select
              value={config.plugins.common?.error_emoji || ""}
              onChange={(e) =>
                setConfig({
                  ...config,
                  plugins: {
                    ...config.plugins,
                    common: {
                      ...config.plugins.common,
                      error_emoji: e.target.value,
                    },
                  },
                })
              }
            >
              {emojis.map((emoji) => (
                <option key={emoji} value={emoji}>
                  {emoji}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Welcome Message Plugin */}
        <div className="sub-section">
          <h4 className="sub-title">Welcome Message</h4>
          <div className="form-group">
            <label>Notification Type</label>
            <div className="radio-group">
  <label className="custom-radio">
    <input
      type="radio"
      checked={welcomeType === "dm"}
      onChange={() => handleWelcomeTypeChange("dm")}
      className="styled-radio"
    />
    <span className="radio-circle"></span>
    DM Message
  </label>

  <label className="custom-radio">
    <input
      type="radio"
      checked={welcomeType === "channel"}
      onChange={() => handleWelcomeTypeChange("channel")}
      className="styled-radio"
    />
    <span className="radio-circle"></span>
    Message in Channel
  </label>
</div>
          </div>

          {welcomeType === "channel" && (
            <div className="form-group">
              <label>Channel ID</label>
              <input
                type="text"
                value={welcomeChannelId}
                onChange={handleWelcomeChannelChange}
                placeholder="1234567890"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Welcome Message</label>
            <textarea
              value={welcomeMessage}
              onChange={handleWelcomeMessageChange}
              placeholder="¡Welcome to the server!"
              rows={4}
            />
          </div>
        </div>

        {/* Starboard Plugin */}
        <div className="sub-section">
          <h4 className="sub-title">Starboard</h4>
          <div className="form-group">
            <label>Channel ID</label>
            <input
              type="text"
              value={config.plugins.starboard?.channel_id || ""}
              onChange={(e) =>
                handleStarboardChange("channel_id", e.target.value)
              }
              placeholder="1234567890"
            />
          </div>

          <div className="form-group">
            <label>Stars Required</label>
            <input
              type="number"
              min="1"
              value={config.plugins.starboard?.stars_required || 5}
              onChange={(e) =>
                handleStarboardChange(
                  "stars_required",
                  parseInt(e.target.value) || 5
                )
              }
            />
          </div>

          <div className="form-group">
            <label>HEX Color</label>
            <div className="color-input-group">
              <input
                type="text"
                value={
                  config.plugins.starboard?.color?.replace("0x", "") || "FFD700"
                }
                onChange={handleColorChange}
                placeholder="FFD700"
                maxLength={6}
                className="hex-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
