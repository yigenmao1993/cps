import React, { useState, useMemo } from 'react';
import App from './App';
import './mainLayout.css';
import { RevoGrid } from '@revolist/react-datagrid';
import SelectTypePlugin from '@revolist/revogrid-column-select';

type BottomTab = 'Capacity' | 'Projects' | 'Admin';
type ProjectTab = 'Forecast' | 'Planned';
type AdminTab = 'User' | 'Calendar';

interface ForecastRow {
  location: string;
  department: string;
  description: string;
  bu: string;
  probability: string;
  price: string;
  planHours1: string;
  planHours2: string;
}

interface PlannedRow {
  location: string;
  department: string;
  description: string;
  bu: string;
  budgetNumber: string;
  bm: string;
  status: string;
  price: string;

  bm2Target: string;
  bm2Plan: string;
  bm2Actual: string;
  bm3Target: string;
  bm3Plan: string;
  bm3Actual: string;
  bm4Target: string;
  bm4Plan: string;
  bm4Actual: string;
  bmMabsTarget: string;
  bmMabsPlan: string;
  bmMabsActual: string;

  bmF0tTarget: string;
  bmF0tPlan: string;
  bmF0tActual: string;
  bm5Target: string;
  bm5Plan: string;
  bm5Actual: string;
  bm6Target: string;
  bm6Plan: string;
  bm6Actual: string;
  bm7Target: string;
  bm7Plan: string;
  bm7Actual: string;

  projectManager: string;
  mechanicalDesign: string;
  electricalDesign: string;
  purchaseManagement: string;
  mechatronics: string;
  imageProcessing: string;
  software: string;
  maintenanceService: string;
}

interface UserRow {
  email: string;
  name: string;
  location: string;
  department: string;
  group: string;
  team: string;
  responsibility: string;
  type: string;
}

interface CalendarRow {
  weekNo: string;
  month: string;
  day: string;
  weekday: string;
  type: string;
  available: string;
  remark: string;
}

const initialForecastRows: ForecastRow[] = (() => {
  const rows: ForecastRow[] = [
    {
      location: 'China',
      department: 'AMD',
      description: 'MSTB 2.5 high speed line',
      bu: 'DC-PCC',
      probability: 'Medium',
      price: '1,820,000 RMB',
      planHours1: '',
      planHours2: '',
    },
    {
      location: 'China',
      department: 'AMD',
      description: 'ST 2.5 assembly machine',
      bu: 'ICE-ICC',
      probability: '',
      price: '',
      planHours1: '',
      planHours2: '',
    },
    {
      location: 'China',
      department: 'AMD',
      description: 'IE-AGV',
      bu: 'ICE-IF',
      probability: '',
      price: '',
      planHours1: '',
      planHours2: '',
    },
  ];

  while (rows.length < 20) {
    rows.push({
      location: '',
      department: '',
      description: '',
      bu: '',
      probability: '',
      price: '',
      planHours1: '',
      planHours2: '',
    });
  }

  return rows;
})();

