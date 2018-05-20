import Role from 'common/js/role.js'

const Home = resolve => require(['../pages/Home.vue'], resolve)


const ApplicationReview = resolve => require(['../pages/cts/review/ApplicationReview.vue'], resolve)
const OrderRule = resolve => require(['../pages/cts/review/OrderRule.vue'], resolve)
const PromotionAgent = resolve => require(['../pages/cts/review/PromotionAgent.vue'], resolve)
const Orders = resolve => require(['../pages/cts/order/Orders.vue'], resolve)
const Finance = resolve => require(['../pages/cts/order/Finance.vue'], resolve)
const TransactionRecord = resolve => require(['../pages/cts/order/TransactionRecord.vue'], resolve)

const ProductManage = resolve => require(['../pages/cts/product/ProductManage.vue'], resolve)
const CouponManage = resolve => require(['../pages/cts/product/CouponManage.vue'], resolve)
const ProductAdd = resolve => require(['../pages/cts/product/ProductAdd.vue'], resolve)
const ProductAddImg = resolve => require(['../pages/cts/product/ProductAddImg.vue'], resolve)
const ProductAddStyle = resolve => require(['../pages/cts/product/ProductAddStyle.vue'], resolve)
const ADtemplate = resolve => require(['../pages/cts/product/ADtemplate.vue'], resolve)
const ProductStyles = resolve => require(['../pages/cts/product/ProductStyles.vue'], resolve)
const TemplateEditor = resolve => require(['../pages/cts/product/TemplateEditor.vue'], resolve)
const Pageeffect = resolve => require(['../pages/cts/product/Pageeffect.vue'], resolve)
const Uploadphotos = resolve => require(['../pages/cts/product/Uploadphotos.vue'], resolve)


const Trafficsources = resolve => require(['../pages/commonality/Trafficsources.vue'], resolve)



let routes = [
    {
        path: '/',
        component: Home,
        name: '企业管理',
        label: '企业管理',
        iconCls: 'fa fa-user-plus',//图标样式class
        privileges:Role.CTSAdmin | Role.CTSUser,
        children: [
            // { path: '/review/dealer', component: ApplicationReview, name: 'ApplicationReview', meta:{label:"授权生产商"}},
            // { path: '/review/agent', component: PromotionAgent, name: 'PromotionAgent', meta:{label:"推广代理商"}},
            { path: '/reviewAgent', component: PromotionAgent, name: 'PromotionAgent', meta:{label:"代理商管理"}},
            { path: '/reviewDealer', component: ApplicationReview, name: 'ApplicationReview', meta:{label:"生产商管理"}},
            { path: '/review/orderRule', component: OrderRule, name: 'OrderRule', meta:{label:"订单分配规则"}, hidden: true},
            { path: '/partnerTrafficsources', component: Trafficsources, name: 'Trafficsources', meta:{label:"企业商户管理"}}

        ]
    },
    {
        path: '/',
        component: Home,
        name: '财务管理',
        label: '财务管理',
        iconCls: 'fa fa-credit-card-alt',//图标样式class
        privileges:Role.CTSAdmin | Role.CTSUser | Role.CalendarFinancial,
        children: [
            { path: '/finance', component: Finance, name: 'Finance', meta:{label:"财务管理"}, privileges:Role.CTSAdmin | Role.CTSUser | Role.CalendarFinancial}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '订单管理',
        label: '订单管理',
        iconCls: 'fa fa-sun-o',//图标样式class
        privileges:Role.CTSAdmin | Role.CTSUser | Role.CalendarFinancial,
        children: [
            { path: '/orders', component: Orders, name: 'Orders', meta:{label:"订单管理"}, privileges:Role.CTSAdmin | Role.CTSUser},
            // { path: '/finance', component: Finance, name: 'Finance', meta:{label:"财务管理"}, privileges:Role.CTSAdmin | Role.CTSUser | Role.CalendarFinancial},
            { path: '/transaction/records', component: TransactionRecord, name: 'TransactionRecord', meta:{label:"交易记录"}, hidden: true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '产品管理',
        label: '产品管理',
        iconCls: 'fa fa-cube',//图标样式class
        privileges:Role.CTSAdmin | Role.CTSUser,
        children: [
            { path: '/products', component: ProductManage, name: 'ProductManage', meta:{label:"产品管理"}},
            { path: '/coupon', component: CouponManage, name: 'CouponManage', meta:{label:"优惠券管理"}},
            { path: '/products/add', component: ProductAdd, name: 'ProductAdd', meta:{label:"添加新产品"}, hidden: true},
            { path: '/products/addimg', component: ProductAddImg, name: 'ProductAddImg', meta:{label:"添加新产品"}, hidden: true},
            { path: '/products/addstyle', component: ProductAddStyle, name: 'ProductAddStyle', meta:{label:"添加新产品"}, hidden: true},
            { path: '/products/ADtemplate', component: ADtemplate, name: 'ADtemplate', meta:{label:"广告模版"}, hidden: true},
            { path: '/product/styles', component: ProductStyles, name: 'ProductStyles', meta:{label:"产品款式"}, hidden: true},
            { path: '/product/style/template', component: TemplateEditor, name: 'TemplateEditor', meta:{label:"款式模板"}, hidden: true},
            { path: '/Pageeffect', component: Pageeffect, name: 'Pageeffect', meta:{label:"翻页效果模板"}},
            { path: '/Pageeffect/Uploadphotos', component: Uploadphotos, name: 'Uploadphotos', meta:{label:"上传照片"}, hidden: true},
           
            
        ]
    }
]


export default routes;
