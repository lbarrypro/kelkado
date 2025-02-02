import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useProducts } from '@/src/context/ProductsContext';
import ProductListItem from '@/src/components/product/ProductListItem';
import logger from '@/src/utils/logger';
import { router } from "expo-router";

export default function ExploreScreen() {
    const { fetchAllProducts } = useProducts(); // Récupération de la fonction du contexte

    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Fonction pour mélanger un tableau
    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    // Récupérer les produits depuis Supabase
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const fetchedProducts = await fetchAllProducts();

            const shuffledData = shuffleArray(fetchedProducts); // Mélanger les items
            setItems(shuffledData);
            logger.debug('Produits récupérés et mélangés:', shuffledData);
        } catch (error) {
            logger.error('Erreur lors de la récupération des produits:', error);
        } finally {
            setLoading(false);
        }
    };

    // Charger les produits au montage du composant
    useEffect(() => {
        fetchProducts();
    }, []);

    // Filtrage des items en fonction de la recherche
    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Barre de recherche */}
            <View style={styles.header}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher un produit..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Affichage des produits */}
            {loading ? (
                <ActivityIndicator size="large" color="#fff" style={styles.loader} />
            ) : (
                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    renderItem={({ item }) => <ProductListItem product={item} redirectTo="/explore/product" />}
                    contentContainerStyle={styles.grid}
                />
            )}
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
    itemPrice: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
    },
    loader: {
        marginTop: 50,
    },
});
