import React, { createContext, useContext, ReactNode, useState } from 'react';
import { ProductsService } from '@/src/services/ProductsService';
import { Product, ProductsContextType } from '@/src/interfaces/ProductInterface';
import logger from '@/src/utils/logger';

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
    const service = new ProductsService();
    const [products, setProducts] = useState<Product[]>([]);

    const fetchAllProducts = async () => {
        try {
            const data = await service.getAllProducts();
            logger.info('ProductsContext :: fetchAllProducts :: products:', data);
            // setProducts(data);
            return data;
        } catch (error) {
            logger.error('ProductsContext :: fetchAllProducts :: error:', error);
            throw error;
        }
    };

    const getProductById = async (productId: string) => {
        try {
            const product = await service.getProductById(productId);
            logger.info('ProductsContext :: getProductById :: product:', product);
            return product;
        } catch (error) {
            logger.error('ProductsContext :: getProductById :: error:', error);
            throw error;
        }
    };

    const createProduct = async (name: string, url: string, price: number, description: string, currency: string) => {
        try {
            const newProduct = await service.createProduct(name, url, price, description, currency);
            logger.info('ProductsContext :: createProduct :: newProduct:', newProduct);
            setProducts((prev) => [...prev, newProduct]);
            return newProduct;
        } catch (error) {
            logger.error('ProductsContext :: createProduct :: error:', error);
            throw error;
        }
    };

    const updateProduct = async (productId: string, productData: Partial<Product>) => {
        try {
            const updatedProduct = await service.updateProduct(productId, productData);
            logger.info('ProductsContext :: updateProduct :: updatedProduct:', updatedProduct);
            setProducts((prev) =>
                prev.map((product) => (product.id === productId ? updatedProduct : product))
            );
            return updatedProduct;
        } catch (error) {
            logger.error('ProductsContext :: updateProduct :: error:', error);
            throw error;
        }
    };

    const deleteProduct = async (productId: string) => {
        try {
            await service.deleteProduct(productId);
            logger.info('ProductsContext :: deleteProduct :: productId:', productId);
            setProducts((prev) => prev.filter((product) => product.id !== productId));
        } catch (error) {
            logger.error('ProductsContext :: deleteProduct :: error:', error);
            throw error;
        }
    };

    const getLatestProductsByFollowedUsers = async (followedIds: string[]) => {
        return await service.getLatestProductsByFollowedUsers(followedIds);
    }

    return (
        <ProductsContext.Provider value={{
            products,
            setProducts,
            fetchAllProducts,
            getProductById,
            createProduct,
            updateProduct,
            deleteProduct,
            getLatestProductsByFollowedUsers
        }}>
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
};
