import { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';

export default function EditList() {
    const [list, setList] = useState({ name: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { id } = useSearchParams(); // Récupère l'ID de la liste

    useEffect(() => {
        // Récupérez les données de la liste par ID
        const fetchList = async () => {
            try {
                // Remplacez par votre fonction pour obtenir les détails
                const data = { name: 'Sample List', description: 'Sample Description' };
                setList(data);
            } catch (error) {
                console.error('Failed to fetch list:', error);
            }
        };

        fetchList();
    }, [id]);

    const handleSave = async () => {
        setIsLoading(true);

        try {
            // Remplacez par votre fonction pour mettre à jour la liste
            console.log('Updating list:', list);

            router.back(); // Retour à la page précédente
        } catch (error) {
            console.error('Failed to update list:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="List Name"
                value={list.name}
                onChangeText={(value) => setList({ ...list, name: value })}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={list.description}
                onChangeText={(value) => setList({ ...list, description: value })}
            />
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <Button title="Save Changes" onPress={handleSave} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
});
