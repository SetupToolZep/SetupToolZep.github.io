import { useState } from "react";

export default function ModerationPlugins({ config, setConfig }) {
  const [actionType, setActionType] = useState("dm");
  const [messageChannelId, setMessageChannelId] = useState("");

  const handleActionTypeChange = (type) => {
    setActionType(type);

    const newConfig = { ...config };

    if (type === "dm") {
      newConfig.plugins.mod_actions = {
        config: {
          dm_on_warn: true,
          dm_on_kick: true,
          dm_on_ban: true,
        },
      };
      newConfig.plugins.mutes = {
        config: {
          dm_on_mute: true,
          dm_on_update: true,
        },
      };
      delete newConfig.plugins.mod_actions?.config?.message_channel;
      delete newConfig.plugins.mutes?.config?.message_channel;
    } else {
      newConfig.plugins.mod_actions = {
        config: {
          message_on_warn: true,
          message_on_kick: true,
          message_on_ban: true,
          message_channel: messageChannelId || "CHANNEL_ID_REQUIRED",
        },
      };
      newConfig.plugins.mutes = {
        config: {
          message_on_mute: true,
          message_on_update: true,
          message_channel: messageChannelId || "CHANNEL_ID_REQUIRED",
        },
      };
      delete newConfig.plugins.mod_actions?.config?.dm_on_warn;
      delete newConfig.plugins.mod_actions?.config?.dm_on_kick;
      delete newConfig.plugins.mod_actions?.config?.dm_on_ban;
      delete newConfig.plugins.mutes?.config?.dm_on_mute;
      delete newConfig.plugins.mutes?.config?.dm_on_update;
    }

    setConfig(newConfig);
  };

  const handleCasesChannelChange = (e) => {
    const channelId = e.target.value;
    setConfig({
      ...config,
      plugins: {
        ...config.plugins,
        cases: {
          config: {
            case_log_channel: channelId,
          },
        },
      },
    });
  };

  const handleMessageChannelChange = (e) => {
    const channelId = e.target.value;
    setMessageChannelId(channelId);

    if (actionType === "message") {
      setConfig({
        ...config,
        plugins: {
          ...config.plugins,
          mod_actions: {
            config: {
              ...config.plugins.mod_actions?.config,
              message_channel: channelId,
            },
          },
          mutes: {
            config: {
              ...config.plugins.mutes?.config,
              message_channel: channelId,
            },
          },
        },
      });
    }
  };

  return (
    <div className="plugin-section">
      <h3 className="plugin-title">Moderation Plugins</h3>

      <div className="plugin-content">
        {/* Cases */}
        <div className="sub-section">
          <h4 className="sub-title">Cases</h4>
          <div className="form-group">
            <label>
              Case Log Channel ID:
              <input
                type="text"
                value={config.plugins.cases?.config?.case_log_channel || ""}
                onChange={handleCasesChannelChange}
                placeholder="1234567890"
                required
              />
            </label>
          </div>
        </div>

        {/* Mod actions and mute */}
        <div className="sub-section">
          <h4 className="sub-title">Notification Type</h4>
          <div className="radio-group">
            <label className="custom-radio">
              <input
                type="radio"
                checked={actionType === "dm"}
                onChange={() => handleActionTypeChange("dm")}
                className="styled-radio"
              />
              <span className="radio-circle"></span>
              DM on Action
            </label>

            <label className="custom-radio">
              <input
                type="radio"
                checked={actionType === "message"}
                onChange={() => handleActionTypeChange("message")}
                className="styled-radio"
              />
              <span className="radio-circle"></span>
              Message on Action
            </label>
          </div>

          {actionType === "message" && (
            <div className="form-group">
              <label>
                Message Channel ID:
                <input
                  type="text"
                  value={messageChannelId}
                  onChange={handleMessageChannelChange}
                  placeholder="9876543210"
                  required
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
