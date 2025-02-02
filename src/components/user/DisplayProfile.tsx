import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useUserProfiles } from '@/src/context/UserProfilesContext';
import { useLists } from '@/src/context/ListsContext';
import { useAuth } from '@/src/context/AuthContext';
import logger from '@/src/utils/logger';
import { router } from "expo-router";

interface DisplayProfileProps {
    userId: string; // L'ID de l'utilisateur dont on veut afficher le profil
}

const DisplayProfile: React.FC<DisplayProfileProps> = ({ userId }) => {
    const { user, signOut } = useAuth(); // Récupère l'utilisateur authentifié
    const [profile, setProfile] = useState<any>(null);
    const [userLists, setUserLists] = useState<any[]>([]); // Contiendra les listes de l'utilisateur
    const [loading, setLoading] = useState<boolean>(true);
    const { getProfile, getFollowerCount, getFollowingCount } = useUserProfiles();
    const { getUserLists } = useLists();

    const isCurrentUser = user?.id === userId; // Vérifie si c'est le profil de l'utilisateur connecté

    // Fonction de déconnexion (signout)
    const handleSignOut = async () => {
        try {
            if (!isCurrentUser) throw new Error('Can\'t log out other users');
            await signOut();
        } catch (err) {
            logger.error('Error during sign out: ', err);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) {
                logger.error('DisplayProfile :: fetchProfile :: no user');
                return;
            }

            try {
                let data = await getProfile(userId);

                // get follow data
                const followerCount = await getFollowerCount(userId);
                const followingCount = await getFollowingCount(userId);

                // Fusionner les données
                data = {
                    ...data,
                    followerCount: followerCount || 0,
                    followingCount: followingCount || 0,
                };

                if (!data.username && isCurrentUser) data.username = user.email;

                logger.debug('DisplayProfile :: fetchProfile :: data: ', data);
                setProfile(data);

                // list data
                const listsData = await getUserLists(userId);
                logger.debug('DisplayProfile :: fetchProfile :: listsData: ', listsData);
                setUserLists(listsData);
            } catch (error) {
                logger.error('DisplayProfile :: fetchProfile :: error: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    if (loading) {
        return <Text style={styles.loadingText}>Chargement...</Text>;
    }

    if (!profile) {
        return <Text style={styles.errorText}>Profil non trouvé</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={{ uri: profile?.profile_picture }} style={styles.profileImage} />
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{profile?.username}</Text>
                    <View style={styles.stats}>
                        <Text style={styles.statItem}>
                            <Text style={styles.statNumber}>{profile?.followerCount}</Text> Followers
                        </Text>
                        <Text style={styles.statItem}>
                            <Text style={styles.statNumber}>{profile?.followingCount}</Text> Following
                        </Text>
                    </View>
                </View>
            </View>

            {/* Menu - Options différentes selon si c'est l'utilisateur courant ou non */}
            <View style={styles.menu}>
                {isCurrentUser ? (
                    <>
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => router.push('/profile/edit')}
                        >
                            <Text style={styles.menuButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => router.push('/profile/list/create')}
                        >
                            <Text style={styles.primaryButtonText}>+ Create New List</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton} onPress={handleSignOut}>
                            <Text style={styles.secondaryButtonText}>Sign Out</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.followButton}>
                        <Text style={styles.followButtonText}>Follow</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Listes */}
            <View style={styles.listsContainer}>
                <FlatList
                    data={userLists} // À remplacer par la vraie source de données
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => router.push(isCurrentUser ? `/profile/list/${item.id}` : `/user/list/${item.id}`)}
                        >
                            <Text style={styles.listItemText}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Aucune liste trouvée.</Text>}
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
    followButton: {
        backgroundColor: '#007AFF', // Bleu pour le bouton "Suivre"
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    followButtonText: {
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

export default DisplayProfile;
