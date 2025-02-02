import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useHomeFeed } from '@/src/context/HomeFeedContext';
import ProductCard from '@/src/components/product/ProductCard';

export default function HomeScreen() {
    const { products, followedIds, loading, error, followSuggestions } = useHomeFeed();

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
                {followSuggestions && followSuggestions.length > 0 ? (
                    <View>
                        <Text style={styles.suggestionText}>Here are some users you can follow:</Text>
                        <FlatList
                            data={followSuggestions}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.suggestionItem}>
                                    <Text>{item.username}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                ) : (
                    <Text style={styles.noSuggestionsText}>No suggestions available.</Text>
                )}
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
    suggestionText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    suggestionItem: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        marginVertical: 5,
        borderRadius: 5,
    },
    noSuggestionsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
        marginTop: 10,
    },
});
