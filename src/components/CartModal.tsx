/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Watch, Order, PaymentMethod, OrderStatus } from '../types';
import { X, Plus, Minus, Trash2, Wallet, CreditCard, Banknote, ShieldCheck, CheckCircle2, Copy, ShoppingBag, Facebook } from 'lucide-react';
import { isFacebookUrl } from '../utils/facebook';

interface CartModalProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  cart: { watch: Watch; quantity: number }[];
  onUpdateQuantity: (watchId: string, quantity: number) => void;
  onRemoveItem: (watchId: string) => void;
  onPlaceOrder: (order: Order) => void;
}

export default function CartModal({
  id = 'checkout-cart-modal',
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder
}: CartModalProps) {
  // If not open, do not render
  if (!isOpen) return null;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qpay');
  const [selectedBank, setSelectedBank] = useState('khan');

  // Credit Card States
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Checkout Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment_pending' | 'success'>('cart');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.watch.price * item.quantity), 0);

  // Form Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!customerName || customerName.trim().length < 2) {
      newErrors.customerName = 'Та бүтэн нэрээ оруулна уу (хамгийн багадаа 2 тэмдэгт)';
    }

    // Mongolian phone validator: typically starts with 9, 8, 7, 6 and has 8 digits
    const phoneRegex = /^[56789][0-9]{7}$/;
    if (!phone || !phoneRegex.test(phone.trim())) {
      newErrors.phone = 'Утасны дугаараа зөв оруулна уу (Монголын дугаар, 8 оронтой)';
    }

    if (!address || address.trim().length < 5) {
      newErrors.address = 'Хүргэлтийн хаягаа тодорхой оруулна уу (дүүрэг, хороо, байр хотхон, тоот)';
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Картын 16 оронтой дугаарыг оруулна уу';
      }
      if (!cardExpiry || !cardExpiry.includes('/')) {
        newErrors.cardExpiry = 'Хүчинтэй хугацаа оруулна уу (ЖЖ/СС)';
      }
      if (!cardCvv || cardCvv.trim().length !== 3) {
        newErrors.cardCvv = 'CVV 3 оронтой кодыг оруулна уу';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCheckoutStep('payment_pending');
    }
  };

  // Simulated Payment Completion
  const handleCompletePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Create Unique Order ID matching ORD-9281 format
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `ORD-${randNum}`;
      
      const now = new Date().toISOString();
      const newOrder: Order = {
        id: generatedId,
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim() || undefined,
        items: [...cart],
        totalAmount: subtotal,
        paymentMethod: paymentMethod,
        status: 'confirmed', // Instantly confirmed upon successful checkout!
        createdAt: now,
        logs: [
          { status: 'pending', updatedAt: now, note: 'Харилцагч захиалгыг системд илгээв.' },
          { 
            status: 'confirmed', 
            updatedAt: now, 
            note: `${paymentMethod.toUpperCase()}-ээр ${subtotal.toLocaleString()}₮-ний төлбөр амжилттай хийгдэж захиалга баталгаажлаа.` 
          }
        ]
      };

      onPlaceOrder(newOrder);
      setCreatedOrder(newOrder);
      setCheckoutStep('success');
      setIsProcessing(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mongolianBanks = [
    { id: 'khan', name: 'Хаан Банк', color: 'bg-emerald-800 text-white border-emerald-900', logo: 'KHAN' },
    { id: 'golomt', name: 'Голомт Банк', color: 'bg-blue-950 text-white border-blue-900', logo: 'GOLOMT' },
    { id: 'state', name: 'Төрийн Банк', color: 'bg-amber-600 text-white border-amber-700', logo: 'STATE' },
    { id: 'tdb', name: 'Худалдаа Хөгжил', color: 'bg-[#1e293b] text-white border-[#0f172a]', logo: 'TDB' },
    { id: 'xac', name: 'Хас Банк', color: 'bg-amber-500 text-black border-amber-600', logo: 'XAC' }
  ];

  return (
    <div 
      id={id} 
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm transition-opacity"
    >
      {/* Background click to close */}
      <div 
        id={`${id}-backdrop`} 
        onClick={() => checkoutStep !== 'payment_pending' && onClose()} 
        className="absolute inset-0 cursor-pointer" 
      />

      {/* Main Drawer Shell */}
      <div 
        id={`${id}-container`} 
        className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl animate-slide-in"
      >
        {/* Header */}
        <div id={`${id}-header`} className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center space-x-2">
            <h2 id={`${id}-title`} className="font-display text-lg font-bold tracking-tight text-slate-900">
              {checkoutStep === 'cart' && 'МИНИЙ САГС'}
              {checkoutStep === 'payment_pending' && 'ТӨЛБӨР ТӨЛӨХ'}
              {checkoutStep === 'success' && 'ЗАХИАЛГА АМЖИЛТТАЙ!'}
            </h2>
            <span id={`${id}-count-badge`} className="rounded bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-600">
              {cart.length}
            </span>
          </div>
          <button
            id={`${id}-btn-close`}
            onClick={onClose}
            disabled={checkoutStep === 'payment_pending' && isProcessing}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Box */}
        <div id={`${id}-scroll-content`} className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 && checkoutStep !== 'success' ? (
            <div id={`${id}-empty-state`} className="flex flex-col items-center justify-center h-80 space-y-4 text-center">
              <ShoppingBag size={48} className="text-slate-200 stroke-[1]" />
              <div className="space-y-1">
                <p className="font-display text-sm font-semibold text-slate-800">Таны сагс хоосон байна</p>
                <p className="font-sans text-xs text-slate-400">Швейцар уран хийцтэй цагны каталогоос сонгоно уу.</p>
              </div>
              <button
                id="cart-empty-browse-btn"
                onClick={onClose}
                className="rounded-none bg-slate-900 py-2.5 px-6 font-display text-xs font-bold tracking-wider text-white hover:bg-blue-900 transition"
              >
                ДЭЛГҮҮР ХЭСЭХ
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: CART CHECKOUT & FORM */}
              {checkoutStep === 'cart' && (
                <div id="cart-step-1" className="space-y-6">
                  {/* Cart Item Rows */}
                  <div id="cart-items-list" className="space-y-3">
                    <p className="font-display text-xs font-black tracking-widest text-blue-900 uppercase">ЗАХИАЛГЫН БАРАА</p>
                    {cart.map((item) => (
                      <div 
                        key={item.watch.id} 
                        id={`cart-row-${item.watch.id}`}
                        className="flex items-center gap-4 rounded-lg border border-slate-100 p-3"
                      >
                        <div className="h-16 w-16 bg-slate-50 flex items-center justify-center shrink-0 rounded overflow-hidden border border-slate-100 relative">
                          {isFacebookUrl(item.watch.image) ? (
                            <div className="absolute inset-0 bg-[#1877f2] flex items-center justify-center text-white" title="Facebook Post">
                              <Facebook size={24} className="fill-white text-white" />
                            </div>
                          ) : (
                            <img 
                              src={item.watch.image} 
                              alt={item.watch.name} 
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-sm font-bold text-slate-900 truncate">{item.watch.name}</p>
                          <p className="font-mono text-xs text-slate-400">{item.watch.price.toLocaleString()}₮</p>
                        </div>
                        <div className="flex items-center space-x-1.5 border border-slate-100 rounded bg-slate-50">
                          <button
                            id={`cart-qty-minus-${item.watch.id}`}
                            onClick={() => onUpdateQuantity(item.watch.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-200 text-slate-600 transition"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-mono text-xs font-semibold px-1 text-slate-850">{item.quantity}</span>
                          <button
                            id={`cart-qty-plus-${item.watch.id}`}
                            onClick={() => onUpdateQuantity(item.watch.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-200 text-slate-600 transition"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          id={`cart-row-del-${item.watch.id}`}
                          onClick={() => onRemoveItem(item.watch.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 transition"
                          aria-label="Засах"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Customer Information Form */}
                  <form id="checkout-form" onSubmit={handleGoToPayment} className="space-y-4 pt-4 border-t border-slate-100">
                    <p className="font-display text-xs font-black tracking-widest text-blue-900 uppercase">ХҮРГЭЛТИЙН МЭДЭЭЛЭЛ</p>
                    
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="font-display text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Овог Нэр *</label>
                      <input
                        id="form-input-name"
                        type="text"
                        placeholder="Бат-Эрдэнэ Төмөр"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className={`w-full border p-2.5 text-sm outline-none transition focus:border-slate-900 ${
                          errors.customerName ? 'border-red-400 focus:border-red-400' : 'border-slate-200'
                        }`}
                      />
                      {errors.customerName && (
                        <p id="err-name" className="text-red-500 text-[11px]">{errors.customerName}</p>
                      )}
                    </div>

                    {/* Phone - strict 8-digit Mon */}
                    <div className="space-y-1">
                      <label className="font-display text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Утасны Дугаар *</label>
                      <input
                        id="form-input-phone"
                        type="tel"
                        maxLength={8}
                        placeholder="99887766"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className={`w-full border p-2.5 font-mono text-sm outline-none transition focus:border-slate-900 ${
                          errors.phone ? 'border-red-400 focus:border-red-400' : 'border-slate-200'
                        }`}
                      />
                      {errors.phone && (
                        <p id="err-phone" className="text-red-500 text-[11px]">{errors.phone}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-1">
                      <label className="font-display text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Хүргэлтийн Нарийн Хаяг *</label>
                      <textarea
                        id="form-input-address"
                        rows={2}
                        placeholder="ХУД, 11-р хороо, Ривер хаус, 202-р байр, 14 тоот"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={`w-full border p-2.5 text-sm outline-none transition focus:border-slate-900 ${
                          errors.address ? 'border-red-400 focus:border-red-400' : 'border-slate-200'
                        }`}
                      />
                      {errors.address && (
                        <p id="err-address" className="text-red-500 text-[11px]">{errors.address}</p>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                      <label className="font-display text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Нэмэлт Тэмдэглэл (Сонголттой)</label>
                      <input
                        id="form-input-notes"
                        type="text"
                        placeholder="Үүдний кодоо дараад орно уу, залгаарай г.м"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 text-sm outline-none transition focus:border-slate-900"
                      />
                    </div>

                    {/* Integrated Payment Selection */}
                    <div className="space-y-2 pt-4">
                      <p className="font-display text-xs font-black tracking-widest text-blue-900 uppercase">ТӨЛБӨРИЙН СУВАГ СОНГОХ</p>
                      <div className="grid grid-cols-3 gap-2">
                        {/* qPay */}
                        <button
                          id="pay-method-qpay"
                          type="button"
                          onClick={() => setPaymentMethod('qpay')}
                          className={`flex flex-col items-center justify-center p-3 border rounded text-center transition cursor-pointer ${
                            paymentMethod === 'qpay' 
                              ? 'border-slate-900 bg-slate-950 text-white' 
                              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <Wallet size={18} className="mb-1" />
                          <span className="font-display text-[11px] font-bold uppercase tracking-wider">qPay</span>
                        </button>

                        {/* SocialPay */}
                        <button
                          id="pay-method-socialpay"
                          type="button"
                          onClick={() => setPaymentMethod('socialpay')}
                          className={`flex flex-col items-center justify-center p-3 border rounded text-center transition cursor-pointer ${
                            paymentMethod === 'socialpay' 
                              ? 'border-slate-900 bg-slate-950 text-white' 
                              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <Banknote size={18} className="mb-1" />
                          <span className="font-display text-[11px] font-bold uppercase tracking-wider">SocialPay</span>
                        </button>

                        {/* Credit Card */}
                        <button
                          id="pay-method-card"
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`flex flex-col items-center justify-center p-3 border rounded text-center transition cursor-pointer ${
                            paymentMethod === 'card' 
                              ? 'border-slate-900 bg-slate-950 text-white' 
                              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <CreditCard size={18} className="mb-1" />
                          <span className="font-display text-[10px] font-bold uppercase tracking-wider">Улсын Карт</span>
                        </button>
                      </div>
                    </div>

                    {/* Credit Card Specific Form Fields */}
                    {paymentMethod === 'card' && (
                      <div id="card-subform" className="space-y-3 p-4 bg-slate-50 rounded border border-slate-100">
                        <div className="space-y-1">
                          <label className="font-display text-[10px] font-bold text-slate-500 tracking-wider">КАРТЫН ДУГААР</label>
                          <input
                            id="card-number-input"
                            type="text"
                            maxLength={19}
                            placeholder="4000 1234 5678 9010"
                            value={cardNumber}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                              setCardNumber(v);
                            }}
                            className={`w-full border bg-white p-2 text-xs font-mono outline-none ${
                              errors.cardNumber ? 'border-red-400' : 'border-slate-200'
                            }`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="font-display text-[10px] font-bold text-slate-500 tracking-wider">ХУГАЦАА (СС/ЖЖ)</label>
                            <input
                              id="card-expiry-input"
                              type="text"
                              maxLength={5}
                              placeholder="12/28"
                              value={cardExpiry}
                              onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, '');
                                if (v.length > 2) {
                                  setCardExpiry(`${v.slice(0, 2)}/${v.slice(2, 4)}`);
                                } else {
                                  setCardExpiry(v);
                                }
                              }}
                              className={`w-full border bg-white p-2 text-xs font-mono outline-none ${
                                errors.cardExpiry ? 'border-red-400' : 'border-slate-200'
                              }`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-display text-[10px] font-bold text-slate-500 tracking-wider">CVV / CVC</label>
                            <input
                              id="card-cvv-input"
                              type="password"
                              maxLength={3}
                              placeholder="***"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                              className={`w-full border bg-white p-2 text-xs font-mono outline-none ${
                                errors.cardCvv ? 'border-red-400' : 'border-slate-200'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* STEP 2: PAYMENT METHOD INTERFACES */}
              {checkoutStep === 'payment_pending' && (
                <div id="cart-step-2" className="space-y-6 animate-fade-in">
                  {/* qPay flow mockup */}
                  {paymentMethod === 'qpay' && (
                    <div id="qpay-interface" className="space-y-5">
                      <p className="font-display text-xs font-black tracking-widest text-blue-900 uppercase">qPay QR КОР ОНШУУЛАХ</p>
                      
                      {/* Elegant responsive mockup QR code */}
                      <div className="flex justify-center flex-col items-center">
                        <div id="qpay-mock-qr" className="relative p-4 border border-slate-200 bg-white rounded-none shadow-sm">
                          {/* Inside mock watch graphic overlay inside QR */}
                          <svg className="w-48 h-48 text-slate-800" viewBox="0 0 100 100">
                            {/* Grid markers styled to look like real QR */}
                            <path d="M5,5 h30 v30 h-30 z M65,5 h30 v30 h-30 z M5,65 h30 v30 h-30 z" fill="currentColor" />
                            <path d="M12,12 h16 v16 h-16 z M72,12 h16 v16 h-16 z M12,72 h16 v16 h-16 z" fill="white" />
                            <circle cx="50" cy="50" r="14" fill="#1e3a8a" />
                            <path d="M50,40 v10 h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                            {/* Random QR matrix noises */}
                            <path d="M40,5 M45,15 M55,20 M60,10 M42,40 M48,45 M55,42 M58,55 M75,40 M80,48 M85,42 M90,52 M40,65 M48,72 M52,80 M58,68 M40,85 M85,80 M92,72" stroke="currentColor" strokeWidth="4" strokeLinecap="square" fill="none" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[0.5px] pointer-events-none" />
                        </div>
                        <span className="font-mono text-[11px] text-slate-405 mt-1.5 uppercase">Төлбөрийн Ухаалаг Дугуй</span>
                      </div>

                      {/* qPay Commercial Banks selection list */}
                      <div className="space-y-2">
                        <p className="text-left font-display text-[10px] font-bold text-slate-500 tracking-wider">БАНКНЫ АППЛИКЕЙШН СУВАГ СУУЛГАХ (Жишээ):</p>
                        <div id="qpay-banks-grid" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {mongolianBanks.map((b) => (
                            <button
                              key={b.id}
                              id={`qpay-bank-${b.id}`}
                              onClick={() => setSelectedBank(b.id)}
                              className={`flex items-center space-x-2 p-2 border tracking-tight text-left text-xs transition cursor-pointer ${
                                selectedBank === b.id 
                                  ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' 
                                  : 'border-slate-100 hover:border-slate-200'
                              }`}
                            >
                              <div className={`h-6 w-6 shrink-0 flex items-center justify-center font-mono text-[8px] font-bold uppercase rounded ${b.color}`}>
                                {b.logo}
                              </div>
                              <span className="font-sans font-medium text-slate-700 truncate">{b.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SocialPay flow mockup */}
                  {paymentMethod === 'socialpay' && (
                    <div id="socialpay-interface" className="space-y-6">
                      <p className="font-display text-xs font-black tracking-widest text-blue-900 uppercase">SocialPay-ЭЭР ТӨЛӨХ</p>
                      
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-[#0B1528] rounded-none text-white w-48 h-48 flex flex-col items-center justify-center space-y-3 relative shadow-inner">
                          <div className="w-14 h-14 rounded-full border-2 border-blue-500 flex items-center justify-center font-bold text-xs text-blue-400 animate-pulse">
                            SP
                          </div>
                          <span className="font-mono text-xs tracking-wider text-slate-350">GOLOMT BANK</span>
                          <span className="font-display text-[11px] font-bold tracking-widest text-blue-400">SOCIALPAY APP</span>
                        </div>

                        <a 
                          id="socialpay-deeplink-mock"
                          href="#socialpay-deeplink"
                          onClick={(e) => e.preventDefault()}
                          className="inline-flex items-center space-x-2 text-xs font-medium text-blue-600 hover:underline"
                        >
                          <Wallet size={14} />
                          <span>Гар утаснаас шууд SocialPay апп руу шилжих</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Int card payment review */}
                  {paymentMethod === 'card' && (
                    <div id="card-payment-interface" className="space-y-3 py-6 text-center">
                      <div className="mx-auto h-12 w-12 rounded-full bg-slate-50 border flex items-center justify-center text-slate-600 mb-2">
                        <CreditCard size={20} />
                      </div>
                      <p className="font-display text-xs font-semibold uppercase tracking-wider text-slate-500">Олон Улсын Карт Боловсруулалт</p>
                      <p className="font-mono text-[11px] text-slate-500">
                        Карт: **** **** **** {cardNumber.slice(-4) || 'XXXX'}
                      </p>
                      <p className="font-sans text-[11px] text-slate-400">
                        Таны мэдээлэл PCI-DSS стандартын дагуу 256-бит шифрлэгдэн аюулгүй дамжиж байна.
                      </p>
                    </div>
                  )}

                  {/* Core Action triggering simulation */}
                  <div className="space-y-2 pt-4">
                    <button
                      id="cart-btn-simulate-pay"
                      onClick={handleCompletePayment}
                      disabled={isProcessing}
                      className="w-full bg-slate-900 border border-slate-900 hover:bg-blue-900 hover:border-blue-950 text-white py-3.5 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 rounded-none"
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>ТӨЛБӨРИЙГ ШАЛГАЖ БАЙНА...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={16} />
                          <span>ТӨЛБӨР ТӨЛӨХ / ШАЛГАХ</span>
                        </>
                      )}
                    </button>

                    <button
                      id="cart-btn-go-back"
                      onClick={() => setCheckoutStep('cart')}
                      disabled={isProcessing}
                      className="w-full text-slate-500 hover:text-slate-900 font-display text-[10px] font-bold tracking-widest uppercase py-2 transition"
                    >
                      БУЦАХ
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: TRANSACTION SUCCESS & CONFIRMATION */}
              {checkoutStep === 'success' && createdOrder && (
                <div id="cart-step-3" className="space-y-6 text-center py-6">
                  <div className="flex justify-center">
                    <CheckCircle2 size={56} className="text-emerald-500 animate-bounce" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-bold text-slate-900">ЗАХИАЛГА АМЖИЛТТАЙ БҮРТГЭГДЛЭЭ!</h3>
                    <p className="font-sans text-xs text-slate-500">
                      Эрхэм <strong>{createdOrder.customerName}</strong> таны төлбөр амжилттай хийгдэж, систем захиалгыг автоматаар нэгдсэн санд бүртгэлээ.
                    </p>
                  </div>

                  {/* Order Code Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-none p-5 space-y-2.5">
                    <span className="font-display text-[10px] font-bold tracking-widest text-blue-900 uppercase">ЗАХИАЛГЫН УХААЛАГ ДУГААР</span>
                    <div className="flex items-center justify-center space-x-2">
                      <span id="created-order-id-code" className="font-mono text-2xl font-bold tracking-wider text-slate-950">
                        {createdOrder.id}
                      </span>
                      <button
                        id="btn-copy-order-id"
                        onClick={() => copyToClipboard(createdOrder.id)}
                        className="p-1 text-slate-400 hover:text-slate-900 rounded-none bg-white border border-slate-100 hover:shadow-xs transition"
                        title="Хуулах"
                      >
                        <Copy size={14} className={copied ? 'text-emerald-500' : ''} />
                      </button>
                    </div>
                    {copied && <span className="font-sans text-[10px] text-emerald-600 block">Санах ойд амжилттай хуулагдлаа!</span>}
                  </div>

                  {/* Help message */}
                  <p className="font-sans text-[11.5px] text-slate-500 leading-relaxed bg-slate-50/50 p-3 rounded-none text-left border-l-2 border-blue-900">
                    Энэхүү кодыг ашиглан манай <strong>Захиалга Хянах</strong> хэсгээр нэвтэрч төлбөрийн баталгаажилт уян явц, бэлтгэл, болон хүргэгчийн замын хугацааг 5 шатлалтай системээр шууд хянах боломжтой.
                  </p>

                  <div className="pt-4 space-y-2">
                    <button
                      id="cart-success-btn-track"
                      onClick={() => {
                        // Switch parent state views
                        onClose();
                        // This hook allows navigation to live tracker of this order
                        (window as any).__setActiveTrackerOrder?.(createdOrder.id);
                      }}
                      className="w-full bg-slate-900 text-white font-display text-xs font-black tracking-widest uppercase py-3 hover:bg-blue-900 transition duration-300 rounded-none"
                    >
                      ЗАХИАЛГА ХЯНАХ ХУУДАС РУУ ШИЛЖИХ
                    </button>
                    <button
                      id="cart-success-btn-shop"
                      onClick={() => {
                        onClose();
                      }}
                      className="w-full text-slate-500 hover:text-slate-900 font-display text-[10px] font-bold tracking-widest uppercase py-2 transition"
                    >
                      ДЭЛГҮҮРҮҮД РҮҮ БУЦАХ
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Summary - Step 1 Only */}
        {checkoutStep === 'cart' && cart.length > 0 && (
          <div id={`${id}-footer`} className="border-t border-slate-200 p-5 bg-slate-50/40">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-xs font-semibold text-slate-500">Нийт дүн:</span>
              <span id="cart-summary-total-val" className="font-mono text-base font-bold text-slate-900">
                {subtotal.toLocaleString()}₮
              </span>
            </div>
            
            <button
              id="cart-btn-submit-order"
              onClick={handleGoToPayment}
              className="w-full bg-slate-900 text-white hover:bg-blue-900 transition-colors py-3.5 hover:shadow-xs font-display text-xs font-black tracking-widest uppercase rounded-none"
            >
              ТӨЛБӨР ТӨЛӨХ ХЭСЭГ РҮҮ ШИЛЖИХ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
