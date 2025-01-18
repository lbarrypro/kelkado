import { Stack } from 'expo-router';

export default function ListItemLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'List Details',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="edit"
                options={{
                    title: 'Edit List',
                    headerShown: true,
                    headerBackTitle: 'Back',
                }}
            />
        </Stack>
    );
}
