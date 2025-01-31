import SupabaseSingleton from '@/src/utils/supabaseClient';
import logger from '@/src/utils/logger';

export class ProductsService {
    private supabase = SupabaseSingleton.getInstance(); // Utilisation du Singleton

    /**
     * Récupère un produit par son ID.
     */
    async getProductById(productId: string) {
        logger.debug('ProductsService :: getProductById :: productId: ', productId);

        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error) {
            logger.error('Error fetching product by ID:', error);
            throw error;
        }

        logger.debug('ProductsService :: getProductById :: data: ', data);
        return data;
    }

    /**
     * Récupère tous les produits disponibles.
     */
    async getAllProducts() {
        logger.debug('ProductsService :: getAllProducts');

        const { data, error } = await this.supabase
            .from('products')
            .select('*');

        if (error) {
            logger.error('Error fetching all products:', error);
            throw error;
        }

        logger.debug('ProductsService :: getAllProducts :: data: ', data);

        const dataArray: any[] = [];
        Object.keys(data)?.map(async (i) => {
            dataArray.push(data[i]);
        });

        return dataArray;
    }

    /**
     * Ajoute un produit à la base de données.
     */
    async createProduct(title: string, image: string, price: number, description: string, link: string) {
        logger.debug('ProductsService :: createProduct :: title: ', title);
        logger.debug('ProductsService :: createProduct :: image: ', image);
        logger.debug('ProductsService :: createProduct :: price: ', price);
        logger.debug('ProductsService :: createProduct :: description: ', description);
        logger.debug('ProductsService :: createProduct :: link: ', link);

        const { data, error } = await this.supabase
            .from('products')
            .insert({ title, image, price, description, link })
            .single();

        if (error) {
            logger.error('Error creating product:', error);
            throw error;
        }

        logger.debug('ProductsService :: createProduct :: data: ', data);
        return data;
    }

    /**
     * Met à jour un produit existant.
     */
    async updateProduct(productId: string, productData: Record<string, any>) {
        logger.debug('ProductsService :: updateProduct :: productId: ', productId);
        logger.debug('ProductsService :: updateProduct :: productData: ', productData);

        const { data, error } = await this.supabase
            .from('products')
            .update(productData)
            .eq('id', productId)
            .single();

        if (error) {
            logger.error('Error updating product:', error);
            throw error;
        }

        logger.debug('ProductsService :: updateProduct :: data: ', data);
        return data;
    }

    /**
     * Supprime un produit de la base de données.
     */
    async deleteProduct(productId: string) {
        logger.debug('ProductsService :: deleteProduct :: productId: ', productId);

        const { data, error } = await this.supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) {
            logger.error('Error deleting product:', error);
            throw error;
        }

        logger.debug('ProductsService :: deleteProduct :: data: ', data);
        return data;
    }
}
