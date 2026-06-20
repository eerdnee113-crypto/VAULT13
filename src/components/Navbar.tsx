/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Settings, ShieldAlert, ShoppingBag, Eye, HelpCircle, ExternalLink } from 'lucide-react';

interface NavbarProps {
  id?: string;
  cartCount: number;
  onOpenCart: () => void;
  currentView: 'shop' | 'tracker' | 'admin';
  setView: (view: 'shop' | 'tracker' | 'admin') => void;
  activeOrderTrackerId: string | null;
}

export default function Navbar({
  id = 'app-navbar',
  cartCount,
  onOpenCart,
  currentView,
  setView,
  activeOrderTrackerId
}: NavbarProps) {
  return (
    <header 
      id={id} 
      className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md"
    >
      <div id="nav-container" className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Swiss Minimalist Style */}
        <div 
          id="nav-logo-group" 
          className="flex cursor-pointer items-center space-x-2"
          onClick={() => setView('shop')}
        >
          <span id="nav-logo-icon" className="font-display text-lg font-black tracking-tighter text-slate-950 uppercase">
            VAULT13 <span className="text-blue-900">AI</span>
          </span>
          <span id="nav-logo-divider" className="text-slate-350">|</span>
          <span id="nav-logo-sub" className="font-display text-[10px] font-bold tracking-widest text-[#0f172a] uppercase bg-slate-100 px-1.5 py-0.5 rounded-none border border-slate-205">
            SWISS DESIGN
          </span>
        </div>

        {/* Navigation Actions */}
        <nav id="nav-menu" className="flex items-center space-x-1 sm:space-x-4">
          <button
            id="nav-btn-shop"
            onClick={() => setView('shop')}
            className={`px-3 py-1.5 font-display text-xs font-semibold tracking-wider transition ${
              currentView === 'shop'
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            ЦАГНУУД
          </button>
          
          <button
            id="nav-btn-tracker"
            onClick={() => setView('tracker')}
            className={`relative px-3 py-1.5 font-display text-xs font-semibold tracking-wider transition ${
              currentView === 'tracker'
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            ХЯНАХ ХУУДАС
            {activeOrderTrackerId && (
              <span id="nav-tracker-indicator" className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-blue-500" />
            )}
          </button>

          {/* Facebook direct link constraint */}
          <a
            id="nav-facebook-link"
            href="https://www.facebook.com/profile.php?id=61587082883795"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center space-x-1 px-3 py-1.5 font-display text-xs font-semibold tracking-wider text-slate-500 hover:text-blue-900 transition md:flex"
          >
            <span>ХОЛБОО БАРИХ</span>
            <ExternalLink id="nav-facebook-extern-icon" size={12} />
          </a>
        </nav>

        {/* Right Buttons: Cart & Admin with raw-yellow dot */}
        <div id="nav-actions-group" className="flex items-center space-x-2 sm:space-x-4">
          {/* Shopping Cart button */}
          <button
            id="nav-btn-cart"
            onClick={onOpenCart}
            className="group relative rounded-full p-2 text-slate-700 hover:bg-slate-50 transition"
            aria-label="Sagsлах"
          >
            <ShoppingBag id="nav-cart-icon" size={20} className="stroke-[1.5]" />
            {cartCount > 0 && (
              <span 
                id="nav-cart-badge" 
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Settings Admin button with raw yellow blinking dot */}
          <button
            id="nav-btn-admin"
            onClick={() => setView(currentView === 'admin' ? 'shop' : 'admin')}
            className={`group relative flex items-center space-x-1.5 rounded-full border px-3 py-1.5 transition ${
              currentView === 'admin'
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-800'
            }`}
          >
            <Settings id="nav-admin-icon" size={16} className={`${currentView === 'admin' ? 'animate-spin-slow' : 'stroke-[1.5]'}`} />
            <span id="nav-admin-label" className="hidden font-display text-xs font-semibold tracking-wider sm:inline">
              УДИРДЛАГА
            </span>
            
            {/* Blinking Dot: Raw Yellow / Amber-400 with shadow glowing pulse effect */}
            <span id="nav-admin-pulse-wrapper" className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span 
                id="nav-admin-pulse-glow" 
                className="pulsate-dot absolute inline-flex h-full w-full rounded-full bg-[#EAB308] opacity-75"
              />
              <span 
                id="nav-admin-pulse-core" 
                className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[#EAB308] border border-white"
              />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
