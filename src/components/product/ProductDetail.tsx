import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import WebViewModal from '@/src/components/WebViewModal';
import { useProducts } from '@/src/context/ProductsContext';
import logger from '@/src/utils/logger';

interface ProductDetailProps {
    productId: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
    const { getProductById } = useProducts();
    const navigation = useNavigation();

    const [product, setProduct] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isWebViewVisible, setWebViewVisible] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!productId) throw new Error('Missing Product ID');

                const fetchedProduct = await getProductById(productId);
                logger.info('ProductDetail :: fetchProduct :: fetchedProduct: ', fetchedProduct);
                setProduct(fetchedProduct);

                // Mise à jour du titre du header
                navigation.setOptions({ title: fetchedProduct.name });
            } catch (err) {
                logger.error('ProductDetail :: fetchProduct :: err: ', err);
                setError('Failed to fetch product details');
            }
        };

        fetchProduct();
    }, [productId, getProductById, navigation]);

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

            <TouchableOpacity style={styles.buyButton} onPress={() => setWebViewVisible(true)}>
                <Text style={styles.buyButtonText}>View Product</Text>
            </TouchableOpacity>

            {Platform.OS !== 'web' && (
                <WebViewModal
                    visible={isWebViewVisible}
                    url={product.url}
                    onClose={() => setWebViewVisible(false)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#25292e', padding: 20, alignItems: 'center' },
    productImage: { width: 200, height: 200, borderRadius: 10, marginBottom: 20 },
    productTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
    productPrice: { color: '#4caf50', fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
    productDescription: { color: '#ccc', fontSize: 16, textAlign: 'center', marginBottom: 20 },
    buyButton: { backgroundColor: '#ff9800', padding: 15, borderRadius: 8 },
    buyButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    loadingText: { color: '#aaa', textAlign: 'center', marginTop: 20 },
    errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});

export default ProductDetail;
