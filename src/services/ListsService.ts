import SupabaseSingleton from '@/src/utils/supabaseClient';
import logger from '@/src/utils/logger';

export class ListsService {
    private supabase = SupabaseSingleton.getInstance(); // Utilisation du Singleton

    async createList(userId: string, title: string, description: string, visibility: 'private' | 'public') {
        logger.debug('ListsService :: createList :: userId: ', userId);
        logger.debug('ListsService :: createList :: title: ', title);
        logger.debug('ListsService :: createList :: description: ', description);
        logger.debug('ListsService :: createList :: visibility: ', visibility);

        const { data, error } = await this.supabase
            .from('lists')
            .insert({ user_id: userId, title, description, visibility })
            .single();
        if (error) throw error;

        logger.debug('ListsService :: createList :: data: ', data);
        return data;
    }

    async getUserLists(userId: string) {
        logger.debug('ListsService :: getUserLists :: userId: ', userId);

        const { data, error } = await this.supabase
            .from('lists')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching user lists:', error);
            throw error;
        }

        logger.debug('ListsService :: getUserLists :: data: ', data);
        return data;
    }

    async getListById(listId: string) {
        logger.debug('ListsService :: getListById :: listId: ', listId);

        const { data, error } = await this.supabase
            .from('lists')
            .select('*')
            .eq('id', listId)
            .single(); // Utilise .single() car on s'attend à une seule ligne en retour

        if (error) {
            logger.error('Error fetching list by id:', error);
            throw error;
        }

        logger.debug('ListsService :: getListById :: data: ', data);
        return data;
    }

    async getPublicLists() {
        logger.debug('ListsService :: getPublicLists');

        const { data, error } = await this.supabase
            .from('lists')
            .select('*')
            .eq('visibility', 'public');

        if (error) {
            console.error('Error fetching public lists:', error);
            throw error;
        }

        logger.debug('ListsService :: getPublicLists :: data: ', data);
        return data;
    }

    async updateList(listId: string, listData: Record<string, any>) {
        logger.debug('ListsService :: updateList :: listId: ', listId);
        logger.debug('ListsService :: updateList :: listData: ', listData);

        const { data, error } = await this.supabase
            .from('lists')
            .update(listData)
            .eq('id', listId)
            .single();
        if (error) throw error;

        logger.debug('ListsService :: updateList :: data: ', data);
        return data;
    }

    async deleteList(listId: string) {
        logger.debug('ListsService :: deleteList :: listId: ', listId);

        const { data, error } = await this.supabase
            .from('lists')
            .delete()
            .eq('id', listId);
        if (error) throw error;

        logger.debug('ListsService :: deleteList :: data: ', data);
        return data;
    }

    /**
     * Adds a product to a list by creating a relation in the list_products table.
     */
    async addProductToList(listId: string, productId: string) {
        logger.debug('ListsService :: addProductToList :: listId: ', listId);
        logger.debug('ListsService :: addProductToList :: productId: ', productId);

        const { data, error } = await this.supabase
            .from('list_products')
            .insert({ list_id: listId, product_id: productId })
            .single();
        if (error) {
            console.error('Error adding product to list:', error);
            throw error;
        }

        logger.debug('ListsService :: addProductToList :: data: ', data);
        return data;
    }

    /**
     * Removes a product from a list by deleting the relation in the list_products table.
     */
    async removeProductFromList(listId: string, productId: string) {
        logger.debug('ListsService :: removeProductFromList :: listId: ', listId);
        logger.debug('ListsService :: removeProductFromList :: productId: ', productId);

        const { data, error } = await this.supabase
            .from('list_products')
            .delete()
            .eq('list_id', listId)
            .eq('product_id', productId);
        if (error) {
            console.error('Error removing product from list:', error);
            throw error;
        }

        logger.debug('ListsService :: removeProductFromList :: data: ', data);
        return data;
    }

    /**
     * Fetches all products associated with a specific list.
     */
    async getProductsByList(listId: string) {
        logger.debug('ListsService :: getProductsByList :: listId: ', listId);

        const { data, error } = await this.supabase
            .from('list_products')
            .select('product_id, products(*)') // Load product details using foreign key
            .eq('list_id', listId);

        if (error) {
            console.error('Error fetching products for list:', error);
            throw error;
        }

        logger.debug('ListsService :: getProductsByList :: data: ', data);
        return data;
    }
}
