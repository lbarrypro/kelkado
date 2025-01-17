import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useLists } from '@/src/context/ListsContext'; // Assure-toi que le contexte pour les listes existe

export default function Create() {
    const router = useRouter();
    const { user: authUser } = useAuth(); // Récupère l'utilisateur authentifié
    const { createList } = useLists(); // Fonction pour créer une liste
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [visibility, setVisibility] = useState<string>('private'); // Peut être 'public' ou 'private'
    const [error, setError] = useState<string | null>(null);

    const handleCreateList = async () => {
        if (!name || !description) {
            setError('Please fill in all fields');
            return;
        }

        try {
            if (!authUser) {
                throw new Error('User not authenticated');
            }

            // Appel à la fonction du contexte pour créer la liste
            await createList(authUser.id, name, description, visibility);

            // force le refresh de la page profile
            router.push('/profile');
        } catch (err) {
            setError('Error creating list');
        }
    };

    return (
        <View style={styles.container}>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <TextInput
                style={styles.input}
                placeholder="List Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <View style={styles.visibilityContainer}>
                <Text style={styles.visibilityLabel}>Visibility</Text>
                <TouchableOpacity
                    style={[styles.visibilityButton, visibility === 'private' && styles.selected]}
                    onPress={() => setVisibility('private')}
                >
                    <Text style={styles.visibilityButtonText}>Private</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.visibilityButton, visibility === 'public' && styles.selected]}
                    onPress={() => setVisibility('public')}
                >
                    <Text style={styles.visibilityButtonText}>Public</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleCreateList}>
                <Text style={styles.createButtonText}>Create List</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#25292e',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#1e2126',
        color: '#fff',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
    },
    visibilityContainer: {
        marginBottom: 20,
    },
    visibilityLabel: {
        color: '#fff',
        marginBottom: 10,
    },
    visibilityButton: {
        backgroundColor: '#1e2126',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    selected: {
        backgroundColor: '#ffd33d',
    },
    visibilityButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    createButton: {
        backgroundColor: '#ffd33d',
        padding: 15,
        borderRadius: 5,
    },
    createButtonText: {
        color: '#25292e',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
