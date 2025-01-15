jest.mock('expo-constants', () => ({
	...jest.requireActual('expo-constants'),
	platform: { os: 'ios' }, // ou 'android' selon vos besoins
}));
