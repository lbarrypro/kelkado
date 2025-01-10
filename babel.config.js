module.exports = function (api) {
	api.cache(true);

	const envFile =
		process.env.NODE_ENV === 'production'
			? '.env.production'
			: process.env.NODE_ENV === 'staging'
				? '.env.staging'
				: '.env.development'; // Par défaut, développement.

	return {
		presets: ['babel-preset-expo'],
		plugins: [
			[
				'module-resolver',
				{
					root: ['./'],
					alias: {
						'@assets': './assets',
						'@components': './src/components',
						'@hooks': './src/hooks',
						'@screens': './screens',
						'@utils': './src/utils',
						'@app': './app',
					},
					extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
				},
			],
			[
				'module:react-native-dotenv',
				{
					moduleName: '@env',
					path: envFile, // Charge dynamiquement le fichier `.env`
					blacklist: null,
					whitelist: null,
					safe: false,
					allowUndefined: true,
				},
			],
		],
	};
};