const initialPlannedRows: PlannedRow[] = (() => {
  const makeEmpty = (): PlannedRow => ({
    location: '',
    department: '',
    description: '',
    bu: '',
    budgetNumber: '',
    bm: '',
    status: '',
    price: '',

    bm2Target: '',
    bm2Plan: '',
    bm2Actual: '',
    bm3Target: '',
    bm3Plan: '',
    bm3Actual: '',
    bm4Target: '',
    bm4Plan: '',
    bm4Actual: '',
    bmMabsTarget: '',
    bmMabsPlan: '',
    bmMabsActual: '',

    bmF0tTarget: '',
    bmF0tPlan: '',
    bmF0tActual: '',
    bm5Target: '',
    bm5Plan: '',
    bm5Actual: '',
    bm6Target: '',
    bm6Plan: '',
    bm6Actual: '',
    bm7Target: '',
    bm7Plan: '',
    bm7Actual: '',

    projectManager: '',
    mechanicalDesign: '',
    electricalDesign: '',
    purchaseManagement: '',
    mechatronics: '',
    imageProcessing: '',
    software: '',
    maintenanceService: '',
  });

  const rows: PlannedRow[] = [];

  rows.push({
    ...makeEmpty(),
    location: 'China',
    department: 'AMD',
    description: 'MSTB 2.5 high speed line',
    bu: 'DC-PCC',
    budgetNumber: 'S22015',
    bm: '039809',
    status: 'BM4',
    price: '1,820,000 RMB',
  });

  rows.push({
    ...makeEmpty(),
    location: 'China',
    department: 'AMD',
    description: 'ST 2.5 assembly machine',
    bu: 'ICE-ICC',
    budgetNumber: 'S21039',
    bm: '039051',
    status: 'BM3',
    price: '1,820,000 RMB',
  });

  rows.push({
    ...makeEmpty(),
    location: 'China',
    department: 'AMD',
    description: 'IE-AGV',
    bu: 'ICE-IF',
    budgetNumber: 'S23009',
    bm: '041167',
    status: 'BM3',
    price: '1,820,000 RMB',
  });

  const bmCols: (keyof PlannedRow)[] = [
    'bm2Target', 'bm2Plan', 'bm2Actual',
    'bm3Target', 'bm3Plan', 'bm3Actual',
    'bm4Target', 'bm4Plan', 'bm4Actual',
    'bmMabsTarget', 'bmMabsPlan', 'bmMabsActual',
    'bmF0tTarget', 'bmF0tPlan', 'bmF0tActual',
    'bm5Target', 'bm5Plan', 'bm5Actual',
    'bm6Target', 'bm6Plan', 'bm6Actual',
    'bm7Target', 'bm7Plan', 'bm7Actual',
  ];

  rows.forEach((r, idx) => {
    if (idx < 3) {
      bmCols.forEach(c => {
        (r as any)[c] = '2025-01-01';
      });
    }
  });

  while (rows.length < 25) {
    rows.push(makeEmpty());
  }

  return rows;
})();

const initialUserRows: UserRow[] = (() => {
  const rows: UserRow[] = [
    {
      email: 'aa@phoenixcontact.com.cn',
      name: 'aa',
      location: 'Blomberg',
      department: '-',
      group: '-',
      team: '-',
      responsibility: '-',
      type: 'Admin',
    },
    {
      email: 'bb@phoenixcontact.com.cn',
      name: 'bb',
      location: 'China',
      department: 'AMD',
      group: '-',
      team: '-',
      responsibility: '-',
      type: 'Department Manager',
    },
    {
      email: 'cc@phoenixcontact.com.cn',
      name: 'cc',
      location: 'China',
      department: 'AMD',
      group: 'CS',
      team: 'CS',
      responsibility: 'Project Management',
      type: 'Group Leader',
    },
    {
      email: 'dd@phoenixcontact.com.cn',
      name: 'dd',
      location: 'China',
      department: 'AMD',
      group: 'ATD',
      team: 'ATD',
      responsibility: 'Software',
      type: 'Engineer',
    },
    {
      email: 'ee@phoenixcontact.com.cn',
      name: 'ee',
      location: 'China',
      department: 'AMD',
      group: 'CS',
      team: 'CS',
      responsibility: 'Project Management',
      type: 'Project engineer',
      },
    {
      email: 'ff@phoenixcontact.com.cn',
      name: 'ff',
      location: 'China',
      department: 'AMD',
      group: 'AD',
      team: 'MCAD',
      responsibility: '3D',
      type: 'Engineer',
    },
  ];

  while (rows.length < 20) {
    rows.push({
      email: '',
      name: '',
      location: '',
      department: '',
      group: '',
      team: '',
      responsibility: '',
      type: '',
    });
  }

  return rows;
})();

