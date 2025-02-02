import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import ProductListItem from '@/src/components/product/ProductListItem';
import logger from '@/src/utils/logger';

interface DisplayListProps {
    listId: string;
    getListById: (listId: string) => Promise<any>;
    getProductsByList: (listId: string) => Promise<any>;
    canEdit?: boolean; // Permet d'afficher ou non le bouton "Edit"
}

const DisplayList: React.FC<DisplayListProps> = ({ listId, getListById, getProductsByList, canEdit = false }) => {
    const [listData, setListData] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!listId) throw new Error('Missing List ID');

                const fetchedList = await getListById(listId);
                logger.info('Fetched list:', fetchedList);
                setListData(fetchedList);

                const fetchedProducts = await getProductsByList(listId);
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
    }, [listId, getListById, getProductsByList]);

    if (loading) {
        return <Text style={styles.loadingText}>Loading data...</Text>;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Détails de la liste */}
            {listData && (
                <View style={styles.listDetails}>
                    <Text style={styles.listDescription}>{listData.description}</Text>
                    <Text style={styles.listVisibility}>Visibility: {listData.visibility}</Text>

                    {canEdit && (
                        <TouchableOpacity
                            onPress={() => router.push(`/profile/list/${listId}/edit`)}
                            style={styles.editButton}
                        >
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Produits de la liste */}
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={({ item }) => (
                    <ProductListItem
                        product={item}
                        redirectTo={`/profile/list/${listId}/product/${item.id}`}
                        listId={listId}
                    />
                )}
                contentContainerStyle={styles.grid}
                ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
    },
    listDetails: {
        padding: 16,
        backgroundColor: '#333',
        borderRadius: 8,
        marginBottom: 16,
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
    editButton: {
        padding: 10,
        backgroundColor: '#4caf50',
        borderRadius: 8,
        marginTop: 10,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    grid: {
        padding: 16,
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

export default DisplayList;
