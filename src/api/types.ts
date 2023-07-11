import { Method } from 'axios';

export type TaskStatus = 'doing';
export type TaskType = 'devel';
export type StoryStatus = 'active';
export type ExecutionType = 'kanban';
export type ProjectStatus = 'doing';
export type ProjectModel = 'kanban';
export type CurrencyUnit = 'USD';
export type ACL = 'private';

export type DateTimeType = `${number}-${number}-${number} ${number}:${number}:${number}`;
export type DateType = `${number}-${number}-${number}`;

export type Task = {
  id: `${number}`;
  project: `${number}`;
  parent: `${number}`;
  execution: `${number}`;
  module: `${number}`;
  design: `${number}`;
  story: `${number}`;
  storyVersion: `${number}`;
  designVersion: `${number}`;
  fromBug: `${number}`;
  feedback: `${number}`;
  fromIssue: `${number}`;
  name: string;
  type: TaskType;
  mode: string;
  pri: `${number}`;
  estimate: `${number}`;
  consumed: `${number}`;
  left: `${number}`;
  deadline: DateType;
  status: TaskStatus;
  subStatus: string;
  color: string;
  mailto: null | string;
  desc: string;
  version: `${number}`;
  openedBy: string;
  openedDate: DateTimeType;
  assignedTo: string;
  assignedDate: DateTimeType;
  estStarted: DateType;
  realStarted: DateTimeType;
  finishedBy: string;
  finishedDate: DateTimeType;
  finishedList: string;
  canceledBy: string;
  canceledDate: DateTimeType;
  closedBy: string;
  closedDate: DateTimeType;
  planDuration: `${number}`;
  realDuration: `${number}`;
  closedReason: string;
  lastEditedBy: string;
  lastEditedDate: DateTimeType;
  activatedDate: DateTimeType;
  order: `${number}`;
  repo: `${number}`;
  mr: `${number}`;
  entry: string;
  lines: string;
  v1: string;
  v2: string;
  deleted: `${number}`;
  vision: 'rnd';
  executionID: `${number}`;
  executionName: string;
  projectName: string;
  executionMultiple: `${number}`;
  executionType: ExecutionType;
  storyID: `${number}`;
  storyTitle: string;
  storyStatus: StoryStatus;
  latestStoryVersion: `${number}`;
  priOrder: `${number}`;
  needConfirm: boolean;
  progress: number;
};

export type Project = {
  id: `${number}`;
  root: `${number}`;
  type: 'project';
  account: string;
  role: string;
  position: string;
  limited: 'no' | 'yes';
  join: DateType;
  days: `${number}`;
  hours: `${number}`;
  estimate: `${number}`;
  consumed: `${number}`;
  left: `${number}`;
  order: `${number}`;
  project: `${number}`;
  model: ProjectModel;
  lifetime: string;
  budget: `${number}`;
  budgetUnit: CurrencyUnit;
  attribute: string;
  percent: `${number}`;
  milestone: `${number}`;
  output: string;
  auth: 'extend';
  parent: `${number}`;
  path: `${number | ''},${number | ''},${number | ''}`;
  grade: `${number}`;
  name: string;
  code: string;
  hasProduct: `${number}`;
  begin: DateType;
  end: DateType;
  realBegan: DateType;
  realEnd: DateType;
  status: ProjectStatus;
  subStatus: string;
  pri: `${number}`;
  desc: string;
  version: `${number}`;
  parentVersion: `${number}`;
  planDuration: `${number}`;
  realDuration: `${number}`;
  openedBy: string;
  openedDate: DateTimeType;
  openedVersion: string;
  lastEditedBy: string;
  lastEditedDate: DateTimeType;
  closedBy: string;
  closedDate: DateTimeType;
  canceledBy: string;
  canceledDate: DateTimeType;
  suspendedDate: DateType;
  PO: string;
  PM: string;
  QD: string;
  RD: string;
  team: string;
  acl: ACL;
  whitelist: string;
  vision: 'rnd';
  division: `${number}`;
  displayCards: `${number}`;
  fluidBoard: `${number}`;
  multiple: `${number}`;
  colWidth: `${number}`;
  minColWidth: `${number}`;
  maxColWidth: `${number}`;
  deleted: `${number}`;
  progress: number;
  waitTasks: number;
  doneTasks: number;
  taskTotal: number;
  totalConsumed: number;
  assignedToMeTasks: number;
};

export type Exectution = {
  id: string;
  name: string;
  projectName: string;
  project: string;
};

export type ExecutionStatus = 'doing' | 'done';

