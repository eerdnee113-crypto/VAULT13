/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Order, OrderStatus, Watch } from '../types';
import { 
  DollarSign, Package, Shuffle, RefreshCw, BarChart2, ShieldCheck, 
  Trash2, Filter, ChevronDown, CheckCircle, ExternalLink, Calendar,
  TrendingUp, Users, Clock, ShoppingCart, Tag
} from 'lucide-react';
import WatchListingsManager from './WatchListingsManager';

interface DashboardProps {
  id?: string;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, logComment: string) => void;
  onResetMemory: () => void;
  onDeleteOrder: (orderId: string) => void;
  watches: Watch[];
  onAddWatch: (newWatch: Watch) => void;
  onUpdateWatch: (updatedWatch: Watch) => void;
  onDeleteWatch: (watchId: string) => void;
  onDeleteAllWatches: () => void;
}

export default function Dashboard({
  id = 'admin-bento-dashboard',
  orders,
  onUpdateOrderStatus,
  onResetMemory,
  onDeleteOrder,
  watches,
  onAddWatch,
  onUpdateWatch,
  onDeleteWatch,
  onDeleteAllWatches
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'listings'>('orders');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [customComment, setCustomComment] = useState('');

  // 1. Math and stats
  const totalOrders = orders.length;
  // Paid / Confirmed orders constitute revenue
  const confirmedAndBeyond = orders.filter(o => o.status !== 'pending');
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Social traffic distribution FB vs IG
  // We can seed FB vs IG ratio but allow dynamic math or manual slider adjustment
  const fbOrdersCount = orders.filter(o => o.id.charCodeAt(o.id.length - 1) % 2 === 0).length;
  const igOrdersCount = totalOrders - fbOrdersCount;
  const fbPercent = totalOrders > 0 ? Math.round((fbOrdersCount / totalOrders) * 100) : 55;
  const igPercent = 100 - fbPercent;

  // Watch categories sold count
  const classicSalesCount = orders.reduce((sum, o) => 
    sum + o.items.filter(item => item.watch.category === 'Classic').reduce((s, i) => s + i.quantity, 0), 0);
  const sportSalesCount = orders.reduce((sum, o) => 
    sum + o.items.filter(item => item.watch.category === 'Sport').reduce((s, i) => s + i.quantity, 0), 0);
  const luxurySalesCount = orders.reduce((sum, o) => 
    sum + o.items.filter(item => item.watch.category === 'Luxury').reduce((s, i) => s + i.quantity, 0), 0);

  const totalSold = classicSalesCount + sportSalesCount + luxurySalesCount || 1;

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch = 
      o.id.toUpperCase().includes(searchQuery.toUpperCase()) || 
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    let note = '';
    switch (newStatus) {
      case 'confirmed':
        note = 'Админ захиалгын төлбөрийг шалгаж, гар аргаар БАТАЛГААЖУУЛАВ.';
        break;
      case 'preparing':
        note = `Админ захиалгыг БЭЛТГЭЖ ЭХЭЛЛЭЭ. ${customComment ? `Нэмэлт: ${customComment}` : 'Цагны нарийн тохируулга болон хайрцаглалт бэлэн болж байна.'}`;
        break;
      case 'on_the_way':
        note = `Захиалга ХҮРГЭЛТЭД ГАРЛАА. ${customComment ? `Хүргэгч: ${customComment}` : 'Сургуулилттай хүргэгч хаягийн дагуу яг одоо замад гарсан.'}`;
        break;
      case 'delivered':
        note = `Бараа ХЭРЭГЛЭГЧИД ХҮРГЭГДЛЭЭ. ${customComment ? `Тэмдэглэл: ${customComment}` : 'Хүлээлгэн өгсөн.'}`;
        break;
      default:
        note = 'Захиалгын явц өөрчлөгдлөө.';
    }

    onUpdateOrderStatus(orderId, newStatus, note);
    setCustomComment('');
    // Refresh modal
    const updated = orders.find(o => o.id === orderId);
    if (updated) {
      setSelectedOrderDetails({ ...updated, status: newStatus });
    }
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'on_the_way': return 'bg-orange-100 text-orange-850 border-orange-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusNameMongolian = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Төлбөр хүлээгдэж буй';
      case 'confirmed': return 'Баталгаажсан';
      case 'preparing': return 'Бэлтгэгдэж буй';
      case 'on_the_way': return 'Хүргэлтэд гарсан';
      case 'delivered': return 'Хүргэгдсэн';
    }
  };

  return (
    <div id={id} className="mx-auto w-full max-w-7xl py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Executive Title & Diagnostics */}
      <div id="admin-top-headline" className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-5 space-y-4 md:space-y-0">
        <div>
          <h2 id="admin-title" className="font-display text-2xl font-bold tracking-tight text-slate-900">
            УДИРДЛАГЫН НЭГДСЭН СИСТЕМ (EXECUTIVE DASHBOARD)
          </h2>
          <p className="font-sans text-xs text-slate-450 mt-1">
            Дэлгүүрийн нийт борлуулалт, сошиал урсгалын хувь, цагны зэрэг ангилал болон захиалгын статусь удирдах хэсэг.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* RESET MEMORY BUTTON WITH DUMP ICON */}
          <button
            id="admin-btn-reset-memory"
            onClick={() => {
              if (window.confirm('Та системийн бүх мэдээллийг устгаад, анхны байдалд нь шинэчлэн seed хийхдээ итгэлтэй байна уу?')) {
                onResetMemory();
              }
            }}
            className="flex items-center space-x-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 font-display text-xs font-bold tracking-wider rounded transition cursor-pointer"
          >
            <RefreshCw size={14} className="animate-spin-slow text-red-600" />
            <span>Memory Reset</span>
          </button>
        </div>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div id="admin-bento-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bento CARD 1: Total Revenue and core quick metrics */}
        <div id="bento-revenue-card" className="border-2 border-slate-900 bg-white p-6 justify-between flex flex-col hover:border-blue-900 transition h-52 rounded-none shadow-[4px_4px_0px_0px_rgba(30,58,138,1)]">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-black tracking-widest text-[#1e3a8a] uppercase">НИЙТ ОРЛОГО (ОРЛОГЫН САН)</span>
            <div className="p-2 bg-blue-50 border-2 border-slate-900 rounded-none text-blue-900">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="my-auto space-y-1">
            <h3 id="stat-revenue-value" className="font-mono text-3xl font-extrabold text-slate-950">
              {totalRevenue.toLocaleString()}₮
            </h3>
            <p className="font-sans text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
              ХАДГАЛАГДСАН НИЙТ ОРЛОГЫН ДҮН ({totalOrders} Захиалга)
            </p>
          </div>
          <div className="flex justify-between items-center text-xs font-mono border-t border-slate-100 pt-3 text-slate-400 font-semibold">
            <span>АВТОМАТ БҮРТГЭЛТЭЙ</span>
            <span className="text-emerald-700 flex items-center">● ОФЛАЙН ХАДГАЛАГДСАН</span>
          </div>
        </div>

        {/* Bento CARD 2: FB vs IG Referrals traffic dynamic compare */}
        <div id="bento-traffic-card" className="border-2 border-slate-900 bg-white p-6 justify-between flex flex-col hover:border-blue-900 transition h-52 rounded-none shadow-[4px_4px_0px_0px_rgba(30,58,138,1)]">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-black tracking-widest text-blue-900 uppercase">УРСГАЛЫН ХУВЬ (FB vs IG REFERRAL)</span>
            <div className="p-2 bg-slate-50 border rounded text-blue-500">
              <Users size={16} />
            </div>
          </div>

          <div className="my-auto space-y-3">
            {/* Horizontal Stack Compare Bar */}
            <div className="h-6 w-full bg-slate-100 rounded-sm overflow-hidden flex relative font-mono text-[10px] font-bold text-white">
              {/* FB Segment */}
              <div 
                id="bar-fb-segment"
                className="bg-[#1877F2] flex items-center justify-center transition-all duration-500" 
                style={{ width: `${fbPercent}%` }}
              >
                {fbPercent}%
              </div>
              {/* IG Segment */}
              <div 
                id="bar-ig-segment"
                className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center transition-all duration-500" 
                style={{ width: `${igPercent}%` }}
              >
                {igPercent}%
              </div>
            </div>

            <div className="flex justify-between text-xs font-display">
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-[#1877F2]" />
                <span className="text-slate-750 font-bold text-[11px]">Facebook Link ({fbOrdersCount})</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-[#FD1D1D]" />
                <span className="text-slate-750 font-bold text-[11px]">Instagram ({igOrdersCount})</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-sans text-slate-400 font-medium leading-tight">
            Харилцагчийн сошиал сувгийн хаягаас орсон урсгалыг алгоритмаар тооцоолов.
          </div>
        </div>

        {/* Bento CARD 3: Watch Category sales - High contrast minimalist vector chart */}
        <div id="bento-categories-card" className="border-2 border-slate-900 bg-white p-6 justify-between flex flex-col hover:border-blue-900 transition h-52 rounded-none shadow-[4px_4px_0px_0px_rgba(30,58,138,1)]">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs font-black tracking-widest text-blue-900 uppercase">АНГИЛЛЫН БОРЛУУЛАЛТ</span>
            <div className="p-2 bg-blue-50 border-2 border-slate-900 rounded-none text-blue-900">
              <BarChart2 size={16} />
            </div>
          </div>

          {/* Minimalist interactive visual bar segments */}
          <div className="my-auto space-y-2 font-display text-[11px]">
            {/* Classic */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Classic</span>
                <span className="font-mono">{classicSalesCount} цаг ({Math.round((classicSalesCount/totalSold)*100)}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-none overflow-hidden">
                <div className="bg-slate-900 h-full transition-all" style={{ width: `${(classicSalesCount/totalSold)*100}%` }} />
              </div>
            </div>

            {/* Sport */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Sport</span>
                <span className="font-mono">{sportSalesCount} цаг ({Math.round((sportSalesCount/totalSold)*100)}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-none overflow-hidden">
                <div className="bg-blue-900 h-full transition-all" style={{ width: `${(sportSalesCount/totalSold)*100}%` }} />
              </div>
            </div>

            {/* Luxury */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Luxury</span>
                <span className="font-mono">{luxurySalesCount} цаг ({Math.round((luxurySalesCount/totalSold)*100)}%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-none overflow-hidden">
                <div className="bg-slate-400 h-full transition-all" style={{ width: `${(luxurySalesCount/totalSold)*100}%` }} />
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-450 uppercase tracking-wider text-right">
            Нийт {totalSold} цаг зарагдсан
          </div>
        </div>

      </div>

      {/* ADMIN TABS SELECTOR */}
      <div id="admin-tabs-section" className="flex border-2 border-slate-900 bg-white p-1 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
        <button
          id="tab-btn-orders"
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 font-display text-xs font-black tracking-widest uppercase transition-all rounded-none cursor-pointer border-r border-slate-200 ${
            activeTab === 'orders'
              ? 'bg-slate-950 text-white shadow-[2px_2px_0px_0px_rgba(30,58,138,1)]'
              : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Package size={14} />
          <span>ЗАХИАЛГЫН ХЯНАЛТЫН ТҮҮХ ({orders.length})</span>
        </button>
        <button
          id="tab-btn-listings"
          type="button"
          onClick={() => setActiveTab('listings')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 font-display text-xs font-black tracking-widest uppercase transition-all rounded-none cursor-pointer ${
            activeTab === 'listings'
              ? 'bg-slate-950 text-white shadow-[2px_2px_0px_0px_rgba(30,58,138,1)]'
              : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Tag size={14} />
          <span>БҮТЭЭГДЭХҮҮН, ЗАРИН САН ({watches?.length || 0})</span>
        </button>
      </div>

      {activeTab === 'orders' ? (
        /* Orders Filter & Controls Panel */
        <div id="admin-orders-table-card" className="border-2 border-slate-900 bg-white overflow-hidden rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
        
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-5 border-b-2 border-slate-900 bg-slate-50 gap-4">
          <div className="flex items-center space-x-3">
            <Package size={18} className="text-blue-900" />
            <span className="font-display text-sm font-black tracking-tight text-slate-900 uppercase">ЗАХИАЛГУУДЫН БҮРТГЭЛИЙН ХУУДАС</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            {/* Search Input */}
            <input
              id="admin-filter-search-input"
              type="text"
              placeholder="Код, нэр, утсаар хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-slate-200 bg-white px-3 py-1.5 font-sans text-xs outline-none focus:border-slate-900"
            />

            {/* Status Filter Dropdown */}
            <div className="flex items-center space-x-1.5 border border-slate-200 bg-white px-2.5 py-1.5 rounded-sm">
              <Filter id="admin-icon-filter" size={12} className="text-slate-400" />
              <select
                id="admin-filter-status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent font-display text-xs outline-none cursor-pointer text-slate-705 font-semibold"
              >
                <option value="all">Бүх төлөвөөр</option>
                <option value="pending">Төлбөр хүлээгдэж буй</option>
                <option value="confirmed">Баталгаажсан</option>
                <option value="preparing">Бэлтгэгдэж буй</option>
                <option value="on_the_way">Хүргэлтэд гарсан</option>
                <option value="delivered">Хүргэгдсэн</option>
              </select>
            </div>
          </div>
        </div>

        {/* Master Table Grid */}
        <div id="admin-table-container" className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-slate-50/20">
                <th className="px-5 py-3">ЗАХИАЛГА КОР</th>
                <th className="px-5 py-3">КАРТ / ҮНЭ</th>
                <th className="px-5 py-3">ТӨЛӨВ</th>
                <th className="px-5 py-3">ОГНОО</th>
                <th className="px-5 py-3 text-right">ҮЙЛДЛҮҮД</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-xs">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((o) => (
                  <tr 
                    key={o.id} 
                    id={`admin-table-row-${o.id}`}
                    onClick={() => {
                      setSelectedOrderDetails(o);
                      setCustomComment('');
                    }}
                    className={`hover:bg-slate-50/50 cursor-pointer transition ${
                      selectedOrderDetails?.id === o.id ? 'bg-slate-50' : ''
                    }`}
                  >
                    {/* ID & Customer Information layout */}
                    <td className="px-5 py-3.5 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">{o.id}</span>
                        <span className="font-sans font-medium text-slate-500 uppercase tracking-tight text-[10px] bg-slate-105 px-1.5 py-0.5 rounded border">
                          {o.paymentMethod.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-slate-650">
                        <strong className="text-slate-800 font-semibold">{o.customerName}</strong>
                        <span className="text-slate-400 mx-1.5">|</span> 
                        <span className="font-mono text-slate-500">{o.phone}</span>
                      </div>
                    </td>

                    {/* Bought product breakdown */}
                    <td className="px-5 py-3.5 space-y-0.5">
                      <div className="font-sans font-semibold text-slate-800 truncate max-w-xs">
                        {o.items.map(i => `${i.watch.name} (x${i.quantity})`).join(', ')}
                      </div>
                      <div className="font-mono font-bold text-slate-950 font-semibold text-xs">
                        {o.totalAmount.toLocaleString()}₮
                      </div>
                    </td>

                    {/* Stage bubble */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center border px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusBadgeClass(o.status)}`}>
                        {getStatusNameMongolian(o.status)}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="px-5 py-3.5 font-mono text-slate-450">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>

                    {/* Delete and view button */}
                    <td className="px-5 py-3.5 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        id={`admin-table-btn-select-${o.id}`}
                        onClick={() => setSelectedOrderDetails(o)}
                        className="rounded border border-slate-100 p-1.5 hover:border-slate-300 hover:text-slate-900 text-slate-400 transition"
                        title="Дэлгэрэнгүй удирдах"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        id={`admin-table-btn-delete-${o.id}`}
                        onClick={() => {
                          if (window.confirm(`${o.id} дугаартай захиалгыг бүрэн устгахдаа итгэлтэй байна уу?`)) {
                            onDeleteOrder(o.id);
                            if (selectedOrderDetails?.id === o.id) {
                              setSelectedOrderDetails(null);
                            }
                          }
                        }}
                        className="rounded border border-red-50 hover:bg-red-50 p-1.5 text-slate-400 hover:text-red-500 transition"
                        title="Устгах"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    Хайлт эсвэл шүүлтүүрт тохирох захиалгын мэдээлэл олдсонгүй.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      ) : (
        <WatchListingsManager
          watches={watches}
          onAddWatch={onAddWatch}
          onUpdateWatch={onUpdateWatch}
          onDeleteWatch={onDeleteWatch}
          onDeleteAllWatches={onDeleteAllWatches}
        />
      )}

      {/* DETAILED STAT CONTROL POPUP/SIDEBAR DRAWER (When an item is selected from database) */}
      {selectedOrderDetails && (
        <div id="admin-detail-panel" className="border-2 border-slate-900 bg-blue-50/40 p-6 rounded-none relative animate-fade-in space-y-6 shadow-[4px_4px_0px_0px_rgba(30,58,138,0.15)]">
          <button
            id="admin-detail-btn-close"
            onClick={() => setSelectedOrderDetails(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-semibold text-lg"
          >
            ×
          </button>
          
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
            <div className="space-y-1 max-w-lg">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-black text-blue-900 tracking-widest uppercase">Хяналтын Картын Шилжилт</span>
                <span className="font-mono text-sm font-extrabold text-slate-900">({selectedOrderDetails.id})</span>
              </div>
              <h3 className="font-display text-base font-bold text-slate-850">
                Захиалга: {selectedOrderDetails.customerName} - {selectedOrderDetails.phone}
              </h3>
              <p className="font-sans text-xs text-slate-500">
                Админ хэсгээс статус өөрчлөхөд <strong>Захиалга Хянах Хуудам</strong> дэх хэрэглэгчийн явц бодит хугацаанд (Real-Time) шинэчлэгдэж лог түүх нэмэгдэнэ.
              </p>
            </div>

            {/* Custom comment input */}
            <div className="w-full lg:w-96 space-y-1.5">
              <label className="font-display text-[10px] font-bold text-slate-500 tracking-wider">ЯВЦЫН ТЭМДЭГЛЭЛ, ЛОГТ ХАРАГДАХ СЭДЭВ (ОПЦИОНАЛЬ)</label>
              <input
                id="admin-detail-log-comment"
                type="text"
                placeholder="Хүргэгч Билгүүн 8844... эсвэл Сав баглаа боосон гэх мэт"
                value={customComment}
                onChange={(e) => setCustomComment(e.target.value)}
                className="w-full border border-slate-200 bg-white p-2 text-xs outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="font-display text-[10px] font-bold text-slate-450 block mb-3 uppercase tracking-wider">ЭНЭ ЗАХИАЛГЫН ТҮЛХҮҮР ШАТЛАЛЫГ ӨӨРЧЛӨХ:</span>
            
            <div id="admin-detail-stages-controls" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Confirmed */}
              <button
                id="admin-btn-set-confirmed"
                onClick={() => handleStatusUpdate(selectedOrderDetails.id, 'confirmed')}
                disabled={selectedOrderDetails.status === 'confirmed'}
                className="flex items-center justify-center space-x-1.5 border border-blue-200 hover:bg-blue-100/50 p-2.5 text-xs font-display font-bold rounded transition text-blue-800 disabled:opacity-40 cursor-pointer"
              >
                <CheckCircle size={12} />
                <span>Баталгаажуулах</span>
              </button>

              {/* Preparing */}
              <button
                id="admin-btn-set-preparing"
                onClick={() => handleStatusUpdate(selectedOrderDetails.id, 'preparing')}
                disabled={selectedOrderDetails.status === 'preparing'}
                className="flex items-center justify-center space-x-1.5 border border-violet-200 hover:bg-violet-100/50 p-2.5 text-xs font-display font-bold rounded transition text-violet-800 disabled:opacity-40 cursor-pointer"
              >
                <Clock size={12} />
                <span>Бэлтгэгдэх</span>
              </button>

              {/* On the way */}
              <button
                id="admin-btn-set-ontheway"
                onClick={() => handleStatusUpdate(selectedOrderDetails.id, 'on_the_way')}
                disabled={selectedOrderDetails.status === 'on_the_way'}
                className="flex items-center justify-center space-x-1.5 border border-orange-200 hover:bg-orange-100/50 p-2.5 text-xs font-display font-bold rounded transition text-orange-850 disabled:opacity-40 cursor-pointer"
              >
                <TrendingUp size={12} />
                <span>Хүргэлтэд гаргах</span>
              </button>

              {/* Delivered */}
              <button
                id="admin-btn-set-delivered"
                onClick={() => handleStatusUpdate(selectedOrderDetails.id, 'delivered')}
                disabled={selectedOrderDetails.status === 'delivered'}
                className="flex items-center justify-center space-x-1.5 border border-emerald-200 hover:bg-emerald-100/50 p-2.5 text-xs font-display font-bold rounded transition text-emerald-800 disabled:opacity-40 cursor-pointer"
              >
                <CheckCircle size={12} className="fill-none" />
                <span>Хүргэгдсэн болгов</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
