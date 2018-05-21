import Role from 'common/js/role.js'



const Home = resolve => require(['../pages/Home.vue'], resolve)

const Overview = resolve => require(['../pages/account/Overview.vue'], resolve)
const Accounts = resolve => require(['../pages/account/Accounts.vue'], resolve)
const TransactionRecord = resolve => require(['../pages/account/TransactionRecord.vue'], resolve)
const CarriageRecord = resolve => require(['../pages/account/CarriageRecord.vue'], resolve)
const ApplicationReview = resolve => require(['../pages/account/ApplicationReview.vue'], resolve)
const ApplicationDetail = resolve => require(['../pages/account/ApplicationDetail.vue'], resolve)
const Recharge = resolve => require(['../pages/account/Recharge.vue'], resolve)


const Customers = resolve => require(['../pages/customer/Customers.vue'], resolve)
const LatentCustomers = resolve => require(['../pages/customer/LatentCustomers.vue'], resolve)


const Trafficsources = resolve => require(['../pages/analytics/Trafficsources.vue'], resolve)
const Trafficsources2 = resolve => require(['../pages/analytics/Trafficsources2.vue'], resolve)


const OrderDetail = resolve => require(['../pages/order/OrderDetail.vue'], resolve)
const MineWorks = resolve => require(['../pages/order/MineWorks.vue'], resolve)
const WorkDetail = resolve => require(['../pages/order/WorkDetail.vue'], resolve)
const MineOrder = resolve => require(['../pages/order/MineOrder.vue'], resolve)
const BargainOrder = resolve => require(['../pages/order/BargainOrder.vue'], resolve)
const UnownedOrder = resolve => require(['../pages/order/UnownedOrder.vue'], resolve)
const CustomerOrders = resolve => require(['../pages/order/CustomerOrders.vue'], resolve)
const FactoryOrder = resolve => require(['../pages/order/FactoryOrder.vue'], resolve)
const Present = resolve => require(['../pages/order/Present.vue'], resolve)
const Present2 = resolve => require(['../pages/order/Present2.vue'], resolve)
const WorkEditor = resolve => require(['../pages/order/WorkEditor.vue'], resolve)


const Cooperative = resolve => require(['../pages/general/Cooperative.vue'], resolve)
const Contact = resolve => require(['../pages/general/Contact.vue'], resolve)
const Notification = resolve => require(['../pages/general/Notification.vue'], resolve)
const Feedbacks = resolve => require(['../pages/general/Feedbacks.vue'], resolve)


const Templates = resolve => require(['../pages/popularize/Templates.vue'], resolve)
const TemplateEdit = resolve => require(['../pages/popularize/TemplateEdit.vue'], resolve)
const TemplateWorks = resolve => require(['../pages/popularize/TemplateWorks.vue'], resolve)
const TemplateUsers = resolve => require(['../pages/popularize/TemplateUsers.vue'], resolve)
const TemplateStaffs = resolve => require(['../pages/popularize/TemplateStaffs.vue'], resolve)

const Promotions = resolve => require(['../pages/popularize/Promotions.vue'], resolve)
const PromotionCodes = resolve => require(['../pages/popularize/PromotionCodes.vue'], resolve)

