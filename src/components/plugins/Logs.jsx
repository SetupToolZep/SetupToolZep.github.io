import { useState } from "react";
import { EVENT_GROUPS } from "../../utils/constants";

export default function LogsPlugins({ config, setConfig }) {
  const [newChannelId, setNewChannelId] = useState("");
  const allGroups = Object.keys(EVENT_GROUPS);
  const logsConfig = config.plugins.logs || { channels: {} };

  const addChannel = () => {
    if (!newChannelId.trim()) return;

    setConfig({
      ...config,
      plugins: {
        ...config.plugins,
        logs: {
          channels: {
            ...logsConfig.channels,
            [newChannelId]: { include: [] },
          },
        },
      },
    });
    setNewChannelId("");
  };

  const removeChannel = (channelId) => {
    const { [channelId]: _, ...remainingChannels } = logsConfig.channels;
    setConfig({
      ...config,
      plugins: {
        ...config.plugins,
        logs: { channels: remainingChannels },
      },
    });
  };

  const toggleGroupForChannel = (channelId, group) => {
    const currentGroups = getSelectedGroupsForChannel(channelId);
    const newGroups = currentGroups.includes(group)
      ? currentGroups.filter((g) => g !== group)
      : [...currentGroups, group];

    const allSelected = newGroups.length === allGroups.length;

    setConfig({
      ...config,
      plugins: {
        ...config.plugins,
        logs: {
          channels: {
            ...logsConfig.channels,
            [channelId]: allSelected
              ? { exclude: [] }
              : { include: newGroups.flatMap((g) => EVENT_GROUPS[g]) },
          },
        },
      },
    });
  };

  const getSelectedGroupsForChannel = (channelId) => {
    const channelConfig = logsConfig.channels[channelId] || {};
    if (channelConfig.exclude?.length === 0) return allGroups;
    if (!channelConfig.include) return [];
    return allGroups.filter((g) =>
      EVENT_GROUPS[g].some((e) => channelConfig.include.includes(e))
    );
  };

  return (
    <div className="plugin-section">
      <h3 className="plugin-title">Logs Configuration</h3>
      <div className="plugin-content">
        <div className="form-group">
          <label>Add Log Channel</label>
          <div className="flex gap-sm">
            <input
              type="text"
              value={newChannelId}
              onChange={(e) => setNewChannelId(e.target.value)}
              placeholder="Channel ID"
              className="flex-1"
            />
            <button
              onClick={addChannel}
              className="btn-primary"
              disabled={!newChannelId.trim()}
            >
              Add Channel
            </button>
          </div>
        </div>

        <div className="channels-list">
          {Object.entries(logsConfig.channels).map(([channelId]) => (
            <div key={channelId} className="channel-card">
              <div className="channel-header">
                <h4 className="channel-title">Channel: {channelId}</h4>
                <button
                  onClick={() => removeChannel(channelId)}
                  className="btn-icon"
                  aria-label={`Remove channel ${channelId}`}
                >
                  Remove
                </button>
              </div>

              <div className="form-group">
                <label>Event Groups</label>
                <div className="event-groups-grid">
                  {allGroups.map((group) => (
                    <label key={group} className="event-group">
                      <input
                        type="checkbox"
                        checked={getSelectedGroupsForChannel(
                          channelId
                        ).includes(group)}
                        onChange={() => toggleGroupForChannel(channelId, group)}
                        className="event-checkbox"
                      />
                      <span className="event-label">
                        {group}{" "}
                        <span className="event-count">
                          ({EVENT_GROUPS[group].length} events)
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
