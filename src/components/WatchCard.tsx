/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Watch } from '../types';
import { ChevronRight, Plus, Check, Facebook } from 'lucide-react';
import { isFacebookUrl, getFacebookEmbedUrl } from '../utils/facebook';

interface WatchCardProps {
  watch: Watch;
  onAddToCart: (watch: Watch) => void;
  id?: string;
  key?: string;
}

export default function WatchCard({ watch, onAddToCart, id }: WatchCardProps) {
  const cardId = id || `watch-card-${watch.id}`;
  const [showSpecs, setShowSpecs] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(watch);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div 
      id={cardId} 
      className="group relative flex flex-col justify-between overflow-hidden bg-white border-2 border-slate-200 hover:border-slate-950 p-6 transition-all duration-300 rounded-none hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
    >
      {/* Category Tag */}
      <div className="flex items-center justify-between mb-4">
        <span 
          id={`${cardId}-category`}
          className="font-mono text-[9px] tracking-widest text-blue-900 bg-blue-50 px-2 py-0.5 rounded-none uppercase font-bold border border-blue-200"
        >
          {watch.category}
        </span>
        <span 
          id={`${cardId}-id`}
          className="font-mono text-[9px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5"
        >
          {watch.id}
        </span>
      </div>

      {/* Image Wrap & Hover Switch - Swiss Minimalist Aspect Ratios */}
      <div 
        id={`${cardId}-image-container`} 
        className="relative mx-auto mb-6 flex h-60 w-full items-center justify-center overflow-hidden bg-slate-50 transition-colors duration-300 group-hover:bg-slate-100/50"
      >
        {isFacebookUrl(watch.image) ? (
          <div className="absolute inset-0 w-full h-full bg-white overflow-hidden">
            <iframe
              src={getFacebookEmbedUrl(watch.image)}
              width="100%"
              height="100%"
              className="w-full h-full border-0"
              scrolling="yes"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
        ) : (
          <img
            id={`${cardId}-image`}
            src={watch.image}
            alt={watch.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        )}
        
        {/* Quick specs hover panel */}
        <div 
          id={`${cardId}-specs-overlay`} 
          className={`absolute inset-0 bg-slate-900/90 p-5 text-white transition-opacity duration-300 flex flex-col justify-between ${
            showSpecs ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="space-y-3 font-display">
            <h4 className="text-xs font-bold tracking-widest text-blue-400 uppercase border-b border-white/20 pb-1.5">ТЕХНИК ҮЗҮҮЛЭЛТ</h4>
            <div className="grid grid-cols-3 gap-y-2 text-[11px] font-light">
              <span className="text-slate-400 font-medium col-span-1">Хөдөлгүүр:</span>
              <span className="text-slate-100 col-span-2 text-right font-sans font-normal">{watch.specs.movement}</span>
              
              <span className="text-slate-400 font-medium col-span-1">Их бие:</span>
              <span className="text-slate-100 col-span-2 text-right font-sans font-normal">{watch.specs.case}</span>
              
              <span className="text-slate-400 font-medium col-span-1">Шил:</span>
              <span className="text-slate-100 col-span-2 text-right font-sans font-normal">{watch.specs.glass}</span>
              
              <span className="text-slate-400 font-medium col-span-1">Усны хамг:</span>
              <span className="text-slate-100 col-span-2 text-right font-sans font-normal">{watch.specs.waterProof}</span>

              <span className="text-slate-400 font-medium col-span-1">Оосор:</span>
              <span className="text-slate-100 col-span-2 text-right font-sans font-normal">{watch.specs.strap}</span>
            </div>
          </div>

          <button 
            id={`${cardId}-specs-close`}
            onClick={(e) => {
              e.stopPropagation();
              setShowSpecs(false);
            }}
            className="w-full border border-white/30 hover:border-white py-1.5 text-center font-display text-[10px] tracking-widest uppercase transition-colors rounded-none"
          >
            ХААХ
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div id={`${cardId}-info`} className="space-y-1.5">
        <h3 id={`${cardId}-title`} className="font-display text-base font-black tracking-tight text-slate-900 group-hover:text-slate-950 uppercase">
          {watch.name}
        </h3>
        <p id={`${cardId}-subtitle`} className="font-sans text-[11px] font-semibold text-blue-900 uppercase tracking-wider">
          {watch.subName}
        </p>
        <p id={`${cardId}-desc`} className="line-clamp-2 font-sans text-[12px] text-slate-500 h-8 overflow-hidden leading-relaxed">
          {watch.description}
        </p>
      </div>

      {/* Price and Actions */}
      <div id={`${cardId}-actions`} className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        {/* Price formatted beautifully */}
        <div id={`${cardId}-price-box`} className="flex flex-col">
          <span className="text-[9px] font-mono tracking-widest text-[#94a3b8] uppercase font-bold">ҮНЭ</span>
          <span id={`${cardId}-price-value`} className="font-mono text-base font-bold text-slate-900">
            {watch.price.toLocaleString()}₮
          </span>
        </div>

        {/* Action button pack */}
        <div className="flex items-center space-x-1.5">
          <button
            id={`${cardId}-btn-specs`}
            onClick={() => setShowSpecs(!showSpecs)}
            className="rounded-none border-2 border-slate-200 py-1.5 px-3 font-display text-[9px] font-black tracking-widest text-slate-700 hover:border-slate-905 hover:text-slate-950 bg-slate-50 transition-colors uppercase"
          >
            Үзүүлэлт
          </button>

          <button
            id={`${cardId}-btn-add`}
            onClick={handleAdd}
            disabled={added}
            className={`flex items-center space-x-1 rounded-none px-4 py-2 font-display text-[9px] font-black tracking-widest uppercase transition-all duration-200 ${
              added 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-900 text-white hover:bg-blue-900'
            }`}
          >
            {added ? (
              <>
                <Check size={11} className="stroke-[3]" />
                <span>Нэмэгдлээ</span>
              </>
            ) : (
              <>
                <Plus size={11} className="stroke-[3]" />
                <span>Захиалах</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
