

var config = {};

function init(baseConfig){
    config = Object.assign({}, baseConfig);
}

function get(key){
    return config[key]
}

function set(key, value){
    config[key] = value;
}

module.exports = {
    init:init,
    get:get,
    set:set

}
