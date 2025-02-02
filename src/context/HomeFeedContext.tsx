import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserProfiles } from '@/src/context/UserProfilesContext';
import { useProducts } from '@/src/context/ProductsContext';
import { useAuth } from '@/src/context/AuthContext';
import logger from "@/src/utils/logger";

const HomeFeedContext = createContext(null);

export function HomeFeedProvider({ children }) {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [followedIds, setFollowedIds] = useState([]);
    const [followSuggestions, setFollowSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getFollowedUsers, getOtherUsers } = useUserProfiles();
    const { getLatestProductsByFollowedUsers } = useProducts();

    useEffect(() => {
        const fetchData = async () => {
            // Réinitialise l'erreur à chaque exécution de useEffect
            setError(null);

            logger.debug('HomeFeedProvider :: Vérification des états de l\'utilisateur:', { user, loading });

            if (!user) {
                logger.debug('HomeFeedProvider :: useEffect - User is falsy:', user);
                setError('User not logged in');
                setLoading(false);
                return;
            }

            try {
                const followedIds = await getFollowedUsers(user.id);
                setFollowedIds(followedIds);

                if (followedIds.length === 0) {
                    // setError('You are not following anyone.');
                    fetchSuggestions();
                    setLoading(false);
                    return;
                }

                const products = await getLatestProductsByFollowedUsers(followedIds);
                setProducts(products);
                if (products.length === 0) {
                    // setError('No products found from followed users.');
                    fetchSuggestions();
                }
            } catch (err) {
                logger.error('HomeFeedProvider :: useEffect :: error: ', err);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        // Fonction pour récupérer les suggestions d'utilisateurs à suivre
        const fetchSuggestions = async () => {
            if (!user) return;

            try {
                const suggestions = await getOtherUsers(user.id); // Assure-toi que cette fonction est définie dans `useUserProfiles`
                setFollowSuggestions(suggestions);
            } catch (err) {
                logger.error('Error fetching follow suggestions:', err);
            }
        };

        fetchData();
    }, [user]);

    return (
        <HomeFeedContext.Provider value={{ products, followedIds, loading, error }}>
            {children}
        </HomeFeedContext.Provider>
    );
}

export function useHomeFeed() {
    return useContext(HomeFeedContext);
}
