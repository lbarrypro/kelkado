export interface Product {
    id: string;
    name: string;
    url: string;
    price: number;
    description: string;
    currency: string;
    created_at: string;
}

export interface ProductsContextType {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>; // Mise à jour de l'état local
    fetchAllProducts: () => Promise<void>;
    getProductById: (productId: string) => Promise<Product>;
    createProduct: (name: string, url: string, price: number, description: string, currency: string) => Promise<Product>;
    updateProduct: (productId: string, productData: Partial<Product>) => Promise<Product>;
    deleteProduct: (productId: string) => Promise<void>;
    getLatestProductsByFollowedUsers: (followedIds: string[]) => Promise<Product[]>;
}
