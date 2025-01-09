import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { router } from "expo-router";

console.log('### src/app/(tabs)/profile.tsx');

export default function ProfileScreen() {
    // Exemple de données utilisateur
    const user = {
        profileImage: 'https://via.placeholder.com/100', // Remplace avec une vraie URL
        username: 'john_doe',
        followers: 1200,
        following: 340,
    };

    // Exemple de listes de l'utilisateur
    const userLists = [
        { id: '1', title: 'Wish List' },
        { id: '2', title: 'Travel Goals' },
        { id: '3', title: 'Books to Read' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{user.username}</Text>
                    <View style={styles.stats}>
                        <Text style={styles.statItem}>
                            <Text style={styles.statNumber}>{user.followers}</Text> Followers
                        </Text>
                        <Text style={styles.statItem}>
                            <Text style={styles.statNumber}>{user.following}</Text> Following
                        </Text>
                    </View>
                </View>
            </View>

            {/* Menu */}
            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>+ Create New List</Text>
                </TouchableOpacity>
            </View>

            {/* Listes */}
            <View style={styles.listsContainer}>
                <FlatList
                    data={userLists}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => router.push(`/list/${item.id}`)} // Navigue vers la page de la liste
                        >
                            <Text style={styles.listItemText}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No lists found.</Text>}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
    },
    header: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#1e2126',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 16,
    },
    userInfo: {
        justifyContent: 'center',
    },
    username: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    stats: {
        flexDirection: 'row',
        marginTop: 8,
    },
    statItem: {
        color: '#fff',
        marginRight: 16,
        fontSize: 14,
    },
    statNumber: {
        fontWeight: 'bold',
    },
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#1e2126',
    },
    menuButton: {
        borderWidth: 1,
        borderColor: '#ffd33d',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    menuButtonText: {
        color: '#ffd33d',
        fontSize: 14,
    },
    primaryButton: {
        backgroundColor: '#ffd33d',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    primaryButtonText: {
        color: '#25292e',
        fontSize: 14,
        fontWeight: 'bold',
    },
    listsContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    listItem: {
        backgroundColor: '#1e2126',
        padding: 16,
        marginBottom: 12,
        borderRadius: 5,
    },
    listItemText: {
        color: '#fff',
        fontSize: 16,
    },
    emptyText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20,
    },
});
