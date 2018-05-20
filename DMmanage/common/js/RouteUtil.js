
function addRoutes(router, routes)
{
    var addedRoutes = [];
    var localRoutes = router.options.routes;
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        var index = localRoutes.findIndex(item => {return item.path == route.path});
        if(index == -1)
        {
            addedRoutes.push(route);
        }
    }
    router.addRoutes(addedRoutes);
    router.options.routes = localRoutes.concat(addedRoutes);
}

module.exports = {
                    	addRoutes:addRoutes
                }