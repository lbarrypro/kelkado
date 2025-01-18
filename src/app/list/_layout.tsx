import { Stack } from 'expo-router';

export default function ListLayout() {
    return (
        <Stack>
            {/* Vue principale des listes */}
            <Stack.Screen
                name="index"
                options={{
                    title: 'Your Lists',
                    headerShown: true,
                }}
            />
            {/* Vue de création */}
            <Stack.Screen
                name="create"
                options={{
                    title: 'Create List',
                    headerShown: true,
                    headerBackTitle: 'Back', // Texte du bouton précédent
                }}
            />
        </Stack>
    );
}
