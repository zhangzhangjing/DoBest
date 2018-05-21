
import Login from '../pages/account/Login.vue'
import PasswordReset from '../pages/account/PasswordReset.vue'
import NotFound from '../pages/404.vue'
import Unauthorized from '../pages/401.vue'
import Main from '../pages/Main.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        privileges:0,
        hidden: true
    },
    {
        path: '/password_reset',
        component: PasswordReset,
        name: '',
        privileges:0,
        hidden: true
    },
    {
        path: '/401',
        component: Unauthorized,
        name: '',
        privileges:0,
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        privileges:0,
        hidden: true
    }
];

export default routes;
