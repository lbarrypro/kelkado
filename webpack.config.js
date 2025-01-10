const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');

module.exports = async function (env, argv) {
	const config = await createExpoWebpackConfigAsync(env, argv);

	// Ajoute cette règle pour définir EXPO_ROUTER_APP_ROOT
	config.plugins.push(
		new webpack.DefinePlugin({
			'process.env.EXPO_ROUTER_APP_ROOT': JSON.stringify('./src/app'),
		})
	);

	return config;
};
