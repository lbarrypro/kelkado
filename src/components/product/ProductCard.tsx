import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProductCard({ product }) {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/home/product/${product.id}`)}
        >
            <Image source={{ uri: product.image }} style={styles.image} />
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>{product.price} {product.currency}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#333', padding: 10, borderRadius: 10, marginBottom: 10 },
    image: { width: '100%', height: 150, borderRadius: 10 },
    title: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 5 },
    price: { color: '#4caf50', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
});
