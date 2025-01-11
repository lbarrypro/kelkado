import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AddScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Add Screen</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
    },
});
