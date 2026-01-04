import React, { useMemo, useState, useRef, useEffect } from 'react';
import { RevoGrid } from '@revolist/react-datagrid';
import YearBand from './YearBand';
import { weekLabels, yearSpans, data as initialData, type RowNode } from './data';
import './styles.css';

const COL_W = 90;

// 所有周列对应的字段名 w1..w52
const WEEK_PROPS = weekLabels.map((_, i) => 'w' + (i + 1));

const LEVEL_STYLES = [
  { bg: '#96BE0D33', color: '#5a4b2c' }, // level 0: Project
  { bg: '#0099A111', color: '#3e4a6b' }, // level 1: Team
  { bg: '#ffffff', color: '#000000' }, // level 2: Engineer
];

function getLevelStyle(level: number) {
  const idx = level >= 0 && level < LEVEL_STYLES.length ? level : 2;
  return LEVEL_STYLES[idx];
}

// 深拷贝工具
function cloneRows(rows: RowNode[]): RowNode[] {
  return rows.map(r => ({
    ...r,
    children: r.children ? cloneRows(r.children) : undefined,
  }));
}

// 计算一行所有周的总和
function sumWeeks(row: RowNode): number {
  let total = 0;
  for (const prop of WEEK_PROPS) {
    const v = Number((row as any)[prop] ?? 0);
    if (!isNaN(v)) total += v;
  }
  return total;
}

// 递归计算 capacity：叶子=周合计，父=子 capacity 合计
function recalcCapacities(rows: RowNode[]): void {
  const dfs = (nodes: RowNode[]): number => {
    let subtotal = 0;
    for (const n of nodes) {
      if (n.children && n.children.length > 0) {
        const childTotal = dfs(n.children);
        (n as any).capacity = childTotal;
        subtotal += childTotal;
      } else {
        const leafTotal = sumWeeks(n);
        (n as any).capacity = leafTotal;
        subtotal += leafTotal;
      }
    }
    return subtotal;
  };

  dfs(rows);
}

// 将树形结构拍平成一维数组，并在节点上打上 _level / _info 方便渲染
function flattenRows(rows: RowNode[]): RowNode[] {
  const flat: RowNode[] = [];
  const walk = (nodes: RowNode[], level: number, rootInfo?: string) => {
    for (const n of nodes) {
      const info = (n.info as string | undefined) ?? rootInfo;
      (n as any)._level = level;
      (n as any)._info = info;
      flat.push(n);
      if (n.children && n.children.length) {
        walk(n.children, level + 1, info);
      }
    }
  };
  walk(rows, 0, undefined);
  return flat;
}

const AnyRevoGrid: any = RevoGrid;

