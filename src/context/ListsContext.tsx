import React, {createContext, ReactNode, useContext, useState} from 'react';
import { ListsService } from '@/src/services/ListsService'; // Assurez-vous que l'import est correct
import { List, ListsContextType } from '@/src/interfaces/ListInterface';
import logger from '@/src/utils/logger';

const ListsContext = createContext<ListsContextType | undefined>(undefined);

export const ListsProvider = ({ children }: { children: ReactNode }) => {
    const [lists, setLists] = useState<List[]>([]);
    const service = new ListsService();

    // Créer une liste
    const createList = async (userId: string, title: string, description: string, visibility: 'private' | 'public') => {
        const newList = await service.createList(userId, title, description, visibility);
        setLists((prevLists) => [...prevLists, newList]);
        return newList;
    };

    // Récupérer toutes les listes d'un utilisateur
    const getUserLists = async (userId: string) => {
        const userLists = await service.getUserLists(userId);
        setLists(userLists);
        return userLists;
    };

    const getListById = async (listId: string) => {
        return await service.getListById(listId);
    };

    // Récupérer toutes les listes publiques
    const getPublicLists = async () => {
        return await service.getPublicLists();
    };

    // Mettre à jour une liste
    const updateList = async (listId: string, title: string, description: string, visibility: 'private' | 'public') => {
        const updatedList = await service.updateList(listId, title, description, visibility);
        setLists((prevLists) => prevLists.map((list) => (list.id === listId ? updatedList : list)));
        return updatedList;
    };

    // Supprimer une liste
    const deleteList = async (listId: string) => {
        await service.deleteList(listId);
        setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
    };

    // Ajouter un produit à une liste
    const addProductToList = async (listId: string, productId: string) => {
        const addedProduct = await service.addProductToList(listId, productId);
        setLists((prevLists) =>
            prevLists.map((list) =>
                list.id === listId
                    ? { ...list, products: [...list.products, addedProduct] } // Assurez-vous que `products` est un tableau
                    : list
            )
        );
        return addedProduct;
    };

    // Retirer un produit d'une liste
    const removeProductFromList = async (listId: string, productId: string) => {
        await service.removeProductFromList(listId, productId);
        setLists((prevLists) =>
            prevLists.map((list) =>
                list.id === listId
                    ? { ...list, products: list.products.filter((product) => product.id !== productId) } // Mise à jour de la liste de produits
                    : list
            )
        );
    };

    const getProductsByList = async (listId: string) => {
        try {
            const data = await service.getProductsByList(listId); // Appel API

            const products = Object.values(data).map((item: any) => item.products);
            logger.info('ListsContext :: getProductsByList :: products:', products);

            return products; // Retourne le tableau d'objets produits
        } catch (error) {
            logger.error('ListsContext :: getProductsByList :: error :', error);
            throw error;
        }
    };

    return (
        <ListsContext.Provider
            value={{
                lists,
                createList,
                getUserLists,
                getListById,
                getPublicLists,
                updateList,
                deleteList,
                addProductToList,
                removeProductFromList,
                getProductsByList,
            }}
        >
            {children}
        </ListsContext.Provider>
    );
};

// Hook pour accéder au contexte
export const useLists = (): ListsContextType => {
    const context = useContext(ListsContext);
    if (!context) {
        throw new Error('useLists must be used within a ListsProvider');
    }
    return context;
};
