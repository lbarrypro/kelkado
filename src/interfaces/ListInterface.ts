import React from "react";

export interface Product {
    id: string;
    name: string;
    url: string;
    price: number;
    description: string;
    currency: string;
    created_at: string;
}

export interface List {
    id: string;
    user_id: string;
    title: string;
    description: string;
    visibility: 'private' | 'public';
    created_at: string;
}

export interface ListsContextType {
    lists: List[];
    setLists: React.Dispatch<React.SetStateAction<List[]>>; // Mise à jour de l'état local
    fetchUserLists: (userId: string) => Promise<void>;
    getListById: (listId: string) => Promise<List>;
    fetchPublicLists: () => Promise<void>;
    createList: (userId: string, title: string, description: string, visibility: 'private' | 'public') => Promise<List>;
    updateList: (listId: string, title: string, description: string, visibility: 'private' | 'public') => Promise<List>;
    deleteList: (listId: string) => Promise<void>;
    getProductsByList: (listId: string) => Promise<Product>;
}
