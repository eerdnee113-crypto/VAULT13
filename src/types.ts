/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Watch {
  id: string;
  name: string;
  subName: string;
  price: number; // in MNT
  category: 'Classic' | 'Sport' | 'Luxury';
  description: string;
  specs: {
    movement: string;
    case: string;
    glass: string;
    waterProof: string;
    strap: string;
  };
  image: string;
}

export type OrderStatus = 
  | 'pending'      // Төлбөр хүлээгдэж буй
  | 'confirmed'    // Баталгаажсан
  | 'preparing'    // Бэлтгэгдэж буй
  | 'on_the_way'   // Хүргэлтэд гарсан
  | 'delivered';   // Хүргэгдсэн

export type PaymentMethod = 'qpay' | 'socialpay' | 'card';

export interface Order {
  id: string; // e.g., ORD-9281
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: {
    watch: Watch;
    quantity: number;
  }[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  logs: {
    status: OrderStatus;
    updatedAt: string;
    note: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  choices?: { label: string; action: string }[];
}

export interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  fbTrafficPercent: number; // facebook traffic %
  igTrafficPercent: number; // instagram traffic %
  categorySales: {
    Classic: number;
    Sport: number;
    Luxury: number;
  };
}
