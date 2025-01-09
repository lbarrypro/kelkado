import 'dotenv/config';

export default ({ config }: { config: any }) => ({
	expo: {
		name: 'kelkado',
		slug: 'kelkado',
		version: '1.0.0',
		entryPoint: 'index.ts',
		orientation: 'portrait',
		icon: './assets/images/icon.png',
		scheme: 'myapp',
		userInterfaceStyle: 'automatic',
		newArchEnabled: true,
		ios: {
			supportsTablet: true,
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/images/adaptive-icon.png',
				backgroundColor: '#ffffff',
			},
		},
		web: {
			bundler: 'metro',
			output: 'static',
			favicon: './assets/images/favicon.png',
			build: {
				babel: {
					plugins: ['react-native-web']
				}
			}
		},
		plugins: [
			'expo-router',
			[
				'expo-splash-screen',
				{
					image: './assets/images/splash-icon.png',
					imageWidth: 200,
					resizeMode: 'contain',
					backgroundColor: '#ffffff',
				},
			],
		],
		experiments: {
			typedRoutes: true,
		},
		extra: {
			router: {
				origin: false,
			},
			eas: {
				projectId: 'fdff3655-7aae-482a-90f5-d79435366ad7',
			},
			// Ajout de variables d'environnement pour un accès dynamique
			apiUrl: process.env.API_URL,
			environment: process.env.NODE_ENV || 'development',
			EXPO_ROUTER_IMPORT_MODE: process.env.EXPO_ROUTER_IMPORT_MODE || 'filesystem',
			EXPO_ROUTER_APP_ROOT: process.env.EXPO_ROUTER_APP_ROOT || 'src',
		},
		owner: 'lbarrypro',
	},
});
