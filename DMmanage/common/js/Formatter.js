
import {TransactionType, EventType, EventStatus, CampaignPresentType, EntityType,
    ApplicationReviewStatus,CampaignStatus,OrderStatus} from 'common/js/BaseModel.js';

// object:查找对象
// prop：查找属性
// matchValue:比对值
function findObject(object, prop, matchValue){
    for(var key in object){
        var item = object[key];
        if (item[prop] == matchValue){
            return item;
        }
    }
    return null;
}

function findEnumName(object, matchValue){
    var obj = findObject(object, 'value', matchValue);
    return obj ? obj['name'] : null;
}

module.exports = {
    transactionTypeFormat(item, column){
        return findEnumName(TransactionType, item.type) || '未知'
    },
    eventTypeFormat(item, column){
        return findEnumName(EventType, item.type) || '未知'
    },
    eventStatusFormat(item, column){
        return findEnumName(EventStatus, item.status) || '未知'
    },
    campaignPresentTypeFormat(item, column){
        return findEnumName(CampaignPresentType, item.acttype) || '未知'
    },
    campaignPresentTypeDesc(type){
        return findEnumName(CampaignPresentType, type) || '未知'
    },
    entityTypeDesc(type){
        return findEnumName(EntityType, type) || '未知'
    },
    applicationReviewStatusFormat(item, column){
        return findEnumName(ApplicationReviewStatus, item.status) || '未知'
    },
    campaignStatusFormat(item, column){
        return findEnumName(CampaignStatus, item.status) || '未知'
    },
    orderStatusDesc(status){
        return findEnumName(OrderStatus, status) || '未知'
    }




}
