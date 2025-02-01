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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getFollowedUsers } = useUserProfiles();
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
                    setError('You are not following anyone.');
                    setLoading(false);
                    return;
                }

                const products = await getLatestProductsByFollowedUsers(followedIds);
                setProducts(products);
                if (products.length === 0) {
                    setError('No products found from followed users.');
                }
            } catch (err) {
                logger.error('HomeFeedProvider :: useEffect :: error: ', err);
                setError('Error fetching data');
            } finally {
                setLoading(false);
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
