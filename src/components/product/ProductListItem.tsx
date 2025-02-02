import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from "expo-router";

export default function ProductListItem({ product: string, redirectTo: string }) {
    const handlePress = () => {
        router.push(`${redirectTo}/${product.id}`); // URL dynamique
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.gridItem}>
            <Image source={{ uri: product.image }} style={styles.itemImage} />
            <Text style={styles.itemTitle}>{product.name}</Text>
            <Text style={styles.itemPrice}>{product.price} {product.currency}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
});
