var posturl;
posturl = {
  host: 'http://xchcar.com/served',
  picBaseUrl: 'http://xchcar.com/served/',
  getCaptcha: '/index/user/sendRegisterSms',
  login: '/index/user/login',
  BrandLists: '/admin/Vehicle_Brand/lists',
  findSeriesByBrand: '/admin/Vehicle_Brand/findSeries',
  brandFind: '/admin/Vehicle_Brand/find',
  SeriesFind: '/admin/Vehicle_Series/find',
  carLsit: '/index/vehicle/lists',
  carAdd: '/index/vehicle/add',
  carEdit: '/index/vehicle/edit',
  orderLists: '/index/evalate/orderLists',
  carDel: '/index/vehicle/del',
  defaultCar: '/index/vehicle/assigns',
  feedback: '/index/evalate/suggestAdd',
  sendAvatar: '/index/user/picture',
  shopList: '/admin/shop/lists',
  getQueueByShop: '/index/Project/lineShop',
  userInfo: '/index/user/lists',
  userInfoEdit: '/index/user/edit',
  commentAdd: '/index/evalate/evaluateAdd',
  findProjectByCar: '/index/Project/lists',
  createOrder: '/index/Pay/orderAdd',
  projectList: '/admin/project/lists',
  export: '/admin/order/export',
  ProjectQueue: '/index/Project/project_line',
  shopLine: '/index/Project/shopLine',

  test: '/index/test/test',
};

global.posturl=posturl;
