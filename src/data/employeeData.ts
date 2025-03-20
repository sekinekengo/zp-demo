// 従業員データの型定義
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: string;
  performance: number;
}

// 部署の選択肢
export const departments = [
  "営業部",
  "開発部",
  "人事部",
  "経理部",
  "マーケティング部",
];

// 雇用状態の選択肢
export const statuses = ["正社員", "契約社員", "パートタイム", "インターン"];

// 従業員データ
export const employeeData: Employee[] = [
  {
    id: 1,
    firstName: "太郎",
    lastName: "山田",
    department: "営業部",
    position: "マネージャー",
    salary: 650000,
    hireDate: "2018/4/1",
    status: "正社員",
    performance: 4.2,
  },
  {
    id: 2,
    firstName: "花子",
    lastName: "佐藤",
    department: "開発部",
    position: "シニアエンジニア",
    salary: 580000,
    hireDate: "2019/7/15",
    status: "正社員",
    performance: 4.5,
  },
  {
    id: 3,
    firstName: "一郎",
    lastName: "鈴木",
    department: "人事部",
    position: "スペシャリスト",
    salary: 520000,
    hireDate: "2020/1/10",
    status: "正社員",
    performance: 3.8,
  },
  {
    id: 4,
    firstName: "美咲",
    lastName: "田中",
    department: "マーケティング部",
    position: "コーディネーター",
    salary: 480000,
    hireDate: "2020/9/5",
    status: "契約社員",
    performance: 4.0,
  },
  {
    id: 5,
    firstName: "健太",
    lastName: "伊藤",
    department: "開発部",
    position: "エンジニア",
    salary: 450000,
    hireDate: "2021/3/20",
    status: "正社員",
    performance: 3.7,
  },
  {
    id: 6,
    firstName: "さくら",
    lastName: "高橋",
    department: "経理部",
    position: "アシスタント",
    salary: 380000,
    hireDate: "2021/6/15",
    status: "パートタイム",
    performance: 3.5,
  },
  {
    id: 7,
    firstName: "直樹",
    lastName: "渡辺",
    department: "営業部",
    position: "セールスレップ",
    salary: 420000,
    hireDate: "2021/10/1",
    status: "正社員",
    performance: 3.9,
  },
  {
    id: 8,
    firstName: "結衣",
    lastName: "小林",
    department: "開発部",
    position: "ジュニアエンジニア",
    salary: 400000,
    hireDate: "2022/2/10",
    status: "正社員",
    performance: 3.6,
  },
  {
    id: 9,
    firstName: "大輔",
    lastName: "加藤",
    department: "マーケティング部",
    position: "インターン",
    salary: 250000,
    hireDate: "2022/7/1",
    status: "インターン",
    performance: 3.2,
  },
  {
    id: 10,
    firstName: "愛",
    lastName: "吉田",
    department: "人事部",
    position: "アシスタント",
    salary: 350000,
    hireDate: "2022/9/15",
    status: "契約社員",
    performance: 3.4,
  },
]; 