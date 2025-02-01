import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useHomeFeed } from '@/src/context/HomeFeedContext';
import ProductCard from '@/src/components/product/ProductCard';

export default function HomeScreen() {
    const { products, followedIds, loading, error } = useHomeFeed();

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
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

    // Nobody to follow
    if (followedIds.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noFollowText}>You are not following anyone.</Text>
            </View>
        );
    }

    // No products to show
    if (products.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noProductsText}>No products found from followed users.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={({ item }) => <ProductCard product={item} />}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    noFollowText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
    },
    noProductsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
    },
});
