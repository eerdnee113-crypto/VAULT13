/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Watch } from '../types';
import { Plus, Edit, Trash2, X, RefreshCw, Upload, Sparkles, AlertCircle, Save, Facebook } from 'lucide-react';
import { isFacebookUrl, getFacebookEmbedUrl } from '../utils/facebook';

interface WatchListingsManagerProps {
  id?: string;
  watches: Watch[];
  onAddWatch: (newWatch: Watch) => void;
  onUpdateWatch: (updatedWatch: Watch) => void;
  onDeleteWatch: (watchId: string) => void;
  onDeleteAllWatches: () => void;
}

const STOCK_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&auto=format&fit=crop&q=80', label: 'Classic Gold' },
  { url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&auto=format&fit=crop&q=80', label: 'Diver Master' },
  { url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80', label: 'Minimal Brown' },
  { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80', label: 'Stealth Black' },
  { url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&auto=format&fit=crop&q=80', label: 'Rose Gold' },
  { url: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&auto=format&fit=crop&q=80', label: 'Skeleton Elite' }
];

export default function WatchListingsManager({
  id = 'watch-listings-manager',
  watches,
  onAddWatch,
  onUpdateWatch,
  onDeleteWatch,
  onDeleteAllWatches
}: WatchListingsManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWatch, setEditingWatch] = useState<Watch | null>(null);
  
  // Form States
  const [name, setName] = useState('');
  const [subName, setSubName] = useState('');
  const [price, setPrice] = useState<number>(3000000);
  const [category, setCategory] = useState<'Classic' | 'Sport' | 'Luxury'>('Classic');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(STOCK_IMAGES[0].url);
  const [customImage, setCustomImage] = useState('');
  const [useCustomImage, setUseCustomImage] = useState(false);

  // Specifications state
  const [movement, setMovement] = useState('Швейцарь Автомат Хөдөлгүүртэй');
  const [caseSpec, setCaseSpec] = useState('316L Зэвэрдэггүй ган (40mm)');
  const [glass, setGlass] = useState('Олон давхаргат Индранил кристал (Sapphire Glass)');
  const [waterProof, setWaterProof] = useState('50м (5 ATM)');
  const [strap, setStrap] = useState('Итали жинхэнэ савхин оосор');

  const [formError, setFormError] = useState('');

  const openCreateForm = () => {
    setEditingWatch(null);
    setName('');
    setSubName('');
    setPrice(3500000);
    setCategory('Classic');
    setDescription('Швейцарийн сонгодог загвар, индранил кристал нүүртэй тансаг зэрэглэлийн цаг хугацааны бүтээл.');
    setImage(STOCK_IMAGES[0].url);
    setUseCustomImage(false);
    setCustomImage('');
    
    // Default Specs templates
    setMovement('Sellita SW200-1 (Швейцарь Автомат)');
    setCaseSpec('316L Зэвэрдэггүй ган (41mm)');
    setGlass('Тэсвэртэй хамгаалалттай Индранил кристал');
    setWaterProof('50м (5 ATM)');
    setStrap('Хар суран оосор (Итали арьс)');
    
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditForm = (watch: Watch) => {
    setEditingWatch(watch);
    setName(watch.name);
    setSubName(watch.subName);
    setPrice(watch.price);
    setCategory(watch.category);
    setDescription(watch.description);
    
    // Check if image is one of the stocks
    const isStock = STOCK_IMAGES.some(si => si.url === watch.image);
    if (isStock) {
      setImage(watch.image);
      setUseCustomImage(false);
      setCustomImage('');
    } else {
      setImage('');
      setUseCustomImage(true);
      setCustomImage(watch.image);
    }

    setMovement(watch.specs.movement);
    setCaseSpec(watch.specs.case);
    setGlass(watch.specs.glass);
    setWaterProof(watch.specs.waterProof);
    setStrap(watch.specs.strap);

    setFormError('');
    setIsFormOpen(true);
  };

  const handleApplyTemplate = (type: 'Classic' | 'Sport' | 'Luxury') => {
    setCategory(type);
    if (type === 'Classic') {
      setDescription('Швейцарийн сонгодог загвар, индранил кристал нүүртэй тансаг зэрэглэлийн цаг хугацааны бүтээл.');
      setMovement('Sellita SW205 Автомат Хөдөлгүүртэй');
      setCaseSpec('316L Зэвэрдэггүй алтадсан ган (40mm)');
      setGlass('Хоёр талт гэрэл ойлгогчтой Индранил кристал');
      setWaterProof('50м (5 ATM)');
      setStrap('Италийн Шоколадан бор савхин оосор');
      if (!useCustomImage) setImage(STOCK_IMAGES[0].url);
    } else if (type === 'Sport') {
      setDescription('Усны маш өндөр хамгаалалттай, эргэдэг хүрээтэй, спортод тусгайлан зориулагдсан бат бөх дизайн бүхий дээд зэрэглэлийн цаг.');
      setMovement('Calibre 5 Өндөр нарийвчлалт механизм');
      setCaseSpec('Агаарын тээврийн зэрэглэлийн Титан их бие (43mm)');
      setGlass('Нэмэлт зузаантай хамгаалалтын Индранил кристал');
      setWaterProof('200м (20 ATM Professional)');
      setStrap('Уян каучук чийг засагчтай оосор');
      if (!useCustomImage) setImage(STOCK_IMAGES[1].url);
    } else if (type === 'Luxury') {
      setDescription('Хэт чамин хээ угалзаас татгалзаж, намуун хэрнээ үнэ цэнэтэй байдлыг илэрхийлсэн Скелетон шийдэлтэй хамгийн дээд зэрэглэлийн цаг.');
      setMovement('Тусгай скелетон араат механизм (Швейцарь)');
      setCaseSpec('18K Сарны алтан бүрээстэй 316L ган (39mm)');
      setGlass('Маргад усан хамгаалалттай цэвэр Индранил шил');
      setWaterProof('30м (3 ATM Everyday)');
      setStrap('Жинхэнэ Матрын арьсан хар оосор');
      if (!useCustomImage) setImage(STOCK_IMAGES[4].url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Цагны нэрийг заавал оруулна уу.');
      return;
    }
    if (!subName.trim()) {
      setFormError('Дэд нэр буюу цуглуулгын нэрийг оруулна уу.');
      return;
    }
    if (price <= 0) {
      setFormError('Үнийн дүн 0-ээс их байх ёстой.');
      return;
    }
    if (!description.trim()) {
      setFormError('Цагны дэлгэрэнгүй тайлбарыг оруулна уу.');
      return;
    }

    const finalImage = useCustomImage ? (customImage.trim() || STOCK_IMAGES[0].url) : image;

    const watchData: Watch = {
      id: editingWatch ? editingWatch.id : `W-0${watches.length + 10}`, // Generates dynamic W-0x ID
      name: name.trim(),
      subName: subName.trim(),
      price: Number(price),
      category,
      description: description.trim(),
      image: finalImage,
      specs: {
        movement: movement.trim(),
        case: caseSpec.trim(),
        glass: glass.trim(),
        waterProof: waterProof.trim(),
        strap: strap.trim()
      }
    };

    if (editingWatch) {
      onUpdateWatch(watchData);
    } else {
      // Ensure unique ID
      let finalId = `W-${Math.floor(Date.now() / 1000 % 100000)}`;
      onAddWatch({ ...watchData, id: finalId });
    }

    setIsFormOpen(false);
    setEditingWatch(null);
  };

  return (
    <div id={id} className="space-y-6">
      
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 border-2 border-slate-900 p-5 rounded-none">
        <div className="space-y-1">
          <h3 className="font-display text-sm font-black tracking-widest text-[#1e3a8a] uppercase">ЦАГНЫ ЗАР, БҮТЭЭГДЭХҮҮНИЙ МЕНЕЖЕР</h3>
          <p className="font-sans text-[11px] text-slate-500 font-medium">
            Шинээр зарын урилга үүсгэх, цуглуулга дахь цануудын мэдээлэл, үнэ болон зургийг засах удирдамж.
          </p>
        </div>
        <button
          id="btn-open-create-watch-form"
          onClick={openCreateForm}
          className="flex items-center justify-center space-x-2 bg-slate-950 text-white hover:bg-blue-900 border-2 border-slate-950 hover:border-blue-900 py-3 px-5 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer self-start sm:self-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]"
        >
          <Plus size={14} />
          <span>ШИНЭ ЗАР ҮҮСГЭХ</span>
        </button>
      </div>

      {/* Editor/Creation Form - Collapsed inline card */}
      {isFormOpen && (
        <form 
          id="watch-listing-form" 
          onSubmit={handleSubmit}
          className="bg-white border-2 border-slate-900 p-6 space-y-6 rounded-none relative animate-fade-in shadow-[4px_4px_0px_0px_rgba(30,58,138,0.1)]"
        >
          <button
            type="button"
            onClick={() => {
              setIsFormOpen(false);
              setEditingWatch(null);
            }}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition font-black text-lg"
          >
            <X size={20} />
          </button>

          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Sparkles size={16} className="text-blue-900 animate-pulse" />
            <h4 className="font-display text-xs font-black tracking-wider text-slate-900 uppercase">
              {editingWatch ? `ЗАРЫН МЭДЭЭЛЭЛ ЗАСАХ: ${editingWatch.id}` : 'ШИНЭ ОНЦЛОХ ЗАР ЦАГ НЭМЭХ'}
            </h4>
          </div>

          {formError && (
            <div className="flex items-center space-x-2 bg-red-50 text-red-700 p-3.5 border border-red-200 text-xs font-sans">
              <AlertCircle size={14} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Form grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Basic Details */}
            <div className="space-y-4">
              <span className="font-display text-[10px] font-black tracking-widest text-[#1e3a8a] block uppercase border-b border-slate-100 pb-1">НЭГДҮГЭЭР ШАТ: ЦАГНЫ ҮНДСЭН МЭДЭЭЛЭЛ</span>
              
              {/* Name & SubName in line */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-display text-[10px] font-bold text-slate-500 uppercase tracking-wider">Цагны Нэр (Model) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Жишээ: Vault13 Centurion"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-slate-900 p-2.5 font-sans text-xs outline-none bg-slate-50/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-display text-[10px] font-bold text-slate-500 uppercase tracking-wider">Цуглуулга, Дэд нэр *</label>
                  <input
                    type="text"
                    required
                    placeholder="Жишээ: Limited Heritage Automatic"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="w-full border-2 border-slate-200 focus:border-slate-900 p-2.5 font-sans text-xs outline-none bg-slate-50/40"
                  />
                </div>
              </div>

              {/* Price & Category with quick templates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-display text-[10px] font-bold text-slate-500 uppercase tracking-wider">Үнэ (Төгрөг) *</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      required
                      min={100}
                      placeholder="3800000"
                      value={price || ''}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full border-2 border-slate-200 focus:border-slate-900 p-2.5 pr-8 font-mono text-xs font-bold outline-none bg-slate-50/40 text-[#1e3a8a]"
                    />
                    <span className="absolute right-3 font-mono text-xs text-slate-400">₮</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-display text-[10px] font-bold text-slate-500 uppercase tracking-wider">Категори (Ангилал) *</label>
                  <div className="flex gap-1.5">
                    {(['Classic', 'Sport', 'Luxury'] as const).map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleApplyTemplate(cat)}
                        className={`flex-1 py-2 font-display text-[10px] font-bold border-2 transition rounded-none ${
                          category === cat
                            ? 'bg-blue-900 border-blue-900 text-white font-black'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-display text-[10px] font-bold text-slate-500 uppercase tracking-wider">Зарын Дэлгэрэнгүй Тайлбар *</label>
                  <span className="text-[9px] text-blue-900 font-mono">Шүүлтээр тохирно</span>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="Бүтээгдэхүүний сошиалаар танилцуулах гол давуу тал, загварын үзүүлэлтийг хэрэглэгчид багтаан бичнэ үү..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-2 border-slate-200 focus:border-slate-900 p-2.5 font-sans text-xs outline-none bg-slate-50/40 resize-none"
                />
              </div>

              {/* Specifications Subform (Collapsible or just clean) */}
              <div className="space-y-3.5 pt-3 border-t border-slate-100">
                <span className="font-display text-[10px] font-black tracking-widest text-slate-600 block uppercase">ХОЁРДУГААР ШАТ: ТЕХНИК ҮЗҮҮЛЭЛТҮҮД (SPECS)</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-display text-[9px] font-bold text-slate-500 uppercase">Цагны хөдөлгүүр (Movement)</label>
                    <input
                      type="text"
                      value={movement}
                      onChange={(e) => setMovement(e.target.value)}
                      className="w-full border border-slate-200 focus:border-slate-900 p-2 font-sans text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-display text-[9px] font-bold text-slate-500 uppercase">Их бие (Case Frame)</label>
                    <input
                      type="text"
                      value={caseSpec}
                      onChange={(e) => setCaseSpec(e.target.value)}
                      className="w-full border border-slate-200 focus:border-slate-900 p-2 font-sans text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-display text-[9px] font-bold text-slate-500 uppercase">Нүүрний Шил (Crystal Glass)</label>
                    <input
                      type="text"
                      value={glass}
                      onChange={(e) => setGlass(e.target.value)}
                      className="w-full border border-slate-200 focus:border-slate-900 p-2 font-sans text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-display text-[9px] font-bold text-slate-500 uppercase">Усны хамгаалалт (Water resistance)</label>
                    <input
                      type="text"
                      value={waterProof}
                      onChange={(e) => setWaterProof(e.target.value)}
                      className="w-full border border-slate-200 focus:border-slate-900 p-2 font-sans text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-display text-[9px] font-bold text-slate-500 uppercase">Оосор ба тэдгээрийн хэмжээ (Strap)</label>
                  <input
                    type="text"
                    value={strap}
                    onChange={(e) => setStrap(e.target.value)}
                    className="w-full border border-slate-200 focus:border-slate-900 p-2 font-sans text-xs outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Image Selection & Preview */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="font-display text-[10px] font-black tracking-widest text-[#1e3a8a] block uppercase border-b border-slate-100 pb-1">ГУРВАВДУГААР ШАТ: ХАРАГДАХ ЗУРАГ</span>
                
                {/* Visual Image Choice presets */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-display font-bold text-slate-500 uppercase">Системийн бэлэн өндөр чанартай зургууд:</span>
                    <button
                      type="button"
                      onClick={() => setUseCustomImage(!useCustomImage)}
                      className="text-blue-900 font-mono underline font-bold"
                    >
                      {useCustomImage ? 'Бэлэн зураг ашиглах' : 'Өөрийн линк оруулах'}
                    </button>
                  </div>

                  {!useCustomImage ? (
                    <div className="grid grid-cols-3 gap-2">
                      {STOCK_IMAGES.map((si, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImage(si.url)}
                          className={`relative border-2 rounded-none aspect-square overflow-hidden hover:scale-102 transition group ${
                            image === si.url ? 'border-blue-900 ring-2 ring-blue-105' : 'border-slate-200'
                          }`}
                        >
                          <img
                            src={si.url}
                            alt={si.label}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover group-hover:opacity-90"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-slate-950/70 py-0.5 px-1 text-[8px] font-display text-white font-medium truncate">
                            {si.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 border-2 border-slate-200 p-2 bg-slate-50">
                        <Upload size={14} className="text-slate-400" />
                        <input
                          type="url"
                          placeholder="Өөрийн цагны зургийн линк, эсвэл Facebook постын холбоос..."
                          value={customImage}
                          onChange={(e) => setCustomImage(e.target.value)}
                          className="bg-transparent text-xs font-mono outline-none w-full"
                        />
                      </div>
                      <span className="font-sans text-[10px] text-slate-400 block leading-tight">
                        * Зургаас гадна <strong>Facebook постын линк</strong> (жишээ нь: https://www.facebook.com/... эсвэл fb.watch/...) оруулж постыг шууд зарын гол хэсэгт байршуулах боломжтой.
                      </span>
                    </div>
                  )}
                </div>

                {/* Final Render Mockup View Card */}
                <div className="space-y-1.5 pt-3">
                  <label className="font-display text-[10px] font-bold text-slate-500 uppercase tracking-wider block">БОДИТ ЗАГВАРЧИЛАЛ ХАРАГДАЦ (LIVE PREVIEW)</label>
                  <div className="border border-slate-200 p-3 bg-slate-50 flex items-center justify-center min-h-[220px] aspect-video relative overflow-hidden">
                    {useCustomImage && !customImage.trim() ? (
                      <span className="font-sans text-xs text-slate-400 text-center">
                        Зургийн эсвэл Facebook постын URL хаягаа зураг талбарт оруулна уу
                      </span>
                    ) : (
                      <>
                        {useCustomImage && isFacebookUrl(customImage) ? (
                          <div className="absolute inset-x-0 top-0 bottom-12 w-full flex bg-white border-b border-slate-200 overflow-hidden">
                            <iframe
                              src={getFacebookEmbedUrl(customImage)}
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
                            src={useCustomImage ? customImage : image}
                            alt="Watch Preview"
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 h-full w-full object-cover opacity-80"
                          />
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-slate-950 py-2 px-3 text-white flex items-center justify-between z-10">
                          <div className="flex flex-col text-left">
                            <span className="font-mono text-[8px] tracking-widest text-[#93c5fd] font-bold uppercase">{category} SERIES</span>
                            <span className="font-display text-xs font-bold tracking-tight uppercase truncate max-w-[120px] sm:max-w-[160px]">{name || 'Цагны модель'}</span>
                          </div>
                          <span className="font-mono text-[11px] font-black text-emerald-400">
                            {(price || 0).toLocaleString()}₮
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons Row */}
              <div className="flex items-center space-x-3 pt-6 sm:pt-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingWatch(null);
                  }}
                  className="flex-1 border-2 border-slate-900 bg-white hover:bg-slate-50 py-3.5 px-4 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer text-center"
                >
                  ЦУЦЛАХ
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-900 hover:bg-slate-900 border-2 border-blue-900 hover:border-slate-900 text-white py-3.5 px-4 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
                >
                  <Save size={14} />
                  <span>{editingWatch ? 'ШИНЭЧЛЭХ' : 'ХАДГАЛАХ'}</span>
                </button>
              </div>

            </div>

          </div>

        </form>
      )}

      {/* Watch advertisement database list */}
      <div className="border-2 border-slate-900 bg-white overflow-hidden rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
        
        {/* Sub-header */}
        <div className="p-4 border-b-2 border-slate-900 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <span className="font-display text-xs font-black tracking-widest text-slate-800 uppercase">СИСТЕМД БҮРТГЭЛТЭЙ СҮНСЛЭГ ТӨЛӨӨЛӨГЧИД ({watches.length})</span>
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {watches.length > 0 && (
              <button
                id="btn-delete-all-watches"
                type="button"
                onClick={onDeleteAllWatches}
                className="flex items-center space-x-1.5 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 hover:border-red-600 text-[10px] font-display font-bold px-2.5 py-1.5 transition duration-200 cursor-pointer rounded-none"
              >
                <Trash2 size={11} className="shrink-0" />
                <span>БҮХ ЗАРЫГ УСТГАХ</span>
              </button>
            )}
            <span className="font-mono text-[10px] text-blue-900 font-bold bg-blue-50 px-2 py-1.5 border border-blue-200">LOCAL COLLECTION</span>
          </div>
        </div>

        {/* Dynamic products list grid */}
        <div id="watches-admin-grid" className="divide-y divide-slate-100">
          {watches.length > 0 ? (
            watches.map((w) => (
              <div 
                key={w.id} 
                id={`admin-watch-row-${w.id}`}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition duration-150"
              >
                
                {/* Watch photo and name brief details */}
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 shrink-0 bg-slate-100 overflow-hidden border-2 border-slate-900 relative flex items-center justify-center">
                    {isFacebookUrl(w.image) ? (
                      <div className="absolute inset-0 bg-[#1877f2] flex items-center justify-center text-white" title="Facebook Post Link">
                        <Facebook size={24} className="fill-white text-white" />
                      </div>
                    ) : (
                      <img
                        src={w.image}
                        alt={w.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-950 text-xs tracking-wider">{w.id}</span>
                      <span className="font-display text-[9px] font-black tracking-widest text-blue-900 bg-blue-50 px-1.5 py-0.5 border border-blue-200 uppercase">
                        {w.category}
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-semibold text-slate-850 uppercase tracking-tight">{w.name}</h4>
                    <span className="font-sans text-[11px] text-slate-450 block truncate max-w-xs">{w.subName}</span>
                  </div>
                </div>

                {/* Specs snapshot display */}
                <div className="hidden md:block space-y-0.5 text-[10px] text-slate-450 font-sans max-w-xs unicode-bidi">
                  <div><strong>Хөдөлгүүр:</strong> {w.specs.movement}</div>
                  <div className="truncate"><strong>Их бие:</strong> {w.specs.case}</div>
                </div>

                {/* Price tag & controls */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <div className="text-left sm:text-right">
                    <span className="font-sans text-[9px] text-slate-400 block font-semibold uppercase">ОНЦЛОХ ЗАРЫН ҮНЭ</span>
                    <span className="font-mono text-sm font-extrabold text-[#1e3a8a]">
                      {w.price.toLocaleString()}₮
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      id={`btn-edit-watch-${w.id}`}
                      onClick={() => openEditForm(w)}
                      className="group border border-slate-200 hover:border-blue-900 p-2 bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-900 transition flex items-center justify-center shadow-xs cursor-pointer"
                      title="Шинэчлэх / Засах"
                    >
                      <Edit size={12} className="group-hover:scale-110 transition" />
                    </button>
                    
                    <button
                      id={`btn-delete-watch-${w.id}`}
                      onClick={() => onDeleteWatch(w.id)}
                      className="group border border-red-100 hover:border-red-400 p-2 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 transition flex items-center justify-center shadow-xs cursor-pointer"
                      title="Устгах"
                    >
                      <Trash2 size={12} className="group-hover:scale-110 transition" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 font-sans text-xs">
              Зарын мэдээлэл одоогоор байхгүй байна. Шинэ зар үүсгэнэ үү.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
