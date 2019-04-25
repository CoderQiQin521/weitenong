const ApiUrl = 'https://weitenong.dd371.com/api/'

const Api = {
  default: {
    pay: ApiUrl + 'pay/pays_order'
  },
  user: {

  },
  goods: {
    search: ApiUrl + 'index/search'
  },
  shop: {

  },
  order: {

  },
  express: {
    status: ApiUrl + 'express/express_status',
    changeStatus: ApiUrl + 'express/change_status',
    unlock: ApiUrl + 'user_unlock_success'
  }
}

module.exports = {
  ApiLogin: ApiUrl + 'login/login',
  ApiLogo: ApiUrl + 'login/logo',
  ApiUserIndex: ApiUrl + 'user/index',
  ApiIndex: ApiUrl + 'index/index',
  ApiIndexMore: ApiUrl + 'index/more',
  ApiIndexKinds: ApiUrl + 'index/kinds',
  ApiShop: ApiUrl + 'shop/index',
  ApiAbout: ApiUrl + 'about/index',
  ApiHelp: ApiUrl + 'user/help',
  ApiShopSearch: ApiUrl + 'shop/search',
  ApiShopCollect: ApiUrl + 'shop/collect',
  ApiShopSearchLister: ApiUrl + 'shop/search_lister',
  ApiGoodsDetail: ApiUrl + 'goods/detail',
  ApiGoodsCollect: ApiUrl + 'goods/collect',
  ApiGoodsSpec: ApiUrl + 'goods/spec',
  ApiGoodsAddCar: ApiUrl + 'goods/add_car',
  ApiGoodsAssess: ApiUrl + 'goods/goods_assess',
  ApiAddrDefault: ApiUrl + 'user/addr_default',
  ApiCarLister: ApiUrl + 'car/lister',
  ApiCarOne: ApiUrl + 'car/change',
  ApiCarAll: ApiUrl + 'car/change_all',
  ApiCarShopAll: ApiUrl + 'car/shop_change_all',
  ApiCarNum: ApiUrl + 'car/num',
  ApiCarDelete: ApiUrl + 'car/delete_car',
  ApiCarBuy: ApiUrl + 'car/buy',
  ApiGoodsBuy: ApiUrl + 'goods/go_buy',
  ApiUserCollect: ApiUrl + 'user/my_collect',
  ApiUserShopCollect: ApiUrl + 'user/my_shop_collect',
  ApiUserAddr: ApiUrl + 'user/addr',
  ApiUserMydd: ApiUrl + 'user/my_dd',
  ApiUserGetCode: ApiUrl + 'user/getcode',
  ApiGoodsSdd: ApiUrl + 'goods/sdd',
  ApiCarPan: ApiUrl + 'car/pan',
  ApiUserAddrsave: ApiUrl + 'user/addr_save',
  ApiUserAddrUsave: ApiUrl + 'user/addr_usave',
  ApiUserAddrDetail: ApiUrl + 'user/addr_detail',
  ApiUserChange: ApiUrl + 'user/change',
  ApiUserAddrDel: ApiUrl + 'user/addr_detele',
  ApiPay: ApiUrl + 'pay/pays',
  ApiOrderDelete: ApiUrl + 'user/delete_dd',
  ApiUserReason: ApiUrl + 'user/reason',
  ApiShopApply: ApiUrl + 'shop/apply',
  ApiShopApplySave: ApiUrl + 'shop/apply_save',
  ApiUserTakegoods: ApiUrl + 'user/take_goods',
  ApiUserAssess: ApiUrl + 'user/goods_assess',
  ApiSaveAssess: ApiUrl + 'user/save_assess',
  ApiUserDetaildd: ApiUrl + 'user/detail_dd',
  ApiUserTui: ApiUrl + 'user/tui',
  ApiExpressBind: ApiUrl + 'express/user_express',
  ApiGetCode: ApiUrl + 'user/getcode',
  ApiSavePhone: ApiUrl + 'user/save_phone',
  ApiExpressStatus: ApiUrl + 'express/express_status',
  ApiExpressUserype: ApiUrl + 'express/user_type',
  ApiExpressSave: ApiUrl + 'express/save',
  ApiExpressOtherSave: ApiUrl + 'express/other_save',
  ApiExpressPay: ApiUrl + 'pay/pays_order',
  ApiExpressUserLock: ApiUrl + 'express/user_unlock',
  ApiExpressJugdeDd: ApiUrl + 'express/jugde_dd',
  ApiExpressOtherUnlock: ApiUrl + 'express/other_unlock',
  Api
}