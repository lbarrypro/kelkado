import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useUserProfiles } from '@/src/context/UserProfilesContext'; // Assurez-vous que ce hook est correctement implémenté
import logger from '@/src/utils/logger';

export default function ProfileScreen() {
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null); // Contiendra les données de l'utilisateur
    const [userLists, setUserLists] = useState<any[]>([]); // Contiendra les listes de l'utilisateur
    const router = useRouter();

    const { user: authUser, signOut } = useAuth(); // Récupère l'utilisateur authentifié
    const { getProfile } = useUserProfiles(); // Assure-toi que `getProfile` est disponible dans ton contexte

    // Fonction de déconnexion (signout)
    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (err) {
            logger.error('Error during sign out: ', err);
        }
    };

    // Récupérer les données de l'utilisateur et de son profil
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!authUser) {
                    throw new Error('User not authenticated');
                }

                /*
                // Récupérer les données du profil utilisateur
                const profileData = await getProfile(authUser.id);
                if (profileData) {
                    setUserData(profileData); // Stocke les données du profil
                }
                */

                // Exemple de récupération des listes utilisateur (à ajuster selon ta structure de base de données)
                // Tu pourrais ajouter une méthode pour récupérer les listes si nécessaire
                // const listsData = await getUserLists(authUser.id);
                // setUserLists(listsData);

            } catch (err) {
                setError('Erreur lors de la récupération des données utilisateur');
                logger.error('Error fetching user data: ', err);
            }
        };

        fetchUserData();
    }, [authUser, getProfile]);

    // Si les données sont en cours de récupération ou s'il y a une erreur
    /*
    if (!userData || error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error || 'Loading user data...'}</Text>
            </View>
        );
    }
    */

    return (
        <View style={styles.container}>
            {/* Header */}

            {/*
            <View style={styles.header}>
                <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{userData.username}</Text>
                    <View style={styles.stats}>
                        <Text style={styles.statItem}>
                            <Text style={styles.statNumber}>{userData.followers}</Text> Followers
                        </Text>
                        <Text style={styles.statItem}>
                            <Text style={styles.statNumber}>{userData.following}</Text> Following
                        </Text>
                    </View>
                </View>
            </View>
            */}

            {/* Menu */}
            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>+ Create New List</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleSignOut}>
                    <Text style={styles.secondaryButtonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            {/* Listes */}
            <View style={styles.listsContainer}>
                <FlatList
                    data={userLists} // Utilise ici les listes récupérées si nécessaire
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => router.push(`/list/${item.id}`)} // Navigue vers la page de la liste
                        >
                            <Text style={styles.listItemText}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No lists found.</Text>}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
    },
    header: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#1e2126',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 16,
    },
    userInfo: {
        justifyContent: 'center',
    },
    username: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    stats: {
        flexDirection: 'row',
        marginTop: 8,
    },
    statItem: {
        color: '#fff',
        marginRight: 16,
        fontSize: 14,
    },
    statNumber: {
        fontWeight: 'bold',
    },
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#1e2126',
    },
    menuButton: {
        borderWidth: 1,
        borderColor: '#ffd33d',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    menuButtonText: {
        color: '#ffd33d',
        fontSize: 14,
    },
    primaryButton: {
        backgroundColor: '#ffd33d',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    primaryButtonText: {
        color: '#25292e',
        fontSize: 14,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: '#ff4d4d',  // Un rouge pour le bouton 'Sign Out'
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    listsContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    listItem: {
        backgroundColor: '#1e2126',
        padding: 16,
        marginBottom: 12,
        borderRadius: 5,
    },
    listItemText: {
        color: '#fff',
        fontSize: 16,
    },
    emptyText: {
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
