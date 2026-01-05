import React, { useMemo, useState, useRef } from 'react';
import { RevoGrid } from '@revolist/react-datagrid';
import YearBand from './YearBand';
import { weekLabels, yearSpans, data as projectData, type RowNode } from './data';
import './styles.css';

const COL_W = 90;

// 所有周列对应的字段名 w1..w52
const WEEK_PROPS = weekLabels.map((_, i) => 'w' + (i + 1));

const LEVEL_STYLES = [
  { bg: '#96BE0D33', color: '#5a4b2c' }, // level 0: Project / Person
  { bg: '#0099A111', color: '#3e4a6b' }, // level 1: Section (Capacity / Projects)
  { bg: '#ffffff', color: '#000000' },   // level 2+: Detail rows
];

type TabKey = 'planProjects' | 'planTeams' | 'review';

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

// PlanTeams 视图用的示例“人员视角”数据（参考截图）
const initialTeamData: RowNode[] = [
  {
    name: 'XXX',
    skill: '3D',
    children: [
      {
        name: 'Capacity',
        children: [
          {
            name: 'Absences',
            w2: 80,
            w3: 20,
          },
          {
            name: 'Projects',
            children: [
              {
                name: 'SPA',
                skill: '3D',
                w4: 50,
                w5: 40,
                w6: 10,
              },
              {
                name: 'FP0.8',
                skill: '3D',
                w5: 70,
                w6: 30,
                w7: 40,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'ZZZ',
    skill: 'Software,Camera',
    children: [
      {
        name: 'Capacity',
        children: [
          {
            name: 'Absences',
            w7: 8,
          },
          {
            name: 'Projects',
            children: [
              {
                name: 'ZEEKR',
                skill: 'Software',
                w8: 40,
                w9: 32,
              },
              {
                name: 'FP0.8',
                skill: 'Camera',
                w9: 10,
                w10: 10,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function App() {
  const spans = yearSpans(weekLabels);
  const [activeTab, setActiveTab] = useState<TabKey>('planProjects');

  // PlanProjects（项目视角）数据
  const [projectRows, setProjectRows] = useState<RowNode[]>(() => {
    const cloned = cloneRows(projectData);
    recalcCapacities(cloned);
    return cloned;
  });

  // PlanTeams（人员视角）数据
  const [teamRows, setTeamRows] = useState<RowNode[]>(() => {
    const cloned = cloneRows(initialTeamData);
    recalcCapacities(cloned);
    return cloned;
  });

  const projectGridRef = useRef<any>(null);
  const teamGridRef = useRef<any>(null);

  // 拍平后的行（包含 _level / _info），用于绑定到 RevoGrid
  const flatProjectRows = useMemo(() => flattenRows(projectRows), [projectRows]);
  const flatTeamRows = useMemo(() => flattenRows(teamRows), [teamRows]);

  // 通用编辑处理函数工厂（项目视角 & 人员视角共用）
  const createEditHandler = (setTree: any) => {
    return (e: any) => {
      const detail = e.detail || e || {};
      const rowIndex: number | undefined =
        detail.row ?? detail.rowIndex ?? detail.rowIdx;

      let prop: string | undefined =
        detail.prop ??
        detail.column?.prop ??
        detail.column?.name;

      const val: any = detail.val ?? detail.model?.[prop as string];

      if (typeof rowIndex !== 'number') return;
      if (typeof prop !== 'string') return;

      // 只处理周列：w1..w52
      if (!prop.startsWith('w')) return;

      setTree((prev: RowNode[]) => {
        const cloned = cloneRows(prev);
        const flat = flattenRows(cloned);
        const target = flat[rowIndex];
        if (!target) return prev;

        // 只允许明细行编辑（level >= 2）
        const level = (target as any)._level ?? 0;
        if (level < 2) {
          alert('请在明细行输入工时（例如具体工程师或项目行）。');
          return prev;
        }

        (target as any)[prop] = val === '' ? 0 : Number(val) || 0;
        recalcCapacities(cloned);
        return cloned;
      });
    };
  };

  const handleProjectEdit = useMemo(() => createEditHandler(setProjectRows), []);
  const handleTeamEdit = useMemo(() => createEditHandler(setTeamRows), []);

  // 公共周列配置
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
            style.border = '1px solid #FFFFFF';
            style.background = '#D200D2';
            style.color = '#ffffff';
          }

          return h('div', { style }, String(v));
        },
      })),
    []
  );

  // PlanProjects 的前置列
  const projectBaseCols = [
    {
      prop: 'name',
      name: 'Name',
      size: 190,
      cellTemplate: (h: any, p: any) => {
        const level = (p.model as any)._level || 0;
        const { bg, color } = getLevelStyle(level);

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

  // PlanTeams 的前置列：Name / Skill / Capacity
  const teamBaseCols = [
    {
      prop: 'name',
      name: 'Name',
      size: 190,
      cellTemplate: (h: any, p: any) => {
        const level = (p.model as any)._level || 0;
        const { bg, color } = getLevelStyle(level);

        // 这里单独调整显示层级：
        // XXX / ZZZ: level 0
        // Capacity / Absences / Projects: 在 Name 列上显示为同一级
        // SPA / FP0.8 / ZEEKR: 再往里一级
        const rawName = (p.model[p.prop] || '') as string;
        let displayLevel = level;
        if ((rawName === 'Absences' || rawName === 'Projects') && level >= 2) {
          displayLevel = 1;
        }

        let prefix = '';
        if (displayLevel === 1) {
          prefix = '·· ';
        } else if (displayLevel >= 2) {
          prefix = '···· ';
        }

        const text = rawName;

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
      prop: 'skill',
      name: 'Skill',
      size: 160,
      cellTemplate: (h: any, p: any) => {
        const level = (p.model as any)._level || 0;
        const { bg } = getLevelStyle(level);
        const text = (p.model[p.prop] || '') as string;
        return h(
          'div',
          {
            style: {
              background: bg,
              height: '100%',
              width: '100%',
              boxSizing: 'border-box',
              border: '1px solid #dde4f5',
              display: 'flex',
              alignItems: 'center',
            },
          },
          text
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
      {/* 顶部 Tab：PlanProjects / PlanTeams / Review */}
      <div className="top-tabs">
        <div
          className={`tab-item ${activeTab === 'planProjects' ? 'active' : ''}`}
          onClick={() => setActiveTab('planProjects')}
        >
          PlanProjects
        </div>
        <div
          className={`tab-item ${activeTab === 'planTeams' ? 'active' : ''}`}
          onClick={() => setActiveTab('planTeams')}
        >
          PlanTeams
        </div>
        <div
          className={`tab-item ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => setActiveTab('review')}
        >
          Review
        </div>
      </div>

      {/* === 1. PlanProjects：项目视角的工时规划 === */}
      {activeTab === 'planProjects' && (
        <>
          {/* 下拉筛选行（原样保留） */}
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
              <RevoGrid
                ref={projectGridRef}
                source={flatProjectRows}
                columns={[...projectBaseCols, ...weekCols]}
                rowHeaders
                range
                clipboard
                // @ts-ignore
                onAfterEdit={handleProjectEdit as any}
                // @ts-ignore
                onAfteredit={handleProjectEdit as any}
              />
            </div>
          </div>
        </>
      )}

      {/* === 2. PlanTeams：人员视角的工时规划 === */}
      {activeTab === 'planTeams' && (
        <>
          {/* 顶部筛选行，参考截图：Name / Responsibility / Unit / 筛选时间段 */}
          <div className="filter-row">
            <select className="filter-select"><option>Name</option></select>
            <select className="filter-select"><option>Responsibility</option></select>
            <select className="filter-select"><option>Unit</option></select>
            <select className="filter-select"><option>筛选时间段</option></select>
          </div>

          <div className="wrapper">
            <YearBand spans={spans} colWidth={COL_W} />
            <div className="grid-container">
              <RevoGrid
                ref={teamGridRef}
                source={flatTeamRows}
                columns={[...teamBaseCols, ...weekCols]}
                rowHeaders
                range
                clipboard
                // @ts-ignore
                onAfterEdit={handleTeamEdit as any}
                // @ts-ignore
                onAfteredit={handleTeamEdit as any}
              />
            </div>
          </div>
        </>
      )}

      {/* === 3. Review：先占位，后续实现报表视图 === */}
      {activeTab === 'review' && (
        <div className="wrapper">
          
        </div>
      )}
    </div>
  );
}
