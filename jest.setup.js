jest.mock('@react-native-async-storage/async-storage', () => {
	let mockAsyncStorage = {};
	return {
		setItem: jest.fn((key, value) => {
			mockAsyncStorage[key] = value;
			return Promise.resolve();
		}),
		getItem: jest.fn((key) => Promise.resolve(mockAsyncStorage[key] || null)),
		removeItem: jest.fn((key) => {
			delete mockAsyncStorage[key];
			return Promise.resolve();
		}),
		clear: jest.fn(() => {
			mockAsyncStorage = {};
			return Promise.resolve();
		}),
	};
});
