import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Import correct

export default function ListContentScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams(); // Récupération des paramètres

    // Exemple de contenu pour une liste (à remplacer par une API ou une base de données)
    const listItems = [
        { id: '1', title: 'Item 1', image: 'https://via.placeholder.com/100' },
        { id: '2', title: 'Item 2', image: 'https://via.placeholder.com/100' },
        { id: '3', title: 'Item 3', image: 'https://via.placeholder.com/100' },
        { id: '4', title: 'Item 4', image: 'https://via.placeholder.com/100' },
        { id: '5', title: 'Item 5', image: 'https://via.placeholder.com/100' },
        { id: '6', title: 'Item 6', image: 'https://via.placeholder.com/100' },
    ];

    return (
        <View style={styles.container}>
            {/* Grid */}
            <FlatList
                data={listItems}
                keyExtractor={(item) => item.id}
                numColumns={3} // Nombre d'éléments par ligne
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.gridItem}>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.grid}
                ListEmptyComponent={<Text style={styles.emptyText}>No items found.</Text>}
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
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    grid: {
        padding: 16,
    },
    gridItem: {
        flex: 1,
        margin: 8,
        alignItems: 'center',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 8,
    },
    itemTitle: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
    emptyText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20,
    },
});
