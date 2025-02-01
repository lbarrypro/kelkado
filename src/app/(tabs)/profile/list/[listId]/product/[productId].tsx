import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ProductDetail from '@/src/components/product/ProductDetail';

export default function ProductDetailScreen() {
    const { productId } = useLocalSearchParams();
    if (!productId) return null;

    return <ProductDetail productId={productId as string} />;
}
