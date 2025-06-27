import YAML from "yaml";

export function generateYaml(config) {
  const yamlObject = {
    prefix: config.prefix,
    levels: config.levels,
    plugins: {},
  };

  ["utility", "reminders", "slowmode", "time_and_date", "tags"].forEach(
    (plugin) => {
      if (config.plugins[plugin]) {
        yamlObject.plugins[plugin] = {};
      }
    }
  );

  if (config.plugins.automod) {
    yamlObject.plugins.automod = {
      config: {
        rules: {
          basic_rule: {
            triggers: [
              { message_spam: { amount: 10, within: "10s" } },
              { message_spam: { amount: 3, within: "5s" } },
              { sticker_spam: { amount: 5, within: "10s" } },
              { mention_spam: { amount: 5, within: "10s" } },
              { emoji_spam: { amount: 3, within: "5s" } },
              { attachment_spam: { amount: 3, within: "10s" } },
              { match_invites: {} },
            ],
            actions: {
              clean: true,
              mute: {
                duration: "5m",
                reason: "Auto-muted for spam",
              },
            },
          },
        },
      },
    };
  }

  if (config.plugins.common?.success_emoji) {
    yamlObject.plugins.common = {
      config: {
        success_emoji: config.plugins.common.success_emoji,
        error_emoji: config.plugins.common.error_emoji || "❌",
      },
    };
  }

  if (config.plugins.welcome_message?.config) {
    const welcomeConfig = config.plugins.welcome_message.config;
    yamlObject.plugins.welcome_message = {
      config: {
        ...(welcomeConfig.send_dm !== undefined && {
          send_dm: welcomeConfig.send_dm,
        }),
        ...(welcomeConfig.send_to_channel !== undefined && {
          send_to_channel: welcomeConfig.send_to_channel,
        }),
        message: `\n${welcomeConfig.message || ""}`,
      },
    };
  }

  if (config.plugins.starboard?.channel_id) {
    yamlObject.plugins.starboard = {
      config: {
        boards: {
          basic: {
            channel_id: config.plugins.starboard.channel_id,
            stars_required: config.plugins.starboard.stars_required || 5,
            color: config.plugins.starboard.color || "0xFFD700",
          },
        },
      },
    };
  }

  if (config.plugins.cases?.config?.case_log_channel) {
    yamlObject.plugins.cases = {
      config: {
        case_log_channel: config.plugins.cases.config.case_log_channel,
      },
    };
  }

  if (config.plugins.mod_actions?.config) {
    yamlObject.plugins.mod_actions = {
      config: { ...config.plugins.mod_actions.config },
    };
    Object.keys(yamlObject.plugins.mod_actions.config).forEach((key) => {
      if (yamlObject.plugins.mod_actions.config[key] === undefined) {
        delete yamlObject.plugins.mod_actions.config[key];
      }
    });
  }

  if (config.plugins.mutes?.config) {
    yamlObject.plugins.mutes = { config: { ...config.plugins.mutes.config } };
    Object.keys(yamlObject.plugins.mutes.config).forEach((key) => {
      if (yamlObject.plugins.mutes.config[key] === undefined) {
        delete yamlObject.plugins.mutes.config[key];
      }
    });
  }

  if (config.plugins.logs?.channels) {
    yamlObject.plugins.logs = { config: { channels: {} } };
    Object.entries(config.plugins.logs.channels).forEach(
      ([channelId, channelConfig]) => {
        yamlObject.plugins.logs.config.channels[channelId] =
          channelConfig.exclude?.length === 0
            ? { exclude: [] }
            : { include: channelConfig.include || [] };
      }
    );
  }

  let yamlString = YAML.stringify(yamlObject, {
    lineWidth: -1,
    defaultStringType: "PLAIN",
    styles: {
      "!!null": "empty",
      "!!str": {
        defaultType: "PLAIN",
        quoteSingle: (value) => (value.includes("|-\n") ? false : true),
      },
    },
  });

  yamlString = yamlString
    .replace(/reason: (Auto-muted for spam)/g, 'reason: "$1"')
    .replace(/color: ("?)(0x[0-9A-F]{6})("?)/g, "color: $2");

  return yamlString;
}
