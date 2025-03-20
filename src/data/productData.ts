// 商品データの型定義
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  lastUpdated: string;
  discount?: number;
  rating?: number;
}

// 商品データ
export const productData: Product[] = [
  {
    id: 1,
    name: "ノートパソコン",
    category: "電子機器",
    price: 120000,
    stock: 15,
    status: "在庫あり",
    lastUpdated: "2023/6/15",
    discount: 5.00,
    rating: 4.5,
  },
  {
    id: 2,
    name: "スマートフォン",
    category: "電子機器",
    price: 80000,
    stock: 20,
    status: "在庫あり",
    lastUpdated: "2023/7/20",
    discount: 10.00,
    rating: 4.2,
  },
  {
    id: 3,
    name: "ヘッドフォン",
    category: "アクセサリー",
    price: 15000,
    stock: 30,
    status: "在庫あり",
    lastUpdated: "2023/8/10",
    discount: 15.00,
    rating: 4.7,
  },
  {
    id: 4,
    name: "キーボード",
    category: "アクセサリー",
    price: 8000,
    stock: 25,
    status: "在庫あり",
    lastUpdated: "2023/9/5",
    discount: 0.00,
    rating: 4.0,
  },
  {
    id: 5,
    name: "モニター",
    category: "電子機器",
    price: 35000,
    stock: 10,
    status: "残りわずか",
    lastUpdated: "2023/10/1",
    discount: 7.50,
    rating: 4.3,
  },
  {
    id: 6,
    name: "マウス",
    category: "アクセサリー",
    price: 5000,
    stock: 0,
    status: "在庫切れ",
    lastUpdated: "2023/11/12",
    discount: 0.00,
    rating: 3.8,
  },
  {
    id: 7,
    name: "タブレット",
    category: "電子機器",
    price: 45000,
    stock: 8,
    status: "残りわずか",
    lastUpdated: "2023/12/5",
    discount: 12.50,
    rating: 4.1,
  },
  {
    id: 8,
    name: "スピーカー",
    category: "オーディオ",
    price: 12000,
    stock: 18,
    status: "在庫あり",
    lastUpdated: "2024/1/10",
    discount: 5.00,
    rating: 4.4,
  },
  {
    id: 9,
    name: "Webカメラ",
    category: "アクセサリー",
    price: 7500,
    stock: 22,
    status: "在庫あり",
    lastUpdated: "2024/2/15",
    discount: 0.00,
    rating: 3.9,
  },
  {
    id: 10,
    name: "外付けHDD",
    category: "ストレージ",
    price: 9800,
    stock: 5,
    status: "残りわずか",
    lastUpdated: "2024/3/20",
    discount: 2.50,
    rating: 4.2,
  }
]; 