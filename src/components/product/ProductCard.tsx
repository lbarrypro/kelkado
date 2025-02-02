import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProductCard({ product }) {
    const router = useRouter();

    return (
        <View style={styles.card}>
            {/* Header avec l'avatar et le username */}
            <View style={styles.header}>
                {/* TouchableOpacity pour rediriger vers le profil utilisateur */}
                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => router.push(`/user/${product.owner_id}`)}
                >
                    <View style={styles.avatarPlaceholder} />
                    <Text style={styles.username}>{product.owner_username}</Text>
                </TouchableOpacity>

                {/* TouchableOpacity pour "Voir" les détails du produit */}
                <TouchableOpacity
                    style={styles.seeButton}
                    onPress={() => router.push(`/home/product/${product.id}`)}
                >
                    <Text style={styles.seeText}>Voir</Text>
                </TouchableOpacity>
            </View>

            {/* Image principale du produit */}
            <Image source={{ uri: product.image }} style={styles.image} />

            {/* Infos produit */}
            <View style={styles.details}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>{product.price} {product.currency}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#000',
        borderRadius: 10,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Pour aligner "Voir" à droite
        padding: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#555',
        marginRight: 10,
    },
    username: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    seeButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#4caf50',
        borderRadius: 20,
    },
    seeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 350,
        resizeMode: 'cover',
    },
    details: {
        padding: 10,
    },
    name: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        color: '#4caf50',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
    },
});