export default function App() {
  const spans = yearSpans(weekLabels);

  const [rows, setRows] = useState<RowNode[]>(() => {
    const cloned = cloneRows(initialData);
    recalcCapacities(cloned);
    return cloned;
  });

  const gridRef = useRef<any>(null);

  // 拍平后的行（包含 _level / _info），用于绑定到 RevoGrid
  const flatRows = useMemo(() => flattenRows(rows), [rows]);

  // 监听 RevoGrid 的 afteredit 事件（v4 系列事件名为 afteredit）
  const handleAfterEdit = (e: any) => {
    // RevoGrid 事件在不同版本上 detail 结构不完全一样，这里都兜一下
    const detail = e.detail || e || {};
    const rowIndex: number | undefined =
      detail.row ?? detail.rowIndex ?? detail.rowIdx;

    // prop 可能在 detail.prop，也可能在 detail.column.prop / name 上
    let prop: string | undefined =
      detail.prop ??
      detail.column?.prop ??
      detail.column?.name;

    const val: any = detail.val ?? detail.model?.[prop as string];

    // 看看事件到底长什么样，方便你调试
    console.log('afteredit detail = ', detail);

    if (typeof rowIndex !== 'number') {
      return;
    }
    if (typeof prop !== 'string') {
      return;
    }

    // 只处理周列：w1..w52
    if (!prop.startsWith('w')) {
      return;
    }

    setRows(prev => {
      // 深拷贝整棵树
      const cloned = cloneRows(prev);

      // 拍平成一维数组，对齐 rowIndex
      const flat = flattenRows(cloned);
      const target = flat[rowIndex];
      if (!target) return prev;

      // 只允许工程师行编辑
      if ((target as any)._level !== 2) {
        alert('Team / Project 行不可编辑，请在工程师行输入工时。');
        return prev;
      }

      // 写入新值（转成数字，避免字符串拼接）
      (target as any)[prop] = val === '' ? 0 : Number(val) || 0;

      // 重新计算 capacity（工程师→Team→Project）
      recalcCapacities(cloned);

      return cloned;
    });
  };

  // 周列配置：显示起始日期 + 周次，并保持 Excel 行为
  const weekCols = useMemo(
    () =>
      weekLabels.map(([d, n], i) => ({
        prop: 'w' + (i + 1),
        name: `${d} (W${n})`,
        size: COL_W,
        cellTemplate: (h: any, p: any) => {
          const level = (p.model as any)._level || 0;
          const { bg, color } = getLevelStyle(level);
          const v = p.model[p.prop];
          const style: any = {
            textAlign: 'center',
            background: bg,
            color,
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            border: '1px solid #dde4f5',
          };

          if (v === undefined || v === null || v === '') {
            return h('div', { style }, '');
          }

          const num = Number(v);
          if (!isNaN(num) && num > 40) {
            // 紫色边框
            style.border = '1px solid #FFFFFF';
            // 紫色背景
            style.background = '#D200D2';
            // 文字颜色建议白色
            style.color = '#ffffff';
          }

          return h('div', { style }, String(v));
        },
      })),
    []
  );

const baseCols = [
  // {
  //   prop: 'info',
  //   name: 'Info',
  //   size: 140,
  //   cellTemplate: (h: any, p: any) => {
  //     const level = (p.model as any)._level || 0;
  //     const info = (p.model as any)._info || p.model.info || '';
  //     const isRoot = level === 0;
  //     const classes = ['cell-info', isRoot ? 'cell-info-root' : 'cell-info-child'];
  //     return h(
  //       'div',
  //       {
  //         class: classes.join(' '),
  //         style: {
  //           width: '100%',
  //           height: '100%',
  //           whiteSpace: 'pre-line',
  //         },
  //       },
  //       isRoot ? info : ''
  //     );
  //   },
  // },

  {
    prop: 'name',
    name: 'Name',
    size: 190,
    cellTemplate: (h: any, p: any) => {
      const level = (p.model as any)._level || 0;
      const { bg, color } = getLevelStyle(level);

      // 根据 level 生成前缀：0级不缩进，1级两个点，2级四个点
      let prefix = '';
      if (level === 1) {
        prefix = '·· ';
      } else if (level >= 2) {
        prefix = '···· ';
      }

      const text = (p.model[p.prop] || '') as string;

      return h(
        'div',
        {
          class: 'cell-name',
          style: {
            background: bg,
            color,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          },
        },
        prefix + text
      );
    },
  },


  {
    prop: 'capacity',
    name: 'Capacity',
    size: 70,
    cellTemplate: (h: any, p: any) => {
      const level = (p.model as any)._level || 0;
      const { bg, color } = getLevelStyle(level);
      const v = p.model.capacity;

      return h(
        'div',
        {
          class: 'cell-capacity',
          style: {
            textAlign: 'center',
            background: bg,
            color,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
        v == null || v === '' ? '' : String(v)
      );
    },
  },

];


  return (
        <div className="app-container">
      {/* 新增的顶部 Tab */}
      <div className="top-tabs">
        <div className="tab-item active">Plan</div>
        <div className="tab-item">Review</div>
      </div>

      {/* 新增的下拉框行 */}
      <div className="filter-row">
        <select className="filter-select"><option>BU</option></select>
        <select className="filter-select"><option>BudgetNumber</option></select>
        <select className="filter-select"><option>BM</option></select>
        <select className="filter-select"><option>Status</option></select>
        <select className="filter-select"><option>Unit</option></select>
        <select className="filter-select"><option>Group</option></select>
      </div>
    <div className="wrapper">
      <YearBand spans={spans} colWidth={COL_W} />
      <div className="grid-container">
        <AnyRevoGrid
          ref={gridRef}
          source={flatRows}
          columns={[...baseCols, ...weekCols]}
          rowHeaders
          range
          clipboard
          /* 直接绑定原生事件，类型不匹配忽略即可 */
          // @ts-ignore
          onAfterEdit={handleAfterEdit as any}
          // @ts-ignore
          onAfteredit={handleAfterEdit as any}
        />
      </div>
    </div>
    </div>
  );
}
