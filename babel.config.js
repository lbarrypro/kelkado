module.exports = function (api) {
	api.cache(true);

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
			'inline-dotenv', // Garde l'option pour charger les variables d'environnement si nécessaire
		],
	};
};
