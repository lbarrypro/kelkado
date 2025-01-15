module.exports = {
	preset: 'jest-expo',
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
	},
	setupFiles: [
		// '<rootDir>/jest.setup.js',
	],
	setupFilesAfterEnv: ['./jest.setup.js'],
	testPathIgnorePatterns: [
		'/node_modules/',
		'/dist/',
		'/build/',
		'/.expo/.*',
	],
	testEnvironment: 'jsdom', // Utilisé pour les tests basés sur React Native
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1', // Si tu utilises des alias comme '@/src', cela fonctionne
	},
};
