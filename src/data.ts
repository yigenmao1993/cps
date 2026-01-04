export type WeekLabel = [string, string, string];

export const weekLabels: WeekLabel[] = [
  ['12-30', '1', '2025'],
  ['1-6', '2', '2025'],
  ['1-13', '3', '2025'],
  ['1-20', '4', '2025'],
  ['1-27', '5', '2025'],
  ['2-3', '6', '2025'],
  ['2-10', '7', '2025'],
  ['2-17', '8', '2025'],
  ['2-24', '9', '2025'],
  ['3-3', '10', '2025'],
  ['3-10', '11', '2025'],
  ['3-17', '12', '2025'],
  ['3-24', '13', '2025'],
  ['3-31', '14', '2025'],
  ['4-7', '15', '2025'],
  ['4-14', '16', '2025'],
  ['4-21', '17', '2025'],
  ['4-28', '18', '2025'],
  ['5-5', '19', '2025'],
  ['5-12', '20', '2025'],
  ['5-19', '21', '2025'],
  ['5-26', '22', '2025'],
  ['6-2', '23', '2025'],
  ['6-9', '24', '2025'],
  ['6-16', '25', '2025'],
  ['6-23', '26', '2025'],
  ['6-30', '27', '2025'],
  ['7-7', '28', '2025'],
  ['7-14', '29', '2025'],
  ['7-21', '30', '2025'],
  ['7-28', '31', '2025'],
  ['8-4', '32', '2025'],
  ['8-11', '33', '2025'],
  ['8-18', '34', '2025'],
  ['8-25', '35', '2025'],
  ['9-1', '36', '2025'],
  ['9-8', '37', '2025'],
  ['9-15', '38', '2025'],
  ['9-22', '39', '2025'],
  ['9-29', '40', '2025'],
  ['10-6', '41', '2025'],
  ['10-13', '42', '2025'],
  ['10-20', '43', '2025'],
  ['10-27', '44', '2025'],
  ['11-3', '45', '2025'],
  ['11-10', '46', '2025'],
  ['11-17', '47', '2025'],
  ['11-24', '48', '2025'],
  ['12-1', '49', '2025'],
  ['12-8', '50', '2025'],
  ['12-15', '51', '2025'],
  ['12-22', '52', '2025'],
];

export function yearSpans(weeks: WeekLabel[]) {
  const arr: { year: string; count: number }[] = [];
  let cur: null | { year: string; count: number } = null;
  for (const [, , y] of weeks) {
    if (!cur || cur.year !== y) {
      if (cur) arr.push(cur);
      cur = { year: y, count: 1 };
    } else {
      cur.count++;
    }
  }
  if (cur) arr.push(cur);
  return arr;
}

export interface RowNode {
  info?: string;
  name: string;
  capacity?: number;
  [key: string]: any;
  children?: RowNode[];
}

// 根据截图构造示例树形数据：两个项目，每个项目下若干团队和工程师
export const data: RowNode[] = [
  {
    info: "BM3:2025.11.21\nBM4:2025.12.23",
    name: "SPT1.5 THR",
    children: [
      {
        name: "CS",
        children: [
          { name: "Tang Xiaoyan", w1: 40, w2: 40 }
        ]
      },
      {
        name: "3D",
        children: [
          { name: "Shao Yikai", w5: 80, w6: 120 },
          { name: "Wang Hao", w3: 40, w4: 40 },
          { name: "Li Fei", w3: 40, w4: 20 }
        ]
      },
      {
        name: "2D",
        children: [
          { name: "Chen Panpan", w7: 10, w8: 10 },
          { name: "Zhang Wen", w9: 30 }
        ]
      },
      {
        name: "ECAD",
        children: [
          { name: "Wang Hua", w10: 40, w11: 16 }
        ]
      },
      {
        name: "Program",
        children: [
          { name: "Guo Guangxing", w5: 40, w6: 40 },
          { name: "Fu Yang", w7: 20 }
        ]
      },
      {
        name: "Camera",
        children: [
          { name: "Liu Mingfu", w12: 40 }
        ]
      },
      {
        name: "Service",
        children: [
          { name: "Zhang Haiping", w12: 40 }
        ]
      },
      {
        name: "Mechanic",
        children: [
          { name: "Zhang Huasong", w12: 40 }
        ]
      },
      {
        name: "Electrician",
        children: [
          { name: "Wang Bicheng", w12: 40 }
        ]
      }
    ]
  },
  {
    info: "BM3:2025.11.21\nBM4:2025.12.23",
    name: "ST 2.5 assembly machine",
    children: [
      {
        name: "CS",
        children: [
          { name: "Tang Xiaoyan", w1: 40, w2: 40 }
        ]
      },
      {
        name: "3D",
        children: [
          { name: "Shao Yikai", w5: 80, w6: 120 },
          { name: "Wang Hao", w3: 40, w4: 40 },
          { name: "Li Fei", w3: 40, w4: 20 }
        ]
      },
      {
        name: "2D",
        children: [
          { name: "Chen Panpan", w7: 10, w8: 10 },
          { name: "Zhang Wen", w9: 30 }
        ]
      },
      {
        name: "ECAD",
        children: [
          { name: "Wang Hua", w10: 40, w11: 16 }
        ]
      },
      {
        name: "Program",
        children: [
          { name: "Guo Guangxing", w5: 40, w6: 40 },
          { name: "Fu Yang", w7: 20 }
        ]
      },
      {
        name: "Camera",
        children: [
          { name: "Liu Mingfu", w12: 40 }
        ]
      },
      {
        name: "Service",
        children: [
          { name: "Zhang Haiping", w12: 40 }
        ]
      },
      {
        name: "Mechanic",
        children: [
          { name: "Zhang Huasong", w12: 40 }
        ]
      },
      {
        name: "Electrician",
        children: [
          { name: "Wang Bicheng", w12: 40 }
        ]
      }
    ]
  }
];
