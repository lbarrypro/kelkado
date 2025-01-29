import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useLists } from '@/src/context/ListsContext';
import { useNavigation } from '@react-navigation/native';
import logger from '@/src/utils/logger';

export default function ListContentScreen() {
    const { id } = useLocalSearchParams(); // Récupération de l'ID depuis l'URL
    const { getListById, getProductsByList } = useLists(); // Récupérer les fonctions depuis ListsContext
    const navigation = useNavigation();

    const [listData, setListData] = useState(null); // Détails de la liste
    const [products, setProducts] = useState([]); // Liste des produits
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) throw new Error('Missing List ID');

                // Récupération des détails de la liste
                const fetchedList = await getListById(id);
                logger.info('Fetched list:', fetchedList);
                setListData(fetchedList);

                if (fetchedList?.title) {
                    navigation.setOptions({ title: fetchedList.title });
                }

                // Récupération des produits associés à la liste
                const fetchedProducts = await getProductsByList(id);
                logger.info('Fetched products:', fetchedProducts);
                setProducts(fetchedProducts);
            } catch (err) {
                logger.error('Error fetching data:', err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, getListById, getProductsByList, navigation]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Affichage des détails de la liste */}
            {listData && (
                <View style={styles.listDetails}>
                    {/* <Text style={styles.listTitle}>{listData.title}</Text> */}
                    <Text style={styles.listDescription}>{listData.description}</Text>
                    <Text style={styles.listVisibility}>Visibility: {listData.visibility}</Text>
                    <TouchableOpacity
                        onPress={() => router.push(`/profile/list/${id}/edit`)}
                        style={styles.editButton}
                    >
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Affichage des produits */}
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => router.push(`/profile/list/${id}/product/${item.id}`)}
                        style={styles.gridItem}
                    >
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        <Text style={styles.itemPrice}>{item.price} {item.currency}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.grid}
                ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingVertical: 16,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    editButton: {
        padding: 10,
        backgroundColor: '#4caf50',
        borderRadius: 8,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    listDetails: {
        padding: 16,
        backgroundColor: '#333',
        borderRadius: 8,
        marginBottom: 16,
    },
    listTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    listDescription: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 8,
    },
    listVisibility: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 4,
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
    loadingText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20,
    },
});
