module.exports = function override(config, env) {
  const assetLoader = {
    test: /\.png/,
    type: "asset/resource",
    parser: {
      dataUrlCondition: {
        maxSize: 0,
      },
    },
    generator: {
      filename: "static/[name][ext]",
    },
  };

  const rule = config.module.rules.find((rule) => rule.oneOf);
  const oneOf = rule.oneOf.filter((loader) => loader.type !== "asset");
  oneOf.unshift(assetLoader);
  // oneOf
  config.module.rules[1].oneOf = oneOf;

  return config;
};
