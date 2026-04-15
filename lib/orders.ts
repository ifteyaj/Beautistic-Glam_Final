import { supabase } from '../lib/supabase';

export interface OrderInput {
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes?: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
}

export interface OrderRecord {
  id: string;
  user_id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  zip_code: string;
  notes?: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
}

export const orderService = {
  /**
   * Create a new COD order
   */
  async createOrder(order: OrderInput): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: order.userId,
          customer_name: order.customerName,
          phone: order.phone,
          address: order.address,
          city: order.city,
          zip_code: order.zipCode,
          notes: order.notes || '',
          total_amount: order.totalAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderId = orderData.id;

      const orderItems = order.items.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        product_name: item.productName,
        product_image: item.productImage,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return { success: true, orderId };
    } catch (error: any) {
      console.error('Create order error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all orders (for admin)
   */
  async getAllOrders(): Promise<{ success: boolean; orders?: OrderRecord[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, orders: data as OrderRecord[] };
    } catch (error: any) {
      console.error('Get all orders error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get orders by user ID
   */
  async getUserOrders(userId: string): Promise<{ success: boolean; orders?: OrderRecord[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, orders: data as OrderRecord[] };
    } catch (error: any) {
      console.error('Get user orders error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get single order with items
   */
  async getOrderWithItems(orderId: string): Promise<{ success: boolean; order?: OrderRecord; items?: OrderItemRecord[]; error?: string }> {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      return { success: true, order: order as OrderRecord, items: items as OrderItemRecord[] };
    } catch (error: any) {
      console.error('Get order error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update order status (admin)
   */
  async updateOrderStatus(orderId: string, status: OrderRecord['status']): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Update order status error:', error);
      return { success: false, error: error.message };
    }
  },
};
