const basicGoods = [
  {
    id: '1234561',
    name: '矿泉水 550ml',
    barcode: '12421432143214321',
    price: '2.00',
    num: '1',
    amount: '2.00',
  },
  {
    id: '1234562',
    name: '凉茶 300ml',
    barcode: '12421432143214322',
    price: '3.00',
    num: '2',
    amount: '6.00',
  },
  {
    id: '1234563',
    name: '好吃的薯片',
    barcode: '12421432143214323',
    price: '7.00',
    num: '4',
    amount: '28.00',
  },
  {
    id: '1234564',
    name: '特别好吃的蛋卷',
    barcode: '12421432143214324',
    price: '8.50',
    num: '3',
    amount: '25.50',
  },
];

const basicProgress = [
  {
    key: '1',
    time: '2017-10-01 14:10',
    rate: '联系客户',
    status: 'processing',
    operator: '取货员 ID1234',
    cost: '5mins',
  },
  {
    key: '2',
    time: '2017-10-01 14:05',
    rate: '取货员出发',
    status: 'success',
    operator: '取货员 ID1234',
    cost: '1h',
  },
  {
    key: '3',
    time: '2017-10-01 13:05',
    rate: '取货员接单',
    status: 'success',
    operator: '取货员 ID1234',
    cost: '5mins',
  },
  {
    key: '4',
    time: '2017-10-01 13:00',
    rate: '申请审批通过',
    status: 'success',
    operator: '系统',
    cost: '1h',
  },
  {
    key: '5',
    time: '2017-10-01 12:00',
    rate: '发起退货申请',
    status: 'success',
    operator: '用户',
    cost: '5mins',
  },
];

const advancedOperation1 = [
  {
    key: 'op1',
    type: '书写压痕辩读111',
    name: ' ',
    status: '1',
    updatedAt: '这里是备注',
  },
  {
    key: 'op2',
    type: '印刷文件制作方式鉴定',
    name: '文件是通过何种办公机具或印刷机具制作',
    status: '2',
    updatedAt: '文件是通过何种办公机具或印刷机具制作',
  },
  {
    key: 'op3',
    type: '文书鉴定',
    name: '文书鉴定的准确性',
    status: '1',
    updatedAt: '这里是文书鉴定的备注',
  },
];

const advancedOperation2 = [
  {
    key: 'oop1',
    name: '王帅',
    minzu: '汉',
    dxlx: '人',
    six: '男',
    age: '23',
    zhuzhi: '江浦区',
    idCode: '320123199510131123',
    phoneuser: '王大帅',
    phone: '15852258568',
    beizhu: '这里是备注',
  },
  {
    key: 'oop2',
    name: '林欣宇',
    minzu: '汉',
    dxlx: '人',
    six: '男',
    age: '23',
    zhuzhi: '建邺区',
    idCode: '320123199610131123',
    phoneuser: '林更新',
    phone: '15852258568',
    beizhu: '这里是备注',
  },
];

const advancedOperation4 = [
  {
    key: 'oop1',
    mc: '王帅',
    cllx: '自行车',
    dxlx: '车',
    pp: '凤凰牌',
    clsbdm: '苏A123456',
    tfdd: '江浦区',
    lxr: '袁亮',
    lxdh: '15855555555',
    bz: '这里是备注',
  },
  {
    key: 'oop2',
    mc: '王帅',
    cllx: '自行车',
    dxlx: '车',
    pp: '凤凰牌',
    clsbdm: '苏A123456',
    tfdd: '江浦区',
    lxr: '王帅',
    lxdh: '15855555555',
    bz: '这里是备注',
  },
];

const advancedOperation5 = [
  {
    key: 'oop1',
    mc: '字画',
    lxr: '王帅',
    dxlx: '物',
    lxdh: '15855555555',
    bz: '这里是备注',
  },
  {
    key: 'oop2',
    mc: '字画',
    lxr: '袁亮',
    dxlx: '物',
    lxdh: '15855555555',
    bz: '这里是备注',
  },
];

const advancedOperation3 = [
  {
    key: 'opp1',
    cl: '笔记',
    lx: '书写笔记',
    sl: '1',
    gg: '暂无规格',
    jssj: '2017-10-03  19:23:12',
    clxz: '纸张',
    clfs: '文书鉴定',
    bz: '备注',
    wj: `这里是文件`,
  },
  {
    key: 'opp2',
    cl: '笔记',
    lx: '书写笔记',
    sl: '1',
    gg: '暂无规格',
    jssj: '2017-10-03  19:23:12',
    clxz: '纸张',
    clfs: '文书鉴定',
    bz: '备注',
    wj: `这里是文件`,
  },
];

const advancedOperation6 = [
  {
    key: 'opp1',
    sfxm: '笔记鉴定',
    sflb: '单笔支付',
    sl: '1',
    dj: '599.00',
    yhje: '99.00',
    ysxj: '500.00',
    bz: '备注',
  },
  {
    key: 'opp2',
    sfxm: '笔记鉴定',
    sflb: '单笔支付',
    sl: '1',
    dj: '599.00',
    yhje: '99.00',
    ysxj: '500.00',
    bz: '备注',
  },
];

const getProfileBasicData = {
  basicGoods,
  basicProgress,
};

const getProfileAdvancedData = {
  advancedOperation1,
  advancedOperation2,
  advancedOperation3,
  advancedOperation4,
  advancedOperation5,
  advancedOperation6,
};

export default {
  'GET /lab/profile/advanced': getProfileAdvancedData,
  'GET /lab/profile/basic': getProfileBasicData,
};
