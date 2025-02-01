import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useUserProfiles } from '@/src/context/UserProfilesContext';
import { useAuth } from '@/src/context/AuthContext';

export default function AddScreen() {
    const { user } = useAuth(); // Récupère l'utilisateur courant depuis le contexte
    const [productURL, setProductURL] = useState('');
    const [followSuggestions, setFollowSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { followUser, getOtherUsers } = useUserProfiles();

    // Fonction pour soumettre l'URL du produit
    const handleSubmit = () => {
        if (productURL) {
            // Ici tu feras la logique pour envoyer l'URL à ton backend ou Supabase
            console.log('Produit soumis:', productURL);
            setProductURL(''); // Réinitialiser le champ après soumission
        }
    };

    // Fonction pour ajouter un utilisateur à la liste des suivis
    const handleFollowUser = async (followedId: string) => {
        if (!user) return;

        try {
            await followUser(user.id, followedId);
            setFollowSuggestions(prevSuggestions =>
                prevSuggestions.filter(user => user.id !== followedId) // Retirer l'utilisateur suivi de la liste
            );
            console.log(`Utilisateur ${followedId} ajouté aux suivis.`);
        } catch (err) {
            console.error('Erreur lors du suivi de l\'utilisateur:', err);
        }
    };

    // Récupérer les utilisateurs à suivre (autres que l'utilisateur courant)
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!user) return; // Si l'utilisateur n'est pas encore connecté, ne pas récupérer les suggestions

            setIsLoading(true);
            try {
                const users = await getOtherUsers(user.id);
                setFollowSuggestions(users);
            } catch (err) {
                setError('Erreur lors du chargement des suggestions.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, [user]); // Rafraîchir la liste des utilisateurs chaque fois que l'utilisateur courant change

    return (
        <View style={styles.container}>
            {/* Formulaire pour ajouter une URL de produit */}
            <View style={styles.formSection}>
                <Text style={styles.title}>Ajouter un produit</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Collez l'URL du produit"
                    value={productURL}
                    onChangeText={setProductURL}
                />
                <Button title="Soumettre" onPress={handleSubmit} />
            </View>

            {/* Section des suggestions de personnes à suivre */}
            <View style={styles.suggestionsSection}>
                <Text style={styles.title}>Suggestions de personnes à suivre</Text>
                {isLoading ? (
                    <Text style={styles.loadingText}>Chargement des suggestions...</Text>
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : followSuggestions.length > 0 ? (
                    <FlatList
                        data={followSuggestions}
                        renderItem={({ item }) => (
                            <View style={styles.suggestionItem}>
                                <Text style={styles.suggestionText}>{item.username}</Text>
                                <TouchableOpacity
                                    style={styles.followButton}
                                    onPress={() => handleFollowUser(item.id)}
                                >
                                    <Text style={styles.followButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <Text style={styles.noSuggestions}>Aucune suggestion pour le moment</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#25292e',
    },
    formSection: {
        marginBottom: 30,
    },
    suggestionsSection: {
        marginTop: 20,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
        height: 40,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
    loadingText: {
        color: '#fff',
    },
    errorText: {
        color: '#f00',
    },
    suggestionItem: {
        backgroundColor: '#333',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    suggestionText: {
        color: '#fff',
        fontSize: 16,
    },
    followButton: {
        backgroundColor: '#1a73e8',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    followButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    noSuggestions: {
        color: '#aaa',
        fontSize: 16,
    },
});
