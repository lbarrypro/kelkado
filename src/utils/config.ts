import Constants from 'expo-constants';

const { extra } = Constants.expoConfig || {};

export const apiUrl = extra?.apiUrl || 'Default API URL';
export const environment = extra?.environment || 'development';

console.log('config.ts :: API URL: ', apiUrl);
console.log('config.ts :: Environment: ', environment);