let routes = [
    {
        path: '/',
        component: Home,
        name: 'cooperation',
        label: '合作方案',
        meta:{keepAlive: true},
        iconCls: 'fa fa-address-card',//图标样式class
        privileges:Role.Agent | Role.Branch,
        children: [
            { path: '/templates', component: Templates, name: 'Templates', meta:{label:"拓展新客资活动", keepAlive: false}},
            { path: '/promotions', component: Promotions, name: 'Promotions', meta:{label:"兑换码活动"} },
            { path: '/present', component: Present, name: 'Present', meta:{label:"影楼一对一"} },
            { path: '/present2', component: Present2, name: 'Present2', meta:{label:"客户一对一"} },
            // { path: '/trafficsources', component: Trafficsources, name: '销售分成业务', label:'销售分成业务', privileges:Role.Agent | Role.Branch | Role.Freelance, hidden: true },
            { path: '/template/edit', component: TemplateEdit, name: 'TemplateEdit', meta:{label:"编辑模板"}, hidden: true},
            { path: '/template/works', component: TemplateWorks, name: 'TemplateWorks', meta:{label:"客户作品"}, hidden: true},
            { path: '/template/users', component: TemplateUsers, name: 'TemplateUsers', meta:{label:"待审核客户"}, hidden: true},
            { path: '/template/staffs', component: TemplateStaffs, name: 'TemplateStaffs', meta:{label:"模板员工权限设置"}, hidden: true},
            { path: '/promotion/codes', component: PromotionCodes, name: 'PromotionCodes', meta:{label:"兑换码"}, hidden: true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '本店',
        label: '本店',
        iconCls: 'el-icon-date',//图标样式class
        privileges:Role.Agent | Role.Branch,
        children: [
            { path: '/orders/mine', component: MineOrder, name: 'MineOrder', meta:{label:"本店订单"}},
            { path: '/orders/bargain', component: BargainOrder, name: 'BargainOrder', meta:{label:"来自分店的订单"}},
            { path: '/stuffs', component: Accounts, name: 'Accounts', meta:{label:"本店账号管理", keepAlive: true}},
            { path: '/order_unowned', component: UnownedOrder, name: 'UnownedOrder', meta:{label:"未分配订单"}, hidden: true},
            { path: '/order/customer', component: CustomerOrders, name: 'CustomerOrders', meta:{label:"客户订单", keepAlive: false}, hidden: true},
            { path: '/workds/mine', component: MineWorks, name: 'MineWorks', meta:{label:"我的作品"}, hidden: true },
            { path: '/order/detail', component: OrderDetail, name: 'OrderDetail', meta:{label:"订单详情"}, hidden: true },
            { path: '/order/work_detail', component: WorkDetail, name: 'WorkDetail', meta:{label:"作品详情"}, hidden: true},
            { path: '/order/work/edit', component: WorkEditor, name: 'WorkEditor', meta:{label:"编辑作品"}, hidden: true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '客户资源',
        label: '客户资源',
        iconCls: 'fa fa-address-card',//图标样式class
        privileges:Role.Agent | Role.Branch,
        children: [
            { path: '/customers/done', component: Customers, name: 'Customers', meta:{label:"已获取的客户"} },
            { path: '/customers/latent', component: LatentCustomers, name: 'LatentCustomers', meta:{label:"待营销客户"} }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '账户',
        label: '账户',
        iconCls: 'fa fa-id-card-o',
        privileges:Role.Agent | Role.Branch,
        children: [
            { path: '/overview', component: Overview, name: 'Overview', meta:{label:"账户总览"} },
            { path: '/transactions', component: TransactionRecord, name: 'TransactionRecord', meta:{label:"账户流水明细"} },
            // { path: '/carriage_transactions', component: CarriageRecord, name: 'CarriageRecord', meta:{label:"邮费流水明细"} },
            { path: '/account/recharge', component: Recharge, name: 'Recharge', meta:{label:"充值"}, hidden: true}

        ]
    },
    {
        path: '/',
        component: Home,
        name: '推广',
        label: '推广',
        iconCls: 'el-icon-message',//图标样式class
        privileges:Role.Agent | Role.Branch | Role.Freelance,
        children: [
            { path: '/trafficsources', component: Trafficsources, name: 'Trafficsources', meta:{label:"专属店铺页"}, privileges:Role.Agent | Role.Branch | Role.Freelance }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统',
        label: '系统',
        iconCls: 'el-icon-setting',
        privileges:Role.Agent | Role.Branch,
        children: [
            { path: '/cooperative', component: Cooperative, name: 'Cooperative', meta:{label:"代理商信息"} },
            { path: '/contact', component: Contact, name: 'Contact', meta:{label:"意见反馈"} }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '消息通知~',
        label: '消息通知',
        iconCls: 'el-icon-message',
        leaf: true,
        privileges:Role.Agent | Role.Branch,
        children: [
            { path: '/notification', component: Notification, name: 'Notification', meta:{label:"消息通知"} }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'FactoryOrderHome',
        label: '印刷',
        iconCls: 'fa el-icon-picture ',
        leaf: true,
        privileges:Role.Printer,
        children: [
            { path: '/order_factory', component: FactoryOrder, name: 'FactoryOrder', meta:{label:"打印订单", keepAlive: true}}
        ]
    }
];

export default routes;
