const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
	...config.transformer,
	enableBabelRCLookup: true,
};

config.resolver = {
	...config.resolver,
	extraNodeModules: {
		process: require.resolve('process'),
	},
};

module.exports = config;