const initialCalendarRows: CalendarRow[] = (() => {
  const rows: CalendarRow[] = [
    {
      weekNo: '1',
      month: 'January',
      day: '1st',
      weekday: 'Wednesday',
      type: 'Workday',
      available: '1',
      remark: '',
    },
    {
      weekNo: '1',
      month: 'January',
      day: '2nd',
      weekday: 'Thursday',
      type: 'Workday',
      available: '1',
      remark: '',
    },
    {
      weekNo: '1',
      month: 'January',
      day: '3th',
      weekday: 'Friday',
      type: 'Workday',
      available: '1',
      remark: '',
    },
    {
      weekNo: '1',
      month: 'January',
      day: '4th',
      weekday: 'Saturday',
      type: 'Weekend adjustment',
      available: '1',
      remark: '',
    },
    {
      weekNo: '1',
      month: 'January',
      day: '5th',
      weekday: 'Sunday',
      type: 'Weekend',
      available: '0',
      remark: '',
    },
    {
      weekNo: '2',
      month: 'January',
      day: '6th',
      weekday: 'Monday',
      type: 'Holiday time(Spring Festival)',
      available: '0',
      remark: '',
    },
    {
      weekNo: '2',
      month: 'January',
      day: '7th',
      weekday: 'Tuesday',
      type: 'Workday',
      available: '1',
      remark: '',
    },
    {
      weekNo: '2',
      month: 'January',
      day: '8th',
      weekday: 'Wednesday',
      type: 'Workday',
      available: '1',
      remark: '',
    },
    {
      weekNo: '2',
      month: 'January',
      day: '9th',
      weekday: 'Thursday',
      type: 'Workday',
      available: '1',
      remark: '',
    },
    {
      weekNo: '2',
      month: 'January',
      day: '10th',
      weekday: 'Friday',
      type: 'Workday',
      available: '1',
      remark: '',
    },
    {
      weekNo: '2',
      month: 'January',
      day: '11th',
      weekday: 'Saturday',
      type: 'Weekend',
      available: '0',
      remark: '',
    },
    {
      weekNo: '2',
      month: 'January',
      day: '12th',
      weekday: 'Sunday',
      type: 'Weekend',
      available: '0',
      remark: '',
    },
    {
      weekNo: '3',
      month: 'January',
      day: '13th',
      weekday: 'Monday',
      type: 'Holiday time in Company(Spring Festival)',
      available: '0',
      remark: '',
    },
    {
      weekNo: '3',
      month: 'January',
      day: '14th',
      weekday: 'Tuesday',
      type: 'Workday',
      available: '1',
      remark: '',
    },
    {
      weekNo: '3',
      month: 'January',
      day: '19th',
      weekday: 'Sunday',
      type: 'Workday',
      available: '1',
      remark: '',
    },
  ];

  while (rows.length < 30) {
    rows.push({
      weekNo: '',
      month: '',
      day: '',
      weekday: '',
      type: '',
      available: '',
      remark: '',
    });
  }

  return rows;
})();

