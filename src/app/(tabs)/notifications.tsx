import { View, Text, StyleSheet } from 'react-native';

console.log('### src/app/(tabs)/notifications.tsx');

export default function NotificationsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Here are your notifications!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25292e',
    },
    text: {
        color: '#fff',
        fontSize: 20,
    },
});
