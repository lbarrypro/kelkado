import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

console.log('### src/app/(tabs)/home.tsx');

export default function HomeScreen() {
    // Exemple de données statiques
    const feedItems = [
        {
            id: '1',
            user: 'JohnDoe',
            userImage: 'https://via.placeholder.com/50',
            contentImage: 'https://via.placeholder.com/300x200',
            description: 'Beautiful view from the mountains!',
            time: '2 hours ago',
        },
        {
            id: '2',
            user: 'JaneSmith',
            userImage: 'https://via.placeholder.com/50',
            contentImage: 'https://via.placeholder.com/300x200',
            description: 'Had an amazing day at the beach 🌊',
            time: '5 hours ago',
        },
        {
            id: '3',
            user: 'MikeBrown',
            userImage: 'https://via.placeholder.com/50',
            contentImage: 'https://via.placeholder.com/300x200',
            description: 'Sunset vibes 🌅',
            time: '1 day ago',
        },
    ];

    return (
        <View style={styles.container}>
            {/* Feed */}
            <FlatList
                data={feedItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.feedItem}>
                        {/* User Info */}
                        <View style={styles.userInfo}>
                            <Image source={{ uri: item.userImage }} style={styles.userImage} />
                            <Text style={styles.userName}>{item.user}</Text>
                            <Text style={styles.time}>{item.time}</Text>
                        </View>

                        {/* Content Image */}
                        <Image source={{ uri: item.contentImage }} style={styles.contentImage} />

                        {/* Description */}
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                )}
                contentContainerStyle={styles.feed}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No posts to show. Follow more users to see their posts!</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
    },
    header: {
        padding: 16,
        backgroundColor: '#1e2126',
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    feed: {
        padding: 16,
    },
    feedItem: {
        marginBottom: 16,
        backgroundColor: '#1e2126',
        borderRadius: 10,
        overflow: 'hidden',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        color: '#fff',
        fontWeight: 'bold',
        flex: 1,
    },
    time: {
        color: '#aaa',
        fontSize: 12,
    },
    contentImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    description: {
        color: '#fff',
        padding: 10,
        fontSize: 14,
    },
    emptyText: {
        color: '#aaa',
        textAlign: 'center',
        marginVertical: 20,
    },
});
