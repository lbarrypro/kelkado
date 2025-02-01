import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfilesService } from '@/src/services/UserProfilesService';
import { ProductsService } from '@/src/services/ProductsService';
import { useAuth } from '@/src/context/AuthContext';

const HomeFeedContext = createContext(null);

export function HomeFeedProvider({ children }) {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [followedIds, setFollowedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userProfilesService = new UserProfilesService();
    const productsService = new ProductsService();

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setError('User not logged in');
                setLoading(false);
                return;
            }

            try {
                const followedIds = await userProfilesService.getFollowedUsers(user.id);
                console.log('### followedIds: ', followedIds);
                setFollowedIds(followedIds);

                if (followedIds.length === 0) {
                    setError('You are not following anyone.');
                    setLoading(false);
                    return;
                }

                const products = await productsService.getLatestProductsByFollowedUsers(followedIds);
                console.log('### products: ', products);

                setProducts(products);
                if (products.length === 0) {
                    setError('No products found from followed users.');
                }
            } catch (err) {
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
