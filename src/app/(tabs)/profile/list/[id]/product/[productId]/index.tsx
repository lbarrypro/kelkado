import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useProducts } from '@/src/context/ProductsContext';
import logger from '@/src/utils/logger';
import WebViewModal from '@/src/components/WebViewModal'; // Assurez-vous d'importer votre composant WebViewModal

export default function ProductDetailScreen() {
    const { productId } = useLocalSearchParams(); // Récupération de l'ID du produit
    const { getProductById } = useProducts(); // Récupération de la fonction du contexte

    const [product, setProduct] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isWebViewVisible, setWebViewVisible] = useState(false); // État pour gérer la WebView

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!productId) {
                    throw new Error('Missing Product ID');
                }

                const fetchedProduct = await getProductById(productId as string);
                logger.info('ProductDetailScreen :: fetchProduct :: fetchedProduct: ', fetchedProduct);
                setProduct(fetchedProduct);
            } catch (err) {
                logger.error('ProductDetailScreen :: fetchProduct :: err: ', err);
                setError('Failed to fetch product details');
            }
        };

        fetchProduct();
    }, [productId, getProductById]);

    const handleViewProduct = () => {
        if (Platform.OS === 'web') {
            // Sur le web, ouvrir le lien dans un nouvel onglet
            window.open(product.url, '_blank');
        } else {
            // Sur mobile, ouvrir la WebView
            setWebViewVisible(true);
        }
    };

    if (!product && !error) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading product...</Text>
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
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <Text style={styles.productTitle}>{product.name}</Text>
            <Text style={styles.productPrice}>{product.price} {product.currency}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>

            {/* Bouton "View Product" */}
            <TouchableOpacity style={styles.buyButton} onPress={handleViewProduct}>
                <Text style={styles.buyButtonText}>View Product</Text>
            </TouchableOpacity>

            {/* WebView pour mobile */}
            {Platform.OS !== 'web' && (
                <WebViewModal
                    visible={isWebViewVisible}
                    url={product.url}
                    onClose={() => setWebViewVisible(false)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        padding: 20,
        alignItems: 'center',
    },
    productImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    productTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    productPrice: {
        color: '#4caf50',
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    productDescription: {
        color: '#ccc',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    buyButton: {
        backgroundColor: '#ff9800',
        padding: 15,
        borderRadius: 8,
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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
});
