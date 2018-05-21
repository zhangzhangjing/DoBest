//var jq = require("jquery");
var $ = require("jquery");
var APIBasePath = 'https://mpic.bbyiya.com';
var newAPIBasePath = 'https://mpic.bbyiya.com';
import {Promise} from 'core-js';

import general from './general';
import cts from './cts';
import ibs from './ibs';
import pbs from './pbs';

import {createRequestPromise,successDefaultPromise,CountPerPage} from 'common/js/api_base.js'

function init(config)
{
	APIBasePath = config.APIBasePath || APIBasePath;
	newAPIBasePath = config.newAPIBasePath || newAPIBasePath;
	general.init(APIBasePath, newAPIBasePath)
	cts.init(APIBasePath, newAPIBasePath)
	ibs.init(APIBasePath, newAPIBasePath)
	pbs.init(APIBasePath, newAPIBasePath)
}

function getAPIBasePath(newAPIPriority){
	return newAPIPriority ? newAPIBasePath : APIBasePath;
}
function logout(){
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('ticket');
    sessionStorage.removeItem('identity');
}
module.exports = {
	storageBasePath:"http://pic.bbyiya.com/",
	successDefaultPromise:successDefaultPromise,
	getAPIBasePath:getAPIBasePath,
	logout:logout,
	CountPerPage:CountPerPage,
	init:init,
	general:general,
	ibs:ibs,
	cts:cts,
	pbs:pbs
}
