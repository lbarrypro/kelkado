import { Stack } from 'expo-router';
import React from 'react';

export default function ListLayout() {
    return (
        <Stack>
            <Stack.Screen name="[listId]" options={{ headerShown: false }} />
        </Stack>
    );
}
