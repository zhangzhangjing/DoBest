import Role from 'common/js/role.js'



const Home = resolve => require(['../pages/Home.vue'], resolve)


const StuffManage = resolve => require(['../pages/manage/StuffManage.vue'], resolve)


const ApplicationReview = resolve => require(['../pages/account/ApplicationReview.vue'], resolve)
const ApplicationDetail = resolve => require(['../pages/account/ApplicationDetail.vue'], resolve)



const Trafficsources2 = resolve => require(['../pages/analytics/Trafficsources2.vue'], resolve)

const echarts = resolve => require(['../pages/charts/echarts.vue'], resolve)


const AnalyticsOverview = resolve => require(['../pages/cts/analytics/Overview.vue'], resolve)
const AnalyticsEvents = resolve => require(['../pages/cts/analytics/Events.vue'], resolve)
const AnalyticsEventDetail = resolve => require(['../pages/cts/analytics/EventDetail.vue'], resolve)


const OrderDetail = resolve => require(['../pages/order/OrderDetail.vue'], resolve)
const WorkDetail = resolve => require(['../pages/order/WorkDetail.vue'], resolve)
const WorkEditor = resolve => require(['../pages/order/WorkEditor.vue'], resolve)
const FactoryOrder = resolve => require(['../pages/order/FactoryOrder.vue'], resolve)

const Feedbacks = resolve => require(['../pages/general/Feedbacks.vue'], resolve)


const ProductManage = resolve => require(['../pages/manage/ProductManage.vue'], resolve)
const ProductDetail = resolve => require(['../pages/manage/ProductDetail.vue'], resolve)
const ProductScenes = resolve => require(['../pages/manage/ProductScenes.vue'], resolve)
const GeneralCarriage = resolve => require(['../pages/manage/GeneralCarriage.vue'], resolve)
const ForbiddenCarriage = resolve => require(['../pages/manage/ForbiddenCarriage.vue'], resolve)
const CommentTemplates = resolve => require(['../pages/manage/CommentTemplates.vue'], resolve)


const Freelances = resolve => require(['../pages/manage/Freelances.vue'], resolve)
const FreelanceOrders = resolve => require(['../pages/manage/FreelanceOrders.vue'], resolve)
const TrafficsourcesManage = resolve => require(['../pages/manage/TrafficsourcesManage.vue'], resolve)
const FreelanceApplicationDetail = resolve => require(['../pages/manage/FreelanceApplicationDetail.vue'], resolve)


let routes = [
    {
        path: '/',
        component: Home,
        name: 'order',
        label: '人员管理',
        iconCls: 'el-icon-date',//图标样式class
        privileges:Role.CTSAdmin | Role.CTSUser,
        children: [
            { path: '/stuffs', component: StuffManage, name: 'StuffManage', meta:{label:"员工管理", keepAlive: true}}
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'content',
        label: '内容管理',
        meta:{keepAlive: true},
        iconCls: 'fa fa-address-card',//图标样式class
        privileges:Role.CTSAdmin | Role.CTSUser,
        children: [
            { path: '/productmanage', component: ProductManage, name: 'ProductManage', meta:{label:"产品管理"}},
            { path: '/product/detail', component: ProductDetail, name: 'ProductDetail', meta:{label:"产品详情"}, hidden: true},
            { path: '/product/scenes', component: ProductScenes, name: 'ProductScenes', meta:{label:"产品场景"}, hidden: true},
            { path: '/carriage/general', component: GeneralCarriage, name: 'GeneralCarriage', meta:{label:"邮费模板"}},
            { path: '/carriage/forbidden', component: ForbiddenCarriage, name: 'ForbiddenCarriage', meta:{label:"特殊邮费模板"}},
            { path: '/manage/templates/comment', component: CommentTemplates, name: 'CommentTemplates', meta:{label:"预设评论管理"}}

        ]
    },
    {
        path: '/',
        component: Home,
        name: 'order',
        label: '订单管理',
        iconCls: 'el-icon-date',//图标样式class
        privileges:Role.CTSAdmin | Role.CTSUser,
        children: [
            { path: '/order_factory', component: FactoryOrder, name: 'FactoryOrder', meta:{label:"打印订单", keepAlive: true}},
            { path: '/order/work_detail', component: WorkDetail, name: 'WorkDetail', meta:{label:"作品详情"}, hidden: true},
            { path: '/order/work/edit', component: WorkEditor, name: 'WorkEditor', meta:{label:"编辑作品"}, hidden: true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '友商管理',
        label: '友商管理',
        iconCls: 'fa fa-address-card',//图标样式class
        privileges:Role.CTSAdmin | Role.CTSUser,
        children: [
            { path: '/review/dealer', component: ApplicationReview, name: 'ApplicationReview', meta:{label:"影楼管理"}},
            { path: '/review/dealer/detail', component: ApplicationDetail, name: 'ApplicationDetail', meta:{label:"申请详情"}, hidden: true},
            { path: '/manage/trafficsources', component: TrafficsourcesManage, name: 'TrafficsourcesManage', meta:{label:"流量主管理"}},
            { path: '/manage/trafficsources/review', component: FreelanceApplicationDetail, name: 'FreelanceApplicationDetail', meta:{label:"流量主审核"}, hidden: true},
            { path: '/freelances', component: Freelances, name: 'Freelances', meta:{label:"微商"}, hidden: true},
            { path: '/freelance/orders', component: FreelanceOrders, name: 'FreelanceOrders', meta:{label:"微商订单"}, hidden: true},
            { path: '/manage/trafficsources/data', component: Trafficsources2, name: 'Trafficsources2', meta:{label:"流量主数据"}, hidden: true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '数据统计',
        label: '数据统计',
        iconCls: 'fa fa-address-card',//图标样式class
        privileges:Role.CTSAdmin | Role.CTSUser,
        children: [
            { path: '/analytics/overview', component: AnalyticsOverview, name: 'AnalyticsOverview', meta:{label:"总览"}},
            // { path: '/analytics/aa', component: echarts, name: 'echarts', meta:{label:"echarts"}},
            { path: '/analytics/events', component: AnalyticsEvents, name: 'AnalyticsEvents', meta:{label:"活动统计"}, hidden: true},
            { path: '/analytics/event/detail', component: AnalyticsEventDetail, name: 'AnalyticsEventDetail', meta:{label:"活动统计详情"}, hidden: true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '客户服务',
        label: '客户服务',
        iconCls: 'fa fa-id-card-o',
        privileges:Role.CTSAdmin | Role.CTSUser,
        children: [
            { path: '/feedbacks', component: Feedbacks, name: 'Feedbacks', meta:{label:"意见反馈"}}

        ]
    }
];

export default routes;