export type Execution = {
  id: `${number}`;
  project: `${number}`;
  model: string;
  type: ExecutionType;
  lifetime: string;
  budget: `${number}`;
  budgetUnit: 'CNY';
  attribute: string;
  percent: `${number}`;
  milestone: `${number}`;
  output: string;
  auth: string;
  parent: `${number}`;
  path: `${number | ''},${number | ''},${number | ''},${number | ''}`;
  grade: `${number}`;
  name: string;
  code: string;
  hasProduct: `${number}`;
  begin: DateType;
  end: DateType;
  realBegan: DateType;
  realEnd: DateType;
  days: `${number}`;
  status: ExecutionStatus;
  subStatus: string;
  pri: `${number}`;
  desc: string;
  version: `${number}`;
  parentVersion: `${number}`;
  planDuration: `${number}`;
  realDuration: `${number}`;
  openedBy: string;
  openedDate: DateTimeType;
  openedVersion: `${number}`;
  lastEditedBy: string;
  lastEditedDate: DateTimeType;
  closedBy: string;
  closedDate: DateTimeType;
  canceledBy: string;
  canceledDate: DateTimeType;
  suspendedDate: DateType;
  PO: string;
  PM: string;
  QD: string;
  RD: string;
  team: string;
  acl: ACL;
  whitelist: string;
  order: `${number}`;
  vision: 'rnd';
  division: `${number}`;
  displayCards: `${number}`;
  fluidBoard: `${number}`;
  multiple: `${number}`;
  colWidth: `${number}`;
  minColWidth: `${number}`;
  maxColWidth: `${number}`;
  deleted: `${number}`;
  totalHours: `${number}`;
  totalEstimate: null;
  totalConsumed: number;
  totalLeft: number;
};

export type Effort = {
  id: `${number}`;
  objectType: 'task';
  objectID: `${number}`;
  product: `${number | ''},${number | ''},${number | ''}`;
  project: `${number}`;
  execution: `${number}`;
  account: string;
  work: string;
  vision: 'rnd';
  date: DateType;
  left: `${number}`;
  consumed: `${number}`;
  begin: string;
  end: string;
  extra: null;
  order: `${number}`;
  deleted: `${number}`;
};

export type ActionType = 'activated' | 'recordestimate' | 'opened' | 'finished';

export type ActionHistoryItem = {
  id: `${number}`;
  action: `${number}`;
  field: 'consumed';
  old: `${number}`;
  new: `${number}`;
  diff: string;
};

export type Action = {
  id: `${number}`;
  objectType: 'task';
  objectID: `${number}`;
  product: `${number | ''},${number | ''},${number | ''}`;
  project: `${number}`;
  execution: `${number}`;
  actor: string;
  action: ActionType;
  date: DateTimeType;
  comment: string;
  extra: string;
  read: `${number}`;
  vision: 'rnd';
  efforted: `${number}`;
  history: ActionHistoryItem[];
};

export type EffortListData = {
  title: 'Estimates';
  task: Task;
  execution: ExecutionType;
  members: Record<string, string>;
  actions: Record<string, Action>;
  from: '';
  orderBy: 'id_desc';
  efforts: Effort[];
  users: Record<string, string>;
  taskEffortFold: number;
  pager: null;
};

/**
 * 支持的禅道请求方式，影响 API 请求 URL 构建方式
 */
export type ZentaoRequestType = 'PATH_INFO' | 'GET';

/**
 * 禅道请求参数键值对
 */
export type ZentaoRequestParamPair = any[]; // [name: string, value: string]

/**
 * 禅道请求参数
 */
export type ZentaoRequestParams = Array<ZentaoRequestParamPair> | string[] | string | Record<string, any>;

/**
 * 禅道 API 请求方式
 */
export type ZentaoRequestMethod = Method;

/**
 * 禅道 API 返回结果
 */
export interface ZentaoApiResult<DataType extends Record<string, any> = Record<string, any>> {
  /**
   * 状态
   *
   * @remarks
   * 如果为 `0` 则表示操作请求失败，如果为 `1`，表示操作请求成功
   */
  status: 'success' | 'error';

  /**
   * 服务器返回的描述结果的文本
   */
  md5?: string;

  /**
   * 请求结果数据
   */
  data?: DataType;
}

/**
 * 禅道 API 初始化选项
 */
export interface ZentaoOptions {
  /**
   * 禅道服务器地址
   */
  readonly url: string;

  /**
   * 请求形式
   */
  readonly accessMode?: ZentaoRequestType;

  /**
   * 是否将 token 存储到本地，如果设置为 `false`，则每次创建新的 `Zentao` 实例都会在首次调用 API 之前重新获取 Token
   */
  readonly preserveToken?: boolean;

  /**
   * 当前 `Zentao` 实例名称
   */
  readonly sessionName?: string;

  /**
   * 如果设置为 `true`，则会在控制台输出详细日志
   */
  readonly debug?: boolean;
}
