import 'dotenv/config'; // Charge les variables d'environnement depuis le fichier .env

export default ({ config }: { config: any }) => ({
	expo: {
		name: 'kelkado',
		slug: 'kelkado',
		version: '1.0.0',
		entryPoint: 'index.ts',
		orientation: 'portrait',
		icon: './assets/images/logo.png',
		scheme: 'myapp',
		userInterfaceStyle: 'automatic',
		newArchEnabled: true,
		splash: {
			image: './assets/images/logo.png',
			resizeMode: 'contain',
			backgroundColor: '#ffffff'
		},
		ios: {
			supportsTablet: true,
			orientation: 'portrait',  // Ajouter ici pour forcer le mode portrait
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/images/adaptive-icon.png',
				backgroundColor: '#ffffff',
			},
			orientation: 'portrait',  // Ajouter ici pour forcer le mode portrait
		},
		web: {
			bundler: 'metro',
			output: 'static',
			favicon: './assets/images/favicon.png',
			build: {
				babel: {
					plugins: ['react-native-web'],
				},
			},
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
			// Variables d'environnement injectées
			environment: process.env.NODE_ENV || 'development',

			apiUrl: process.env.API_URL,
			authProviderUrl: process.env.EXPO_PUBLIC_AUTHPROVIDER_URL,
			authProviderKey: process.env.EXPO_PUBLIC_AUTHPROVIDER_KEY,

			// Configuration spécifique à Expo Router
			EXPO_ROUTER_IMPORT_MODE: process.env.EXPO_ROUTER_IMPORT_MODE || 'sync',
			EXPO_ROUTER_APP_ROOT: process.env.EXPO_ROUTER_APP_ROOT || 'src/app',

			// Configuration pour EAS (Expo Application Services)
			eas: {
				projectId: 'fdff3655-7aae-482a-90f5-d79435366ad7',
			},
		},
		owner: 'lbarrypro', // Remplacez par votre nom de propriétaire si nécessaire
	},
});
