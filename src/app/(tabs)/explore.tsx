import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import logger from '@/src/utils/logger';  // Import de ton logger personnalisé

export default function ExploreScreen() {
    const [items, setItems] = useState(
        Array.from({ length: 20 }, (_, i) => ({
            id: `${i + 1}`,
            title: `Item ${i + 1}`,
            image: 'https://via.placeholder.com/100',
        }))
    );
    const [searchQuery, setSearchQuery] = useState('');

    // Fonction simulant le lazy loading
    const loadMoreItems = () => {
        logger.debug('Chargement de nouveaux items...');
        const newItems = Array.from({ length: 10 }, (_, i) => ({
            id: `${items.length + i + 1}`,
            title: `Item ${items.length + i + 1}`,
            image: 'https://via.placeholder.com/100',
        }));
        setItems((prevItems) => [...prevItems, ...newItems]);
        logger.debug('Items après chargement:', { items: [...items, ...newItems] });
    };

    // Filtrage des items en fonction de la recherche
    const filteredItems = items.filter((item) => {
        const match = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        logger.debug(`Filtrage de l'élément "${item.title}": ${match ? 'Correspond' : 'Ne correspond pas'}`);
        return match;
    });

    // Log quand la recherche change
    const handleSearchChange = (text: string) => {
        logger.debug('Recherche modifiée:', { searchQuery: text });
        setSearchQuery(text);
    };

    return (
        <View style={styles.container}>
            {/* Barre de recherche */}
            <View style={styles.header}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search items..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                />
            </View>

            {/* Grid */}
            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                numColumns={3} // Nombre d'éléments par ligne
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.gridItem}>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.grid}
                onEndReached={loadMoreItems} // Charge plus d'items à la fin du scroll
                onEndReachedThreshold={0.5} // Se déclenche lorsque 50% du contenu est visible
                ListFooterComponent={
                    <Text style={styles.loadingText}>Loading more items...</Text>
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
    searchInput: {
        backgroundColor: '#333',
        color: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        fontSize: 16,
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
    loadingText: {
        color: '#aaa',
        textAlign: 'center',
        marginVertical: 16,
    },
});
