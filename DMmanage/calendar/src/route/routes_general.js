import Role from 'common/js/role.js'



const Home = resolve => require(['../pages/Home.vue'], resolve)

const Trafficsources = resolve => require(['../pages/commonality/Trafficsources.vue'], resolve)

const Overview = resolve => require(['../pages/ibs/account/Overview.vue'], resolve)



const Campaigns = resolve => require(['../pages/ibs/popularize/Campaigns.vue'], resolve)

const CampaignStaffs = resolve => require(['../pages/ibs/popularize/CampaignStaffs.vue'], resolve)
const CampaignWorks = resolve => require(['../pages/ibs/popularize/CampaignWorks.vue'], resolve)

const Valetproductions = resolve => require(['../pages/ibs/popularize/Valetproductions.vue'], resolve)
const Uploadphotos = resolve => require(['../pages/ibs/popularize/Uploadphotos.vue'], resolve)
const Modifyphotos = resolve => require(['../pages/ibs/popularize/Modifyphotos.vue'], resolve)
const Overview2 = resolve => require(['../pages/ibs/popularize/Overview.vue'], resolve)

const Distribution = resolve => require(['../pages/ibs/popularize/Distribution.vue'], resolve)
const SalesStatistics = resolve => require(['../pages/ibs/popularize/SalesStatistics.vue'], resolve)


const Accounts = resolve => require(['../pages/ibs/account/Accounts.vue'], resolve)
const TransactionRecord = resolve => require(['../pages/ibs/account/TransactionRecord.vue'], resolve)

const MineOrder = resolve => require(['../pages/ibs/order/MineOrder.vue'], resolve)
const OrderDetail = resolve => require(['../pages/ibs/order/OrderDetail.vue'], resolve)
const WorkDetail = resolve => require(['../pages/ibs/order/WorkDetail.vue'], resolve)
const ShopOrder = resolve => require(['../pages/ibs/order/ShopOrder.vue'], resolve)

const Cooperative = resolve => require(['../pages/ibs/general/Cooperative.vue'], resolve)
const Customerservice = resolve => require(['../pages/ibs/general/Customerservice.vue'], resolve)
const Oneonone = resolve => require(['../pages/ibs/frequently/Oneonone.vue'], resolve)

const ProductADEditor = resolve => require(['../pages/ibs/product/ProductADEditor.vue'], resolve)
const ShareADEditor = resolve => require(['../pages/ibs/product/ShareADEditor.vue'], resolve)
const AdvertisingSet = resolve => require(['../pages/ibs/product/AdvertisingSet.vue'], resolve)
const AlreadySignUp = resolve => require(['../pages/ibs/product/AlreadySignUp.vue'], resolve)
const Userdetails = resolve => require(['../pages/ibs/product/Userdetails.vue'], resolve)



