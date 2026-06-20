/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Watch, Order, ChatMessage } from '../types';
import { MessageCircle, X, Send, Clock, User, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';

interface ChatbotProps {
  id?: string;
  watches: Watch[];
  orders: Order[];
  onTrackOrder: (id: string) => void;
  setView: (view: 'shop' | 'tracker' | 'admin') => void;
}

export default function Chatbot({
  id = 'vault13-luxury-chatbot',
  watches,
  orders,
  onTrackOrder,
  setView
}: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        id: 'init-msg',
        sender: 'bot',
        text: 'Сайн байна уу! Танд энэ өдрийн мэнд хүргэе. Би VAULT13 Тансаг Цагны дэлгүүрийн хиймэл оюунт зөвлөх байна. Танд Швейцар уран хийцтэй цагны сонголт хийх, захиалга хянах болон төлбөрийн асуудалд туслахад бэлэн байна.',
        timestamp: new Date(),
        choices: [
          { label: '👑 Хамгийн өндөр зэрэглэлийн цаг', action: 'luxury_recs' },
          { label: '📦 Миний захиалгыг хянах', action: 'track_help' },
          { label: '💳 Төлбөрийн нөхцөлүүд', action: 'payments' },
          { label: '💬 Facebook-ээр шууд холбогдох', action: 'fb_contact' }
        ]
      }
    ]);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleChoiceClick = (action: string, label: string) => {
    // Add user's click choice as message
    const userMsgId = `choice-user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: label,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let botResponseText = '';
      let nextChoices: { label: string; action: string }[] | undefined = undefined;

      switch (action) {
        case 'luxury_recs':
          const goldSovereign = watches.find(w => w.id === 'W-03');
          const titaniumVanguard = watches.find(w => w.id === 'W-06');
          botResponseText = `Манай хамгийн тансаг, онцгой загвар бол:\n\n1. ⚜️ "${goldSovereign?.name}" (${goldSovereign?.price.toLocaleString()}₮) - 18 каратын шар алтан бүрээстэй, ультра нимгэн механик механизмтай.\n2. 🧬 "${titaniumVanguard?.name}" (${titaniumVanguard?.price.toLocaleString()}₮) - Агаарын хөлгийн зэрэглэлийн титан бүрхүүлтэй скелетон засал бүхий инженерийн гайхамшиг.\n\nТа эдгээр цагны уул уурхай болон техникийн дэлгэрэнгүйг дэлгүүрийн каталог руу ороод "Үзүүлэлт" товчийг дарж харах боломжтой. Мөн танд 10% хөнгөлөлтийн урамшууллыг бэлэглэе! Код: VAULT10`;
          nextChoices = [
            { label: '🎟️ Хөнгөлөлтийн код ашиглах', action: 'coupon_info' },
            { label: '⌚ Бусад цагнуудыг үзэх', action: 'view_all_watches' }
          ];
          break;

        case 'track_help':
          botResponseText = `Захиалгаа бодит хугацаанд хянахын тулд танд олгосон "ORD-XXXX" ухаалаг кодыг доорх мессеж бичих хэсэгт яг хэвээр нь бичээд илгээнэ үү. Систем шууд орлого хүлээн авсан, бэлтгэгдэж буй, эсвэл хүргэгч замын аль хэсэгт явааг бодит өгөгдөл дээр тулгуурлан танд харуулах болно!`;
          nextChoices = [
            { label: '🔍 Захиалгын хянах хуудас руу очих', action: 'go_tracker_page' }
          ];
          break;

        case 'payments':
          botResponseText = `Манай онлайн систем нь Монголын хамгийн түгээмэл 3 төлбөрийн нэгдсэн сувгийг дэмждэг:\n\n1. 📱 qPay (Хаан Банк, Голомт, Төрийн Банк зэрэг 12+ банкны аппликейшнаар шууд QR уншуулах)\n2. 💸 SocialPay (Голомт банкны ухаалаг системээр шууд дээрээс нь шилжих)\n3. 💳 Олон Улсын Карт (Visa, MasterCard-аар шуудангийн хаяг болон картын дугаар оруулан аюулгүй төлөх).\n\nЗахиалга орж төлбөр баталгаажмагц систем автоматаар танд ухаалаг код олгодог.`;
          break;

        case 'fb_contact':
          botResponseText = `Та илүү нарийн мэдээлэл авахыг хүсвэл манай Facebook хуудсаар дамжуулан борлуулалтын зөвлөхтэй шууд чатлах боломжтой. Доорх товчийг даран Facebook хаягаар нэвтрэнэ үү.`;
          nextChoices = [
            { label: '🔗 FB Хуудас руу шууд нэвтрэх', action: 'open_fb_url' }
          ];
          break;

        case 'coupon_info':
          botResponseText = `Урамшууллын код: "VAULT10" танд 10%-ийн онцлох хөнгөлөлт олгоно! Та сагсанд цагаа нэмээд төлбөр төлөх шатанд тэмдэглэл (Notes) хэсэгт уг кодоо бичихэд хүргэлтийн менежер шууд хөнгөлөлтийг засаж тооцох болно.`;
          break;

        case 'view_all_watches':
          botResponseText = `Маш сайн, би таныг манай цагны үндсэн каталог руу шилжүүлье. Та уран хийцийг нь таашаан сонирхоорой.`;
          setView('shop');
          break;

        case 'go_tracker_page':
          botResponseText = `Ойлголоо, би таныг шууд захиалга хянах хуудас уруу чиглүүллээ.`;
          setView('tracker');
          break;

        case 'open_fb_url':
          botResponseText = `Манай албан ёсны Facebook хаягаар нэвтэрч байна. Танд туслахдаа бид баяртай байх болно.`;
          window.open('https://www.facebook.com/profile.php?id=61587082883795', '_blank');
          break;

        default:
          botResponseText = `Уучлаарай, би энэ үйлдлийг ойлгосонгүй. Танд өөр юугаар туслах вэ?`;
      }

      const botMsgId = `choice-bot-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: botMsgId,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date(),
        choices: nextChoices
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const query = inputVal.trim();
    setInputVal('');

    const userMsgId = `text-user-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date()
    }]);

    setIsTyping(true);

    setTimeout(() => {
      let responseText = '';
      let replyChoices: { label: string; action: string }[] | undefined = undefined;

      const lowerQuery = query.toLowerCase();

      // Check if user is trying to track an order (detects ORD-XXXX)
      const orderMatch = query.toUpperCase().match(/ORD-\d{4}/);
      if (orderMatch) {
        const orderId = orderMatch[0];
        const foundOrder = orders.find(o => o.id.toUpperCase() === orderId);

        if (foundOrder) {
          let stateLabel = '';
          switch (foundOrder.status) {
            case 'pending': stateLabel = 'Төлбөр хүлээгдэж буй ⏳'; break;
            case 'confirmed': stateLabel = 'Баталгаажсан (Төлбөр төлөгдсөн) ✅'; break;
            case 'preparing': stateLabel = 'Бэлтгэгдэж буй (Агуулахад) 📦'; break;
            case 'on_the_way': stateLabel = 'Хүргэгч замад гарсан 🛵'; break;
            case 'delivered': stateLabel = 'Амжилттай хүргэгдсэн 🎉'; break;
          }

          responseText = `🎯 Олдлоо! ${orderId} захиалгын статус одоогоор: "${stateLabel}" байна.\n\nХүлээн авагч: ${foundOrder.customerName}\nХаяг: ${foundOrder.address}\nТөлбөрийн суваг: ${foundOrder.paymentMethod.toUpperCase()}\nТүүхэн сүүлийн тэмдэглэл: "${foundOrder.logs[foundOrder.logs.length - 1]?.note || ''}"\n\nТа энэхүү захиалгыг бүрэн хэмжээгээр хянах уу?`;
          replyChoices = [
            { label: '📊 Хянах хуудсаар том харах', action: 'go_tracker_page' }
          ];
          onTrackOrder(orderId);
        } else {
          responseText = `🔍 Уучлаарай, ${orderId} кодтой захиалга манай санд одоогоор байхгүй байна. Та кодоо зөв эсэхийг дахин нэг нягтлаарай. Жишээ нь: ORD-9281`;
        }
      } 
      // Query filters
      else if (lowerQuery.includes('хүргэлт') || lowerQuery.includes('хүргэх')) {
        responseText = `🛵 Хүргэлтийн нөхцөл:\nБид Улаанбаатар хот дотор бүх захиалгыг төлбөр баталгаажсанаас хойш 24-48 цагийн дотор ТӨЛБӨРГҮЙ хүргэж өгнө. Хүргэгч гарахаас өмнө таны оруулсан утсаар холбогдож цагийг тохируулах болно.`;
      } 
      else if (lowerQuery.includes('баталгаа') || lowerQuery.includes('чанар') || lowerQuery.includes('шил')) {
        responseText = `🛡️ Чанарын баталгаа:\nVAULT13-аас зардаг бүх цагнууд нь 100% индранил кристал (Sapphire glass) шилтэй тул зурагддаггүй. Сонгосон оосор тус бүр гар аргаар боловсруулсан арьс болон зэвэрдэггүй бат бөх гангаар бүтсэн бөгөөд ажиллах механизмдаа 1-2 жилийн үйлдвэрийн албан ёсны баталгааг олгоно.`;
      }
      else if (lowerQuery.includes('хямд') || lowerQuery.includes('үнэ')) {
        const cheapest = [...watches].sort((a,b)=> a.price - b.price)[0];
        responseText = `⌚ Манай хамгийн боломжийн үнэтэй чанартай цаг бол "${cheapest.name}" юм. Үнэ: ${cheapest.price.toLocaleString()}₮. Энэ нь маш бат бөх титан бүрхүүлтэй спорт загвар бөгөөд 100m усны хамгаалалттай тул усанд сэлэхэд тохиромжтой.`;
        replyChoices = [
          { label: `⌚ ${cheapest.name}-ийн үзүүлэлт харах`, action: 'luxury_recs' }
        ];
      }
      else if (lowerQuery.includes('сошиал') || lowerQuery.includes('холбогдох') || lowerQuery.includes('фэйсбүүк') || lowerQuery.includes('facebook') || lowerQuery.includes('утас')) {
        responseText = `Та манай албан ёсны фэйсбүүк хуудсаар шууд холбогдох асуултууд тавихыг хүсвэл https://www.facebook.com/profile.php?id=61587082883795 холбоосоор орно уу. Эсвэл админы утас 9911-XXXX руу залгаж болно.`;
        replyChoices = [
          { label: '🔗 Фэйсбүүк хаяг нээх', action: 'open_fb_url' }
        ];
      }
      else {
        responseText = `Ойлголоо. Таны асуусан "${query}" сэдвээр манай худалдааны зөвлөх танд улам тодорхой зөвлөгөөг өгөх болно. Та цагны загвар сонирхох уу эсвэл захиалгын кодоо (Жишээ нь: ORD-1102) оруулж хянах уу?`;
        replyChoices = [
          { label: '👑 Тансаг зэрэглэлийн цагнууд санал болгох', action: 'luxury_recs' },
          { label: '💬 Facebook борлуулагчтай холбогдох', action: 'fb_contact' }
        ];
      }

      const botMsgId = `text-bot-${Date.now()}`;
      setMessages(prev => [...prev, {
        id: botMsgId,
        sender: 'bot',
        text: responseText,
        timestamp: new Date(),
        choices: replyChoices
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div id={id} className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          id="chatbot-trigger-fab"
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-none bg-slate-950 text-white shadow-xl hover:bg-blue-900 transition-colors duration-300 relative group cursor-pointer border-2 border-slate-950"
        >
          {/* Subtle pulse animation indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border border-white" />
          </span>
          <MessageCircle size={22} className="stroke-[1.5]" />
        </button>
      )}

      {/* Main Chat Panel */}
      {isOpen && (
        <div 
          id="chatbot-window" 
          className="flex h-[500px] w-[360px] flex-col rounded-lg border border-slate-205 bg-white shadow-2xl animate-slide-in overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-[#0B1528] px-4 py-3 text-white">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h4 className="font-display text-xs font-bold tracking-wider uppercase">VAULT13 CONCIERGE</h4>
                <p className="font-sans text-[9px] text-slate-400">Шуурхай зөвлөгөө & Орлого шалгагч</p>
              </div>
            </div>
            
            <button
              id="chatbot-btn-close"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div 
                  key={m.id} 
                  id={`chat-msg-${m.id}`}
                  className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="max-w-[85%] space-y-2">
                    {/* Message Bubble */}
                    <div 
                      className={`rounded-lg p-3 text-xs leading-relaxed ${
                        isBot 
                          ? 'bg-white border border-slate-150 text-slate-800' 
                          : 'bg-slate-900 text-white font-medium'
                      }`}
                      style={{ whiteSpace: 'pre-line' }}
                    >
                      {m.text}
                      
                      {/* Direct anchor fallback to Facebook */}
                      {isBot && m.text.includes('https://www.facebook.com') && (
                        <div className="mt-2.5">
                          <a 
                            id="chatbot-embedded-fb-link"
                            href="https://www.facebook.com/profile.php?id=61587082883795"
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-display text-[9px] font-bold tracking-widest uppercase rounded tracking-wider"
                          >
                            <span>ШУУД ХОЛБОГДОХ LINK</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Choices buttons rendered dynamically */}
                    {isBot && m.choices && m.choices.length > 0 && (
                      <div id={`chat-choices-${m.id}`} className="flex flex-col gap-1.5 pt-1 text-left">
                        {m.choices.map((ch, idx) => (
                          <button
                            key={idx}
                            id={`chat-choice-btn-${m.id}-${idx}`}
                            onClick={() => handleChoiceClick(ch.action, ch.label)}
                            className="font-display text-[10px] font-black tracking-normal text-left text-blue-900 hover:text-white hover:bg-blue-900 bg-white border-2 border-slate-900 p-2 rounded-none transition shadow-sm cursor-pointer"
                          >
                            {ch.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Simulated typing indicator */}
            {isTyping && (
              <div id="chatbot-typing-indicator" className="flex justify-start">
                <div className="bg-white border border-slate-150 rounded-lg py-2 px-3 text-xs text-slate-400 flex items-center space-x-1">
                  <Clock size={12} className="animate-spin text-slate-300" />
                  <span>Уншиж байна...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form 
            id="chatbot-input-form" 
            onSubmit={handleSendMessage} 
            className="border-t border-slate-100 px-3 py-2 flex items-center bg-white"
          >
            <input
              id="chatbot-input-field"
              type="text"
              placeholder="Бичих..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-transparent px-2 py-1.5 text-xs outline-none focus:ring-0 placeholder:text-slate-400 font-sans"
            />
            <button
              id="chatbot-btn-submit"
              type="submit"
              className="p-1.5 text-blue-900 hover:text-slate-900 transition flex items-center justify-center cursor-pointer"
              aria-label="Илгээх"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