/** Projects 总 Tab 下：Forecast / Planned 子界面 */
function ProjectsView() {
  const [activeProjectTab, setActiveProjectTab] = useState<ProjectTab>('Forecast');
  const [forecastRows, setForecastRows] = useState<ForecastRow[]>(initialForecastRows);
  const [plannedRows, setPlannedRows] = useState<PlannedRow[]>(initialPlannedRows);

  const forecastColumns = useMemo(
    () => [
      { prop: 'location', name: 'Location', size: 110 },
      { prop: 'department', name: 'Department', size: 120 },
      { prop: 'description', name: 'Project Description', size: 260 },
      { prop: 'bu', name: 'BU', size: 110 },
      { prop: 'probability', name: 'Order probability', size: 150 },
      { prop: 'price', name: 'Price', size: 150 },
      { prop: 'planHours1', name: 'Plan Hours', size: 110 },
      { prop: 'planHours2', name: 'Plan Hours', size: 110 },
    ],
    []
  );

  const plannedColumns = useMemo(
    () => [
      { prop: 'location', name: 'Location', size: 110 },
      { prop: 'department', name: 'Department', size: 120 },
      { prop: 'description', name: 'Project Description', size: 260 },
      { prop: 'bu', name: 'BU', size: 110 },
      { prop: 'budgetNumber', name: 'BudgetNumber', size: 130 },
      { prop: 'bm', name: 'BM', size: 90 },
      { prop: 'status', name: 'Status', size: 100 },
      { prop: 'price', name: 'Price', size: 150 },

      { prop: 'bm2Target', name: 'Bm2Target', size: 120 },
      { prop: 'bm2Plan', name: 'Bm2Plan', size: 120 },
      { prop: 'bm2Actual', name: 'Bm2Actual', size: 120 },
      { prop: 'bm3Target', name: 'Bm3Target', size: 120 },
      { prop: 'bm3Plan', name: 'Bm3Plan', size: 120 },
      { prop: 'bm3Actual', name: 'Bm3Actual', size: 120 },
      { prop: 'bm4Target', name: 'Bm4Target', size: 120 },
      { prop: 'bm4Plan', name: 'Bm4Plan', size: 120 },
      { prop: 'bm4Actual', name: 'Bm4Actual', size: 120 },
      { prop: 'bmMabsTarget', name: 'BmMabsTarget', size: 120 },
      { prop: 'bmMabsPlan', name: 'BmMabsPlan', size: 120 },
      { prop: 'bmMabsActual', name: 'BmMabsActual', size: 120 },

      { prop: 'bmF0tTarget', name: 'BmF0tTarget', size: 120 },
      { prop: 'bmF0tPlan', name: 'BmF0tPlan', size: 120 },
      { prop: 'bmF0tActual', name: 'BmF0tActual', size: 120 },
      { prop: 'bm5Target', name: 'Bm5Target', size: 120 },
      { prop: 'bm5Plan', name: 'Bm5Plan', size: 120 },
      { prop: 'bm5Actual', name: 'Bm5Actual', size: 120 },
      { prop: 'bm6Target', name: 'Bm6Target', size: 120 },
      { prop: 'bm6Plan', name: 'Bm6Plan', size: 120 },
      { prop: 'bm6Actual', name: 'Bm6Actual', size: 120 },
      { prop: 'bm7Target', name: 'Bm7Target', size: 120 },
      { prop: 'bm7Plan', name: 'Bm7Plan', size: 120 },
      { prop: 'bm7Actual', name: 'Bm7Actual', size: 120 },

      { prop: 'projectManager', name: 'ProjectManager', size: 150 },
      { prop: 'mechanicalDesign', name: 'Mechanical Design', size: 150 },
      { prop: 'electricalDesign', name: 'Electrical Design', size: 150 },
      { prop: 'purchaseManagement', name: 'Purchase Management', size: 160 },
      { prop: 'mechatronics', name: 'Mechatronics', size: 140 },
      { prop: 'imageProcessing', name: 'Image Processing', size: 160 },
      { prop: 'software', name: 'Software', size: 130 },
      { prop: 'maintenanceService', name: 'Maintenance Service', size: 170 },
    ],
    []
  );

  const plannedGridHeight = useMemo(
    () => 40 + plannedRows.length * 26,
    [plannedRows.length]
  );

  const handleForecastEdit = (e: any) => {
    const detail = e.detail || e || {};
    const rowIndex: number | undefined =
      detail.row ?? detail.rowIndex ?? detail.rowIdx;
    const prop: string | undefined =
      detail.prop ?? detail.column?.prop ?? detail.column?.name;
    const val: any = detail.val ?? detail.model?.[prop as string];

    if (typeof rowIndex !== 'number') return;
    if (typeof prop !== 'string') return;

    setForecastRows(prev => {
      if (!prev[rowIndex]) return prev;
      const next = [...prev];
      next[rowIndex] = {
        ...next[rowIndex],
        [prop]: val ?? '',
      } as ForecastRow;
      return next;
    });
  };

  const handlePlannedEdit = (e: any) => {
    const detail = e.detail || e || {};
    const rowIndex: number | undefined =
      detail.row ?? detail.rowIndex ?? detail.rowIdx;
    const prop: string | undefined =
      detail.prop ?? detail.column?.prop ?? detail.column?.name;
    const val: any = detail.val ?? detail.model?.[prop as string];

    if (typeof rowIndex !== 'number') return;
    if (typeof prop !== 'string') return;

    setPlannedRows(prev => {
      if (!prev[rowIndex]) return prev;
      const next = [...prev];
      next[rowIndex] = {
        ...next[rowIndex],
        [prop]: val ?? '',
      } as PlannedRow;
      return next;
    });
  };

  return (
    <div className="app-container">
      {/* Projects 顶部按钮栏：Forecast / Planned */}
      <div className="top-tabs">
        <div
          className={`tab-item ${activeProjectTab === 'Forecast' ? 'active' : ''}`}
          onClick={() => setActiveProjectTab('Forecast')}
        >
          Forecast
        </div>
        <div
          className={`tab-item ${activeProjectTab === 'Planned' ? 'active' : ''}`}
          onClick={() => setActiveProjectTab('Planned')}
        >
          Planned
        </div>
      </div>

      {/* ===== Forecast 子界面 ===== */}
      {activeProjectTab === 'Forecast' && (
        <>
          <div className="filter-row">
            <select className="filter-select">
              <option>BU</option>
            </select>
            <select className="filter-select">
              <option>Probability</option>
            </select>
          </div>

          <div className="wrapper">
            <div className="grid-container">
              <RevoGrid
                source={forecastRows}
                columns={forecastColumns}
                rowHeaders
                range
                clipboard
                // @ts-ignore
                onAfterEdit={handleForecastEdit}
                // @ts-ignore
                onAfteredit={handleForecastEdit}
              />
            </div>
          </div>
        </>
      )}

      {/* ===== Planned 子界面 ===== */}
      {activeProjectTab === 'Planned' && (
        <>
          <div className="filter-row">
            <select className="filter-select">
              <option>BU</option>
            </select>
            <select className="filter-select">
              <option>BudgetNumber</option>
            </select>
            <select className="filter-select">
              <option>BM</option>
            </select>
            <select className="filter-select">
              <option>Status</option>
            </select>
          </div>

          <div className="wrapper">
            <div
              className="grid-container"
              style={{ height: plannedGridHeight, maxHeight: plannedGridHeight }}
            >
              <RevoGrid
                source={plannedRows}
                columns={plannedColumns}
                rowHeaders
                range
                clipboard
                style={{ height: '100%' }}
                // @ts-ignore
                onAfterEdit={handlePlannedEdit}
                // @ts-ignore
                onAfteredit={handlePlannedEdit}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Admin 总 Tab 下：User / Calendar 子界面 */
function AdminView() {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('User');
  const [userRows, setUserRows] = useState<UserRow[]>(initialUserRows);
  const [calendarRows, setCalendarRows] =
    useState<CalendarRow[]>(initialCalendarRows);

  const userColumns = useMemo(
    () => [
      { prop: 'email', name: 'E-mail Address', size: 220 },
      { prop: 'name', name: 'Name', size: 120 },
      { prop: 'location', name: 'Location', size: 130 },
      { prop: 'department', name: 'Department', size: 130 },
      { prop: 'group', name: 'Group', size: 120 },
      { prop: 'team', name: 'Team', size: 120 },
      { prop: 'responsibility', name: 'Responsibility', size: 180 },
      { prop: 'type', name: 'Type', size: 150 },
    ],
    []
  );

  const calendarColumns = useMemo(
    () => {
      const typeSource = [
        { label: 'Workday', value: 'Workday' },
        { label: 'Weekend', value: 'Weekend' },
        { label: 'Holiday time', value: 'Holiday time' },
        { label: 'Weekend adjustment', value: 'Weekend adjustment' },
        { label: 'Holiday time in Company', value: 'Holiday time in Company' },
        { label: 'Custom holiday', value: 'Custom holiday' },
      ];

      return [
        { prop: 'weekNo', name: 'Week No.', size: 90 },
        { prop: 'month', name: 'Month', size: 110 },
        { prop: 'day', name: 'Day', size: 120 },
        { prop: 'weekday', name: 'day of the week', size: 150 },
        {
          prop: 'type',
          name: 'Type',
          size: 260,
          columnType: 'select',
          labelKey: 'label',
          valueKey: 'value',
          source: typeSource,
        },
        {
          prop: 'available',
          name: 'Available Work Time(Day)',
          size: 190,
        },
        { prop: 'remark', name: 'Remark', size: 160 },
      ];
    },
    []
  );

  // 注册 RevoGrid 下拉列类型
  const columnTypes = useMemo(
    () => ({
      select: new SelectTypePlugin(),
    }),
    []
  );

  const handleUserEdit = (e: any) => {
    const detail = e.detail || e || {};
    const rowIndex: number | undefined =
      detail.row ?? detail.rowIndex ?? detail.rowIdx;
    const prop: string | undefined =
      detail.prop ?? detail.column?.prop ?? detail.column?.name;
    const val: any = detail.val ?? detail.model?.[prop as string];

    if (typeof rowIndex !== 'number') return;
    if (typeof prop !== 'string') return;

    setUserRows(prev => {
      if (!prev[rowIndex]) return prev;
      const next = [...prev];
      next[rowIndex] = {
        ...next[rowIndex],
        [prop]: val ?? '',
      } as UserRow;
      return next;
    });
  };

  const handleCalendarEdit = (e: any) => {
    const detail = e.detail || e || {};
    const rowIndex: number | undefined =
      detail.row ?? detail.rowIndex ?? detail.rowIdx;
    const prop: string | undefined =
      detail.prop ?? detail.column?.prop ?? detail.column?.name;
    const val: any = detail.val ?? detail.model?.[prop as string];

    if (typeof rowIndex !== 'number') return;
    if (typeof prop !== 'string') return;

    setCalendarRows(prev => {
      if (!prev[rowIndex]) return prev;
      const next = [...prev];
      next[rowIndex] = {
        ...next[rowIndex],
        [prop]: val ?? '',
      } as CalendarRow;
      return next;
    });
  };

  return (
    <div className="app-container">
      {/* Admin 顶部按钮栏：User / Calendar */}
      <div className="top-tabs">
        <div
          className={`tab-item ${activeAdminTab === 'User' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('User')}
        >
          User
        </div>
        <div
          className={`tab-item ${activeAdminTab === 'Calendar' ? 'active' : ''}`}
          onClick={() => setActiveAdminTab('Calendar')}
        >
          Calendar
        </div>
      </div>

      {/* ===== User 子界面 ===== */}
      {activeAdminTab === 'User' && (
        <>
          {/* 筛选行：Location / Department / Group / Team / Type */}
          <div className="filter-row">
            <select className="filter-select">
              <option>Location</option>
            </select>
            <select className="filter-select">
              <option>Department</option>
            </select>
            <select className="filter-select">
              <option>Group</option>
            </select>
            <select className="filter-select">
              <option>Team</option>
            </select>
            <select className="filter-select">
              <option>Type</option>
            </select>
          </div>

          <div className="wrapper">
            <div className="grid-container">
              <RevoGrid
                source={userRows}
                columns={userColumns}
                rowHeaders
                range
                clipboard
                // @ts-ignore
                onAfterEdit={handleUserEdit}
                // @ts-ignore
                onAfteredit={handleUserEdit}
              />
            </div>
          </div>
        </>
      )}

      {/* ===== Calendar 子界面 ===== */}
      {activeAdminTab === 'Calendar' && (
        <>
          {/* 筛选行：Location / Department / Year / Month */}
          <div className="filter-row">
            <select className="filter-select">
              <option>Location</option>
            </select>
            <select className="filter-select">
              <option>Department</option>
            </select>
            <select className="filter-select">
              <option>Year</option>
            </select>
            <select className="filter-select">
              <option>Month</option>
            </select>
          </div>

          <div className="wrapper">
            <div className="grid-container">
              <RevoGrid
                source={calendarRows}
                columns={calendarColumns as any}
                rowHeaders
                range
                clipboard
                columnTypes={columnTypes}
                // @ts-ignore
                onAfterEdit={handleCalendarEdit}
                // @ts-ignore
                onAfteredit={handleCalendarEdit}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function MainLayout() {
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTab>('Capacity');
  const bottomTabs: BottomTab[] = ['Capacity', 'Projects', 'Admin'];

  return (
    <div className="main-layout">
      {/* 中间内容区：根据底栏 Tab 切换 */}
      <div className="content-area">
        {activeBottomTab === 'Capacity' && <App />}

        {activeBottomTab === 'Projects' && <ProjectsView />}

        {activeBottomTab === 'Admin' && <AdminView />}
      </div>

      {/* 底栏总 Tab：Capacity / Projects / Admin */}
      <div className="bottom-nav">
        {bottomTabs.map(name => (
          <div
            key={name}
            className={`bottom-item ${activeBottomTab === name ? 'active' : ''}`}
            onClick={() => setActiveBottomTab(name)}
          >
            {name === 'Capacity' && '📈 '}
            {name === 'Projects' && '≡ '}
            {name === 'Admin' && '👤 '}
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
