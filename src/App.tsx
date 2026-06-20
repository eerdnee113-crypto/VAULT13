/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Watch, Order, OrderStatus } from './types';
import { WATCHES, INITIAL_ORDERS } from './data';
import Navbar from './components/Navbar';
import WatchCard from './components/WatchCard';
import CartModal from './components/CartModal';
import LiveTracker from './components/LiveTracker';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import { Eye, ShieldAlert, ArrowRight, Star, Clock, Heart, Award } from 'lucide-react';

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<{ watch: Watch; quantity: number }[]>([]);
  const [currentView, setView] = useState<'shop' | 'tracker' | 'admin'>('shop');
  const [activeOrderTrackerId, setActiveOrderTrackerId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'Classic' | 'Sport' | 'Luxury'>('all');

  const [watches, setWatches] = useState<Watch[]>(() => {
    const cached = localStorage.getItem('chronos_watches_db');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return WATCHES;
      }
    }
    return WATCHES;
  });

  const saveWatchesToStorage = (updatedWatches: Watch[]) => {
    setWatches(updatedWatches);
    localStorage.setItem('chronos_watches_db', JSON.stringify(updatedWatches));
  };

  const handleAddWatch = (newWatch: Watch) => {
    const updated = [...watches, newWatch];
    saveWatchesToStorage(updated);
  };

  const handleUpdateWatch = (updatedWatch: Watch) => {
    const updated = watches.map(w => w.id === updatedWatch.id ? updatedWatch : w);
    saveWatchesToStorage(updated);
  };

  const handleDeleteWatch = (watchId: string) => {
    const updated = watches.filter(w => w.id !== watchId);
    saveWatchesToStorage(updated);
    setCart(prev => prev.filter(item => item.watch.id !== watchId));
  };

  const handleDeleteAllWatches = () => {
    saveWatchesToStorage([]);
    setCart([]);
  };

  // Load orders from LocalStorage or seed with default mock dataset
  useEffect(() => {
    const cached = localStorage.getItem('chronos_orders_db');
    if (cached) {
      try {
        setOrders(JSON.parse(cached));
      } catch {
        // Fallback
        setOrders(INITIAL_ORDERS);
        localStorage.setItem('chronos_orders_db', JSON.stringify(INITIAL_ORDERS));
      }
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('chronos_orders_db', JSON.stringify(INITIAL_ORDERS));
    }

    // Attach global tracking updater for CartModal success redirect
    (window as any).__setActiveTrackerOrder = (id: string) => {
      setActiveOrderTrackerId(id);
      setView('tracker');
    };
  }, []);

  // Save utility
  const saveOrdersToStorage = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('chronos_orders_db', JSON.stringify(updatedOrders));
  };

  // Cart operations
  const handleAddToCart = (watch: Watch) => {
    setCart(prev => {
      const existing = prev.find(item => item.watch.id === watch.id);
      if (existing) {
        return prev.map(item => 
          item.watch.id === watch.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { watch, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (watchId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(watchId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.watch.id === watchId 
        ? { ...item, quantity } 
        : item
    ));
  };

  const handleRemoveCartItem = (watchId: string) => {
    setCart(prev => prev.filter(item => item.watch.id !== watchId));
  };

  // Checkout Placement
  const handlePlaceOrder = (newOrder: Order) => {
    const updated = [newOrder, ...orders];
    saveOrdersToStorage(updated);
    // Clear cart
    setCart([]);
    // Setup active tracker
    setActiveOrderTrackerId(newOrder.id);
  };

  // Admin: Update stages of an order
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, logComment: string) => {
    const now = new Date().toISOString();
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          logs: [
            ...o.logs,
            { status: newStatus, updatedAt: now, note: logComment }
          ]
        };
      }
      return o;
    });
    saveOrdersToStorage(updated);
  };

  // Admin: Memory Reset triggers
  const handleResetMemory = () => {
    localStorage.removeItem('chronos_orders_db');
    localStorage.removeItem('chronos_watches_db');
    setOrders(INITIAL_ORDERS);
    setWatches(WATCHES);
    localStorage.setItem('chronos_orders_db', JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem('chronos_watches_db', JSON.stringify(WATCHES));
    setCart([]);
    setView('shop');
    setActiveOrderTrackerId(null);
    setIsCartOpen(false);
    setActiveCategoryFilter('all');
    // Force reload state cleanly
    window.location.reload();
  };

  // Admin: Delete order row
  const handleDeleteOrder = (orderId: string) => {
    const updated = orders.filter(o => o.id !== orderId);
    saveOrdersToStorage(updated);
  };

  // Live query helper for chatbot resolution
  const handleTrackQueryFromBot = (orderId: string) => {
    setActiveOrderTrackerId(orderId);
    setView('tracker');
  };

  // Filtering products
  const filteredWatches = activeCategoryFilter === 'all' 
    ? watches 
    : watches.filter(w => w.category === activeCategoryFilter);

  return (
    <div id="swiss-luxury-app" className="min-h-screen bg-[#FFFFFF] flex flex-col justify-between text-slate-900 selection:bg-blue-900/20 antialiased selection:text-slate-950">
      
      {/* 1. Header Navigation */}
      <Navbar 
        id="vault13-master-navbar"
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        currentView={currentView}
        setView={setView}
        activeOrderTrackerId={activeOrderTrackerId}
      />

      {/* 2. Main Page Layout Wrapper */}
      <main id="app-main-content" className="flex-grow">
        
        {/* VIEW A: SHOPPING FRONTSTORE */}
        {currentView === 'shop' && (
          <div id="shop-view-wrapper" className="space-y-12 pb-16">
            
            {/* Elegant Swiss Hero Banner */}
            <section id="shop-hero-banner" className="relative border-b border-slate-200 bg-linear-to-b from-slate-50 to-white py-16 sm:py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
                
                {/* Micro Accents */}
                <div className="inline-flex items-center space-x-2 rounded-none border border-blue-200 bg-blue-50/70 px-3.5 py-1.5 font-mono text-[9px] font-bold tracking-widest text-blue-900 uppercase">
                  <Star size={10} className="fill-blue-900" />
                  <span>Швейцарь Урлаг ба Нарийн Технологи</span>
                </div>
                
                {/* Main Heading in Space Grotesk */}
                <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-none max-w-4xl mx-auto uppercase">
                  Цаг Хугацааны Төгс <span className="text-blue-900">Урам Сууц</span>
                </h1>
                
                <p className="font-sans text-xs sm:text-sm text-slate-500 font-semibold max-w-2xl mx-auto leading-relaxed">
                  Хэт чамин тод байдлаас ангижирч, Швейцарийн сонгодог Скелетон болон Кристал шилийг минималист хэв шинжээр хослуулсан эрхэмсэг цагнуудын цуглуулга.
                </p>

                {/* Categories Tab Pill Selectors */}
                <div id="shop-category-filters" className="flex flex-wrap items-center justify-center gap-2 pt-6">
                  {(['all', 'Classic', 'Sport', 'Luxury'] as const).map((cat) => (
                    <button
                      key={cat}
                      id={`filter-pill-${cat}`}
                      onClick={() => setActiveCategoryFilter(cat)}
                      className={`px-5 py-2.5 font-display text-xs font-black tracking-widest uppercase border-2 transition-all duration-300 rounded-none ${
                        activeCategoryFilter === cat
                          ? 'border-slate-905 bg-slate-905 text-white shadow-[2px_2px_0px_0px_rgba(30,58,138,1)]'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-905 hover:text-slate-905'
                      }`}
                    >
                      {cat === 'all' ? 'БҮХ ЦАГНУУД' : cat}
                    </button>
                  ))}
                </div>

              </div>
            </section>

            {/* Curated Grid Display of Products */}
            <section id="shop-products-grid" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
                <span className="font-display text-xs font-black tracking-widest text-slate-900 uppercase">ШВЕЙЦАР ЦУГЛУУЛГА ({filteredWatches.length})</span>
                <span className="font-mono text-xs text-blue-900 font-bold bg-blue-50 px-2 py-0.5 border border-blue-200">100% ORIGINAL SYSTEM</span>
              </div>

              <div id="watches-grid-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWatches.map((w) => (
                  <WatchCard 
                    key={w.id} 
                    watch={w} 
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </section>

            {/* Trust and Values Row */}
            <section id="shop-trust-badges" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-200 pt-12 font-display">
                <div className="flex items-start space-x-3.5">
                  <div className="p-3 border-2 border-slate-900 rounded-none bg-blue-50 text-blue-900 shrink-0">
                    <Award size={18} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-black tracking-wider text-slate-900 uppercase">Үйлдвэрийн Албан Ёсны Баталгаа</h5>
                    <p className="font-sans text-[11px] text-slate-500">Манай санд байгаа цаг бүр 1-2 жилийн бүтэн механик баталгаат хуудастай ирнэ.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-3 border-2 border-slate-900 rounded-none bg-blue-50 text-blue-900 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-black tracking-wider text-slate-900 uppercase">24 Цагийн Үнэгүй Хүргэлт</h5>
                    <p className="font-sans text-[11px] text-slate-500">Нийслэл хот дотор хүссэн хаягийн дагуу аюулгүй, даатгалтай хүргэлтээр шуурхай хүргэнэ.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="p-3 border-2 border-slate-900 rounded-none bg-blue-50 text-blue-900 shrink-0">
                    <Heart size={18} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-black tracking-wider text-slate-900 uppercase">Олон Улсын ISO Чанарын Стандарт</h5>
                    <p className="font-sans text-[11px] text-slate-500">Зуурагдалтгүй Индранил кристал шил, зэврэлтгүй 316L ган их биеийн дээд чанар.</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* VIEW B: TRACKER ENQUIRY PAGE */}
        {currentView === 'tracker' && (
          <div id="tracker-view-wrapper">
            <LiveTracker 
              orders={orders}
              activeOrderId={activeOrderTrackerId}
              onSearchOrder={setActiveOrderTrackerId}
            />
          </div>
        )}

        {/* VIEW C: ADMIN PORTAL METRICS */}
        {currentView === 'admin' && (
          <div id="admin-view-wrapper">
            <Dashboard 
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onResetMemory={handleResetMemory}
              onDeleteOrder={handleDeleteOrder}
              watches={watches}
              onAddWatch={handleAddWatch}
              onUpdateWatch={handleUpdateWatch}
              onDeleteWatch={handleDeleteWatch}
              onDeleteAllWatches={handleDeleteAllWatches}
            />
          </div>
        )}

      </main>

      {/* 3. Shopping Cart Dialog Overlay */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* 4. Swiss Watch Concierge AI Chatbot */}
      <Chatbot 
        watches={watches}
        orders={orders}
        onTrackOrder={handleTrackQueryFromBot}
        setView={setView}
      />

      {/* 5. Minimalist Page Footer */}
      <footer id="app-footer-bar" className="border-t border-slate-100 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 text-center sm:text-left gap-4">
          <div className="font-display text-xs text-slate-400">
            © 2026 <strong className="font-mono tracking-widest text-slate-900">VAULT13</strong> SWISS MINIMAL. Бүх эрх хуулиар хамгаалагдсан.
          </div>
          
          <div className="flex space-x-6 font-display text-[11px]">
            <a 
              id="footer-fb-link"
              href="https://www.facebook.com/profile.php?id=61587082883795" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-blue-900 font-bold transition flex items-center space-x-1"
            >
              <span>Facebook Чатталгаа</span>
            </a>
            <span className="text-slate-205">|</span>
            <button 
              onClick={() => setView('admin')}
              className="text-slate-500 hover:text-slate-900 font-bold tracking-widest"
            >
              АДМИН НЭВТРЭХ
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
