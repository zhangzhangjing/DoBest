import Role from 'common/js/role.js'
import Home from '../pages/Home.vue'
import Trafficsources from '../pages/analytics/Trafficsources.vue'

let routes = [
    {
        path: '/',
        component: Home,
        name: '推广',
        label: '推广',
        iconCls: 'el-icon-message',//图标样式class
        privileges:Role.Agent | Role.Branch | Role.Freelance,
        children: [
            { path: '/trafficsources', component: Trafficsources, name: 'Trafficsources', meta:{label:"流量主专属页"}, privileges:Role.Agent | Role.Branch | Role.Freelance }
        ]
    }
];

export default routes;
