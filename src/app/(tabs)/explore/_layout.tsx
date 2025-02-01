import { Stack } from 'expo-router';
import React from 'react';

export default function ExploreLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Explore" }} />
            <Stack.Screen name="product/[productId]" options={{ title: "Product Details" }} />
        </Stack>
    );
}