const FactoryOrder = resolve => require(['../pages/pbs/FactoryOrder.vue'], resolve)
const AccountInfo = resolve => require(['../pages/pbs/AccountInfo.vue'], resolve)
const LogisticsInfo = resolve => require(['../pages/pbs/LogisticsInfo.vue'], resolve)
// CalendarAgency代理商 CalendarTrafficsource推广者
let routes = [
        {
            path: '/',
            component: Home,
            name: '参与单位管理',
            label: '名下企业管理',
            meta:{},
            iconCls: 'fa fa-address-card',//图标样式class
            privileges:Role.CalendarAgency,
            children: [
                { path: '/partnerTrafficsources', component: Trafficsources, name: 'Trafficsources', meta:{label:"企业商户管理"}}
            ]
        },
        {
            path: '/',
            component: Home,
            name: '代理商账户',
            label: '账户',
            iconCls: 'fa fa-credit-card-alt',//图标样式class
            privileges:Role.CalendarAgency,
            children: [
                { path: '/overview', component: Overview, name: 'Overview', meta:{label:"账户总览"} },
                { path: '/transactions', component: TransactionRecord, name: 'TransactionRecord', meta:{label:"账户流水明细"} }
            ]
        },
        {
            path: '/',
            component: Home,
            name: '发动DM+活动',
            label: '发动DM+活动',
            meta:{keepAlive: true},
            iconCls: 'fa  fa-users',//图标样式class
            privileges:Role.CalendarTrafficsource,
            children: [
                { path: '/campaigns', component: Campaigns, name: 'Campaigns', meta:{label:"大型DM+活动"}},
                { path: '/campaign/staffs', component: CampaignStaffs, name: 'CampaignStaffs', meta:{label:"员工权限设置"}, hidden: true},
                { path: '/campaign/works', component: CampaignWorks, name: 'CampaignWorks', meta:{label:"客户制作进度"}, hidden: true},                     
                // { path: '/valetproductions/Upload', component: Uploadphotos, name: 'Uploadphotos', meta:{label:"上传照片"}, hidden: true},
                // { path: '/valetproductions/Modify', component: Modifyphotos, name: 'Modifyphotos', meta:{label:"帮助修改"}, hidden: true},
                { path: '/Distribution', component: Distribution, name: 'Distribution', meta:{label:"分销DM活动"}},      
                { path: '/Distribution/SalesStatistics', component: SalesStatistics, name: 'SalesStatistics', meta:{label:"销售统计"}, hidden: true}
                // { path: '/valetproductions', component: Valetproductions, name: 'Valetproductions', meta:{label:"代客制作活动"}},  
            ]
        },
        {
            path: '/',
            component: Home,
            name: '每日DM+',
            label: '每日DM+',
            iconCls: 'fa fa-paint-brush',
            privileges:Role.CalendarTrafficsource,
            children: [
                { path: '/valetproductions/Upload', component: Uploadphotos, name: 'Uploadphotos', meta:{label:"上传照片"}, hidden: true},
                { path: '/valetproductions/Modify', component: Modifyphotos, name: 'Modifyphotos', meta:{label:"帮助修改"}, hidden: true},
                { path: '/valetproductions', component: Valetproductions, name: 'Valetproductions', meta:{label:"每日代客制作"}},
                { path: '/Oneonone', component: Oneonone, name: 'Oneonone', meta:{label:"每日1对1DM"}}
            ]
        },
        {
            path: '/',
            component: Home,
            name: '本店',
            label: '本店',
            iconCls: 'fa fa-home',//图标样式class
            privileges:Role.CalendarTrafficsource,
            children: [
                { path: '/orders_mine', component: MineOrder, name: 'MineOrder', meta:{label:"本店订单"}},
                { path: '/order/detail', component: OrderDetail, name: 'OrderDetail', meta:{label:"订单详情"}, hidden: true},
                { path: '/stuffs', component: Accounts, name: 'Accounts', meta:{label:"本店账号管理", keepAlive: true}},
                { path: '/shop_order', component: ShopOrder, name: 'ShopOrder', meta:{label:"商城订单", keepAlive: true}},
//              { path: '/product_ad_editor', component: ProductADEditor, name: 'ProductADEditor', meta:{label:"产品广告设置"}},
//              { path: '/share_ad_editor', component: ShareADEditor, name: 'ShareADEditor', meta:{label:"分享广告效果"}},
//              { path: '/share_ad_editor/AdvertisingSet', component:AdvertisingSet, name: 'AdvertisingSet', meta:{label:"广告设置"}, hidden: true},
//              { path: '/share_ad_editor/AlreadySignUp', component:AlreadySignUp, name: 'AlreadySignUp', meta:{label:"已报名客户"}, hidden: true},
//          	{ path: '/share_ad_editor/Userdetails', component:Userdetails, name: 'Userdetails', meta:{label:"用户详情"}, hidden: true}

            ]
        },
        {
            path: '/',
            component: Home,
            name: '广告管理',
            label: '广告管理',
            iconCls: 'fa fa-wrench',//图标样式class
            privileges:Role.CalendarTrafficsource,
            children: [            
               
                { path: '/share_ad_editor', component: ShareADEditor, name: 'ShareADEditor', meta:{label:"分享传播广告"}},
                { path: '/share_ad_editor/AdvertisingSet', component:AdvertisingSet, name: 'AdvertisingSet', meta:{label:"广告设置"}, hidden: true},
                { path: '/share_ad_editor/AlreadySignUp', component:AlreadySignUp, name: 'AlreadySignUp', meta:{label:"已报名客户"}, hidden: true},
            	{ path: '/share_ad_editor/Userdetails', component:Userdetails, name: 'Userdetails', meta:{label:"用户详情"}, hidden: true},
            	{ path: '/product_ad_editor', component: ProductADEditor, name: 'ProductADEditor', meta:{label:"实物印刷广告"}},
            ]
        },
        {
            path: '/',
            component: Home,
            name: '账户充值',
            label: '账户充值',
            iconCls: 'fa fa-credit-card-alt',//图标样式class
            privileges:Role.CalendarTrafficsource,
            children: [
                { path: '/overview2', component: Overview2, name: 'Overview2', meta:{label:"充值缴费"} },
                { path: '/transactions', component: TransactionRecord, name: 'TransactionRecord', meta:{label:"账户流水明细"} },
             
            ]
        },
        {
            path: '/',
            component: Home,
            name: '系统',
            label: '系统',
            iconCls: 'el-icon-setting',
            privileges:Role.CalendarTrafficsource | Role.CalendarAgency,
            children: [
                { path: '/cooperative', component: Cooperative, name: 'Cooperative', meta:{label:"账号信息"} },
            ]
        },
        {
            path: '/',
            component: Home,
            name: '客服支持',
            label: '客服支持',
            iconCls: 'el-icon-message',
             privileges:Role.CalendarTrafficsource,
            children: [
                { path: '/Customerservice', component: Customerservice, name: 'Customerservice', meta:{label:"客服支持"} }
            ]
        },
        {
            path: '/',
            component: Home,
            // name: '生产商',
            // label: '生产商',
            name: '订单管理',
            label: '订单管理',
            iconCls: 'el-icon-setting',
            privileges:Role.CalendarProducer,
            children: [
            
                { path: '/factory_orders', component: FactoryOrder, name: 'FactoryOrder', meta:{label:"订单处理"} },
                { path: '/logistics_info', component: LogisticsInfo, name: 'LogisticsInfo', meta:{label:"新建运单"} },
                // { path: '/factory_orders', component: FactoryOrder, name: 'FactoryOrder', meta:{label:"订单"} },
                { path: '/work/detail', component: WorkDetail, name: 'WorkDetail', meta:{label:"作品详情"} , hidden: true},
                { path: '/transactions', component: TransactionRecord, name: 'TransactionRecord', meta:{label:"账户流水明细"} },
                { path: '/account', component: AccountInfo, name: 'AccountInfo', meta:{label:"账户信息"} }
            ]
        }





];


export default routes;
