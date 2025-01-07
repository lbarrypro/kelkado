import 'dotenv/config';

export default {
	expo: {
		extra: {
			EXPO_ROUTER_IMPORT_MODE: process.env.EXPO_ROUTER_IMPORT_MODE || 'filesystem',
			EXPO_ROUTER_APP_ROOT: process.env.EXPO_ROUTER_APP_ROOT || 'app',
			API_URL: process.env.API_URL || 'https://default-api.com',
		},
	},
};
