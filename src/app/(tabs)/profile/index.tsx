import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DisplayProfile from '@/src/components/user/DisplayProfile';
import { useAuth } from '@/src/context/AuthContext';

export default function ProfileScreen() {
    const { user } = useAuth();

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Utilisateur non connecté</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <DisplayProfile userId={user.id} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        padding: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});
