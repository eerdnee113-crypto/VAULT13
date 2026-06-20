/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Watch, Order } from './types';

export const WATCHES: Watch[] = [
  {
    id: 'W-01',
    name: 'Horology Monolith',
    subName: 'Swiss Automatic Classic',
    price: 3850000,
    category: 'Classic',
    description: 'Цэвэр Швейцарь загвартай, байгалийн гэрлийн тусгалаар цэнхэртэх индранил шилтэй, гар аргаар өнгөлсөн зэвэрдэггүй ган их бие бүхий механик цаг. Урлаг болон цаг хугацааны төгс нэгдэл.',
    specs: {
      movement: 'Sellita SW200-1 (Швейцарь Автомат)',
      case: '316L Зэвэрдэггүй Ган (40mm)',
      glass: 'Индранил Кристал (Sapphire Anti-Reflective)',
      waterProof: '50m (5 ATM)',
      strap: 'Итали Сурхин Оосор (Шоколадан бор)'
    },
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'W-02',
    name: 'Oceanic Horizon',
    subName: 'Premium Diver Master',
    price: 4500000,
    category: 'Sport',
    description: 'Далайн гүн цэнхэрээс сэдэвлэсэн, 120 товшилтот эргэдэг хүрээтэй, усны маш өндөр хамгаалалт бүхий спорт загварыг тансаг зэрэглэлд аваачсан шилдэг бүтээл.',
    specs: {
      movement: 'Calibre 5 Автомат Хөдөлгүүртэй',
      case: 'Зэвэрдэггүй Ган (42mm)',
      glass: 'Гүдгэр Тэсвэртэй Индранил Шил',
      waterProof: '200m (20 ATM Professional)',
      strap: 'Ган Боосон Патенталсан Оосор (Урсдаг Тохируулгатай)'
    },
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'W-03',
    name: 'Minimal Sovereign',
    subName: 'Pure Gold Minimalist',
    price: 5200000,
    category: 'Luxury',
    description: 'Нүд гялбам тод байдлаас татгалзаж, намуун дөлгөөн тансаг байдлыг баримталсан, 18 каратын шар алтан бүрээстэй, нимгэн эх биетэй Швейцарь дээд зэрэглэлийн загвар.',
    specs: {
      movement: 'ETA 2892-A2 Ультра Нимгэн Автомат',
      case: '18K Алтадсан Зэвэрдэггүй Ган (38mm)',
      glass: 'Олон Сүвэнд Ойлголт Бууруулагчтай Индранил Шил',
      waterProof: '30m (3 ATM)',
      strap: 'Хар Чанартай Матрын Арьсан Оосор'
    },
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'W-04',
    name: 'Stealth Eclipse',
    subName: 'Matte All-Black Sport',
    price: 2950000,
    category: 'Sport',
    description: 'Матт хар титан бүрээстэй, цэргийн стандартад нийцэх маш өндөр цохилтын хамгаалалттай, шөнийн цагт өөрөө гэрэлтэх Трит-хоолой бүхий загварлаг спорт цаг.',
    specs: {
      movement: 'Miyota 9015 Японы Дээд Зэрэглэлийн Хөдөлгүүр',
      case: 'Санбласт маргад хар титан (43mm)',
      glass: 'Индранил Кристал',
      waterProof: '100m (10 ATM)',
      strap: 'Анти-аллерген уян каучук оосор'
    },
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'W-05',
    name: 'Aethel Rose',
    subName: 'Rose Gold Premium Collection',
    price: 3600000,
    category: 'Luxury',
    description: 'Тансаг ягаан алтлаг өнгийг сувдан цагаан нүүртэй төгс хослуулж, цагны зүүн буланг бага зэрэг ховилж өгсөн хамгийн гоёмсог эмэгтэйлэг хэрнээ хүчирхэг дизайн.',
    specs: {
      movement: 'Швейцарийн нарийн кварц систем',
      case: 'Ягаан Алтадсан 316L Ган (34mm)',
      glass: 'Индранил Кристал шил',
      waterProof: '30m (3 ATM)',
      strap: 'Алтан утсан сүлжмэл төмөр оосор'
    },
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'W-06',
    name: 'Titanium Vanguard',
    subName: 'Industrial Executive Skeleton',
    price: 6400000,
    category: 'Luxury',
    description: 'Цагны дотоод нарийн арааны хөдөлгөөнийг ил гаргасан Скелетон дизайн. Агаарын Тээврийн зэрэглэлийн 5-р зэргийн титанаар бүтээгдсэн, инженерийн гайхамшиг.',
    specs: {
      movement: 'Калибер MT5612 Дотоод Скелетон хөдөлгүүр',
      case: 'Санбласт 5-р зэргийн титан (41mm)',
      glass: 'Хоёр Талт Индранил Шил',
      waterProof: '100m (10 ATM)',
      strap: 'Нүүрстөрөгчийн шилэн оосор + Сур хосолсон'
    },
    image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-7811',
    customerName: 'Баттулга Мөнхбат',
    phone: '99112233',
    address: 'БЗД, 26-р хороо, Парк Алтай хотхон, 101-203',
    notes: 'Үүдний кодоо дараад орж болно. Наадмын өмнө амжиж хүргээрэй.',
    items: [
      { watch: WATCHES[0], quantity: 1 },
      { watch: WATCHES[1], quantity: 1 }
    ],
    totalAmount: 8350000,
    paymentMethod: 'qpay',
    status: 'delivered',
    createdAt: '2026-06-18T10:30:00-07:00',
    logs: [
      { status: 'pending', updatedAt: '2026-06-18T10:30:00-07:00', note: 'Захиалга үүсч, төлбөр хүлээгдэж байна' },
      { status: 'confirmed', updatedAt: '2026-06-18T10:35:12-07:00', note: 'qPay-ээр төлбөр амжилттай баталгаажлаа' },
      { status: 'preparing', updatedAt: '2026-06-18T14:10:05-07:00', note: 'Агуулахаас цагийг гарган, сав баглаа боодолд бэлтгэлээ' },
      { status: 'on_the_way', updatedAt: '2026-06-19T09:20:00-07:00', note: 'Хүргэгч Билгүүн (Утас: 88997766) захиалгыг хүргэхээр гарлаа' },
      { status: 'delivered', updatedAt: '2026-06-19T11:45:00-07:00', note: 'Хэрэглэгчид захиалгыг хүлээлгэн өглөө' }
    ]
  },
  {
    id: 'ORD-4319',
    customerName: 'Анужин Сэргэлэн',
    phone: '88123456',
    address: 'ХУД, 15-р хороо, Рапид Харш, 20-р байр 81',
    notes: 'Бэлэг тул хайрцаг савыг маш нямбай бэлдээрэй.',
    items: [
      { watch: WATCHES[4], quantity: 1 }
    ],
    totalAmount: 3600000,
    paymentMethod: 'socialpay',
    status: 'on_the_way',
    createdAt: '2026-06-19T14:20:00-07:00',
    logs: [
      { status: 'pending', updatedAt: '2026-06-19T14:20:00-07:00', note: 'Захиалга үүсч, төлбөр хүлээгдэж байна' },
      { status: 'confirmed', updatedAt: '2026-06-19T14:21:40-07:00', note: 'SocialPay-ээр төлбөр баталгаажлаа' },
      { status: 'preparing', updatedAt: '2026-06-19T17:00:00-07:00', note: 'Тусгай бэлгийн хайрцагт хийж лацдав' },
      { status: 'on_the_way', updatedAt: '2026-06-20T08:30:00-07:00', note: 'Хүргэгч Очир утасруу холбогдон хүргэхээр гарлаа' }
    ]
  },
  {
    id: 'ORD-1102',
    customerName: 'Тэмүүлэн Зоригт',
    phone: '95116677',
    address: 'СБД, 1-р хороо, Соёлын Төв Өргөө, 501 тоот',
    notes: 'Ажлын цагаар авна.',
    items: [
      { watch: WATCHES[3], quantity: 1 }
    ],
    totalAmount: 2950000,
    paymentMethod: 'card',
    status: 'preparing',
    createdAt: '2026-06-19T18:45:00-07:00',
    logs: [
      { status: 'pending', updatedAt: '2026-06-19T18:45:00-07:00', note: 'Захиалга үүсч, төлбөр хүлээгдэж байна' },
      { status: 'confirmed', updatedAt: '2026-06-19T18:47:11-07:00', note: 'Олон улсын картаар төлбөр баталгаажлаа' },
      { status: 'preparing', updatedAt: '2026-06-20T09:00:00-07:00', note: 'Чанарын шалгалтаар орж байна' }
    ]
  },
  {
    id: 'ORD-9281',
    customerName: 'Дэлгэрцэцэг Эрдэнэ',
    phone: '99008877',
    address: 'БГД, 4-р хороо, Алтай хотхон, 28-91',
    notes: 'Хүргэхээс өмнө заавал залгаарай.',
    items: [
      { watch: WATCHES[2], quantity: 1 }
    ],
    totalAmount: 5200000,
    paymentMethod: 'qpay',
    status: 'confirmed',
    createdAt: '2026-06-20T07:15:00-07:00',
    logs: [
      { status: 'pending', updatedAt: '2026-06-20T07:15:00-07:00', note: 'Захиалга үүсч, төлбөр хүлээгдэж байна' },
      { status: 'confirmed', updatedAt: '2026-06-20T07:16:30-07:00', note: 'qPay-ээр төлбөр амжилттай баталгаажлаа' }
    ]
  },
  {
    id: 'ORD-3051',
    customerName: 'Энхтөр Саруул',
    phone: '89101112',
    address: 'ХУД, 11-р хороо, Ривер Гарден, 301-402',
    notes: 'Орой 20 цагаас хойш авна.',
    items: [
      { watch: WATCHES[5], quantity: 1 }
    ],
    totalAmount: 6400000,
    paymentMethod: 'qpay',
    status: 'pending',
    createdAt: '2026-06-20T09:50:00-07:00',
    logs: [
      { status: 'pending', updatedAt: '2026-06-20T09:50:00-07:00', note: 'Захиалга үүсч, төлбөр хүлээгдэж байна' }
    ]
  }
];
