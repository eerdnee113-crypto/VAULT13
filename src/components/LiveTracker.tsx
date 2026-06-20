/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { Search, Eye, Calendar, MapPin, Phone, MessageSquare, Clock, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface LiveTrackerProps {
  id?: string;
  orders: Order[];
  activeOrderId: string | null;
  onSearchOrder: (id: string) => void;
}

export default function LiveTracker({
  id = 'order-live-tracker',
  orders,
  activeOrderId,
  onSearchOrder
}: LiveTrackerProps) {
  const [searchCode, setSearchCode] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 5 standard stages in Mongolian
  const STAGES: { status: OrderStatus; title: string; subtitle: string }[] = [
    { status: 'pending', title: 'Төлбөр Хүлээгдэж Буй', subtitle: 'Автомат бүртгэл' },
    { status: 'confirmed', title: 'Баталгаажсан', subtitle: 'Төлбөр төлөгдсөн' },
    { status: 'preparing', title: 'Бэлтгэгдэж Буй', subtitle: 'Чанар шалгалт, Хайрцаглалт' },
    { status: 'on_the_way', title: 'Хүргэлтэд Гарсан', subtitle: 'Хүргэгч замад гарсан' },
    { status: 'delivered', title: 'Хүргэгдсэн', subtitle: 'Амжилттай хүлээлгэн өгсөн' }
  ];

  // Map of active index based on status
  const getStatusIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'on_the_way': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  useEffect(() => {
    if (activeOrderId) {
      const order = orders.find(o => o.id.toUpperCase() === activeOrderId.toUpperCase());
      if (order) {
        setSelectedOrder(order);
        setSearchCode(order.id);
        setErrorMsg('');
      }
    } else if (orders.length > 0 && !selectedOrder) {
      // Setup default placeholder search to make it interactive initially
      setSelectedOrder(orders[orders.length - 1]);
      setSearchCode(orders[orders.length - 1].id);
    }
  }, [activeOrderId, orders]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    const code = searchCode.trim().toUpperCase();
    const found = orders.find(o => o.id.toUpperCase() === code);

    if (found) {
      setSelectedOrder(found);
      onSearchOrder(found.id);
      setErrorMsg('');
    } else {
      setErrorMsg('Уучлаарай, ийм кодтой захиалга олдсонгүй. Кодоо зөв оруулна уу (Жишээ нь: ORD-9281)');
    }
  };

  const currentIndex = selectedOrder ? getStatusIndex(selectedOrder.status) : -1;

  // Render nice date/time string
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.getMonth() + 1}-р сарын ${d.getDate()} - ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div id={id} className="mx-auto w-full max-w-5xl py-8 px-4 sm:px-6 lg:px-8">
      {/* Search Bar Wrap - Swiss-Minimalist Clean Layout */}
      <div id="tracker-search-panel" className="mb-10 text-center max-w-xl mx-auto space-y-4">
        <h2 id="tracker-main-heading" className="font-display text-2xl font-bold tracking-tight text-slate-900 uppercase">
          ЗАХИАЛГА БОДИТ ХУГАЦААНД ХЯНАХ СИСТЕМ
        </h2>
        <p className="font-sans text-xs text-slate-400 font-medium">
          Захиалга хийхэд олгосон <strong className="font-mono text-slate-600">ORD-XXXX</strong> ухаалаг дугаараа доор оруулж хүргэлтийн явцаа шууд хянана уу.
        </p>

        <form id="tracker-search-form" onSubmit={handleSearchSubmit} className="relative mt-4 flex items-center">
          <input
            id="tracker-search-input"
            type="text"
            placeholder="Захиалгын код оруулна уу (жишээ нь: ORD-9281)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full border border-slate-200 bg-white py-3 pl-4 pr-12 font-mono text-xs font-semibold outline-none transition focus:border-slate-900 uppercase tracking-widest placeholder:lowercase placeholder:font-sans"
          />
          <button
            id="tracker-search-submit"
            type="submit"
            className="absolute right-0 h-full px-4 text-slate-400 hover:text-slate-900 transition flex items-center justify-center cursor-pointer"
            aria-label="Хайх"
          >
            <Search size={16} />
          </button>
        </form>

        {errorMsg && (
          <p id="tracker-error-msg" className="text-red-500 font-sans text-xs">{errorMsg}</p>
        )}
      </div>

      {selectedOrder ? (
        <div id="tracker-results-container" className="space-y-8 animate-fade-in">
          {/* Summary Banner Card */}
          <div 
            id="tracker-summary-card" 
            className="flex flex-col md:flex-row items-start md:items-center justify-between border-2 border-slate-900 bg-white p-6 space-y-4 md:space-y-0 rounded-none shadow-[4px_4px_0px_0px_rgba(30,58,138,1)]"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2.5">
                <span className="font-mono text-[10px] font-black text-blue-900 tracking-widest uppercase bg-blue-50 border border-blue-250 px-2 py-0.5 rounded-none">ЗАХИАЛГА</span>
                <span id="tracker-order-id" className="font-mono text-xl font-bold tracking-wide text-slate-950">
                  {selectedOrder.id}
                </span>
              </div>
              <p className="font-sans text-xs text-slate-450 mt-1">
                Бүртгэгдсэн огноо: <span className="font-mono font-medium">{formatTime(selectedOrder.createdAt)}</span>
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-left md:text-right">
                <span className="font-display text-[10px] tracking-widest text-slate-400 uppercase block font-semibold">ХҮЛЭЭН АВАГЧ</span>
                <span id="tracker-cust-name" className="font-sans text-sm font-semibold text-slate-800">{selectedOrder.customerName}</span>
              </div>

              <div className="h-8 w-px bg-slate-100" />

              <div className="text-left md:text-right">
                <span className="font-display text-[10px] tracking-widest text-slate-400 uppercase block font-semibold">НИЙТ ТӨЛБӨР</span>
                <span id="tracker-cust-amount" className="font-mono text-sm font-bold text-slate-900">{selectedOrder.totalAmount.toLocaleString()}₮</span>
              </div>
            </div>
          </div>

          {/* 5-STAGE PIPELINE PROGRESS INDICATOR */}
          <div id="tracker-timeline-section" className="border-2 border-slate-900 bg-white p-6 sm:p-8 space-y-8 rounded-none">
            <h3 className="font-display text-xs font-black tracking-widest text-blue-900 uppercase">ХҮРГЭЛТИЙН ЯВЦЫН УДАРХАЙ</h3>
            
            {/* Steps Container */}
            <div id="timeline-stepper" className="relative flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0 pt-2">
              
              {/* Connecting background Line */}
              <div className="absolute top-[17px] left-4 md:left-[4%] right-4 md:right-[4%] h-0.5 bg-slate-100 hidden md:block z-0" />
              
              {/* Active filled background line */}
              <div 
                id="timeline-active-line"
                className="absolute top-[17px] left-[5%] h-0.5 bg-slate-900 hidden md:block z-0 transition-all duration-500 ease-out" 
                style={{ width: `${(currentIndex / 4) * 90}%` }}
              />

              {STAGES.map((s, idx) => {
                const isActive = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div 
                    key={s.status} 
                    id={`timeline-step-${s.status}`}
                    className={`relative z-10 flex md:flex-col items-center md:items-center text-left md:text-center flex-1 w-full md:w-auto ${
                      isActive ? 'text-slate-900' : 'text-slate-350'
                    }`}
                  >
                    {/* Ring/Circle */}
                    <div 
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 bg-white mr-4 md:mr-0 md:mb-3.5 ${
                        isCurrent 
                          ? 'border-slate-950 ring-[5px] ring-slate-100' 
                          : isActive 
                            ? 'border-slate-900 bg-slate-950 text-white' 
                            : 'border-slate-200 text-slate-300'
                      }`}
                    >
                      {isActive && !isCurrent ? (
                        <ShieldCheck id={`timeline-checkmark-${s.status}`} size={16} className="text-white fill-none" />
                      ) : (
                        <span className="font-mono text-xs font-semibold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Meta Labels */}
                    <div className="flex flex-col space-y-0.5">
                      <span 
                        className={`font-display text-xs tracking-tight font-bold ${
                          isCurrent ? 'text-slate-900 font-extrabold scale-[1.02] origin-left md:origin-center' : isActive ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {s.title}
                      </span>
                      <span className="font-sans text-[10px] text-slate-400 font-medium">
                        {s.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & Live Logging grid */}
          <div id="tracker-logs-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Delivery Details Panel */}
            <div id="tracker-shipping-details-panel" className="md:col-span-1 border border-slate-100 bg-white p-6 space-y-5">
              <h4 className="font-display text-xs font-bold tracking-widest text-slate-800 uppercase border-b border-slate-100 pb-2">ХҮРГЭЛТИЙН ХАЯГЛУУД</h4>
              
              <div className="space-y-4 text-xs font-sans">
                {/* Shipping Address */}
                <div className="flex items-start space-x-3">
                  <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block tracking-wider font-semibold text-[10px] uppercase">ХҮРГЭХ ХАЯГ</span>
                    <span id="tracker-val-address" className="text-slate-700 leading-relaxed font-semibold">{selectedOrder.address}</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3">
                  <Phone size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block tracking-wider font-semibold text-[10px] uppercase">УТАСНЫ ДУГААР</span>
                    <span id="tracker-val-phone" className="font-mono text-slate-700 font-bold">{selectedOrder.phone}</span>
                  </div>
                </div>

                {/* Note */}
                <div className="flex items-start space-x-3">
                  <MessageSquare size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block tracking-wider font-semibold text-[10px] uppercase">ЗАХИАЛАГЧИЙН ТЭМДЭГЛЭЛ</span>
                    <span id="tracker-val-notes" className="text-slate-650 italic">
                      {selectedOrder.notes || 'Байхгүй.'}
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="flex items-start space-x-3 pt-2 border-t border-slate-50">
                  <div className="h-4 w-4 rounded bg-slate-100 flex items-center justify-center text-[8px] font-mono font-bold shrink-0 mt-0.5 uppercase">
                    MK
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block tracking-wider font-semibold text-[10px] uppercase">ТӨЛБӨРИЙН СУВАГ</span>
                    <span id="tracker-val-paymethod" className="font-mono text-slate-700 font-bold uppercase">{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Logs History Pipeline (Direct update monitoring) */}
            <div id="tracker-history-logs-panel" className="md:col-span-2 border-2 border-slate-900 bg-white p-6 space-y-4 rounded-none">
              <h4 className="font-display text-xs font-black tracking-widest text-blue-900 uppercase border-b border-slate-200 pb-2 flex items-center justify-between">
                <span>ЯВЦЫН ЛОГ ТҮҮХ</span>
                <span className="font-sans text-[10px] text-slate-400 font-medium tracking-normal normal-case">Тасралтгүй шинэчлэгдэнэ</span>
              </h4>

              <div id="tracker-logs-list" className="relative space-y-6 pl-4 border-l border-slate-100 py-2">
                {selectedOrder.logs && selectedOrder.logs.length > 0 ? (
                  [...selectedOrder.logs].reverse().map((log, lIdx) => (
                    <div 
                      key={lIdx} 
                      id={`tracker-log-item-${lIdx}`}
                      className="relative space-y-1"
                    >
                      {/* Left timeline anchor bullet */}
                      <span className={`absolute -left-[20.5px] top-1 h-3 w-3 rounded-full border bg-white ${
                        lIdx === 0 ? 'border-slate-900 ring-2 ring-slate-100 bg-slate-950' : 'border-slate-200'
                      }`} />
                      
                      <div className="flex items-center space-x-2">
                        <span className={`font-display text-xs font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                          lIdx === 0 ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'
                        }`}>
                          {log.status === 'pending' && 'АМЖИЛТГҮЙ / ХҮЛЭЭГДЭЖ БУЙ'}
                          {log.status === 'confirmed' && 'БАТАЛГААЖСАН'}
                          {log.status === 'preparing' && 'БЭЛТГЭЖ БУЙ'}
                          {log.status === 'on_the_way' && 'ХҮРГЭЛТЭД'}
                          {log.status === 'delivered' && 'ХҮРГЭГДСЭН'}
                        </span>
                        
                        <span className="font-mono text-[10px] text-slate-400 flex items-center">
                          <Clock size={11} className="mr-1" />
                          {formatTime(log.updatedAt)}
                        </span>
                      </div>

                      <p className="font-sans text-xs text-slate-600 leading-relaxed pl-1">
                        {log.note}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="font-sans text-xs text-slate-450 italic">Явцын мэдээлэл одоогоор алга байна.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Empty state default query helper */
        <div id="tracker-unselected-state" className="text-center py-16 border border-slate-150 border-dashed bg-white max-w-xl mx-auto p-8 space-y-4">
          <Clock size={36} className="text-slate-300 mx-auto stroke-[1.5]" />
          <div className="space-y-1">
            <h4 className="font-display text-sm font-semibold text-slate-755 uppercase">БҮРТГЭЛГҮЙ БУЮУ КҮРҮҮЛЭЭГҮЙ</h4>
            <p className="font-sans text-xs text-slate-400">Шүүлт хийх кодыг дээрх хайлтаар оруулж захиалгаа бодит хугацаанд хянана уу.</p>
          </div>
          
          {orders.length > 0 && (
            <div className="space-y-2 pt-4 bg-slate-50 p-4 border-2 border-slate-900 text-left rounded-none">
              <span className="font-display text-[10px] font-black tracking-widest text-blue-900 uppercase block">СИСТЕМД ХАДГАЛАГДСАН ЗАХИАЛГУУД:</span>
              <div id="tracker-system-seeds-list" className="flex flex-wrap gap-1.5 mt-2">
                {orders.map(o => (
                  <button
                    key={o.id}
                    id={`seed-btn-${o.id}`}
                    onClick={() => {
                      setSearchCode(o.id);
                      setSelectedOrder(o);
                    }}
                    className="font-mono text-xs font-bold border-2 border-slate-900 bg-white hover:border-blue-900 py-1.5 px-3 rounded-none transition cursor-pointer"
                  >
                    {o.id} ({o.customerName.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
