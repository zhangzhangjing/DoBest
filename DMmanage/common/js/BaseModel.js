

export var TransactionType = {
    Order:{value:1,name:'货款消费'},
    Charge:{value:2,name:'充值记录'},
    Carriage:{value:3,name:'运费消费'},
    Tip:{value:4,name:'红包'},
    Divide:{value:5,name:'相册推广收入'},
    Withdraw:{value:6,name:'提现记录'},
    CarriageEarning:{value:7,name:'运费收入'},
    // CommissionEarning:{value:8,name:'台历佣金收入'},
    CommissionEarning:{value:8,name:'销售佣金'},
    OrderEarning:{value:9,name:'货款收入'},
    Promotionincome:{value:10,name:'红包收入'},
    distribution:{value:11,name:'分销业务收入'},
};

// 活动类型
export var EventType = {
    Template:{value:0,name:'新客资'},
    Promotion:{value:2,name:'兑换码'}
};

// 活动状态
export var EventStatus = {
    Normal:{value:0,name:'未开始'},
    Running:{value:1,name:'进行中'},
    Ended:{value:3,name:'已结束'}
};

// 活动状态
export var CampaignPresentType = {
    All:{value:0,name:'公开'},
    Single:{value:1,name:'一对一'},
    exchange:{value:2,name:'兑换码'},
};

// 活动状态
//0 待提交作品，1待完成分享，2已完成分享，3已完成（已下单）
export var CampaignStatus = {
    Uncommitted:{value:0,name:'待提交作品'},
    Pending:{value:1,name:'待完成分享'},
    Shared:{value:2,name:'待下单'},
    Finish:{value:3,name:'已完成'},
    Failjoin:{value:4,name:'名额失效'}
};

// 活动状态
export var EntityType = {
    // Agency:{value:1,name:'推广代理商'},
    // Trafficsource:{value:2,name:'活动参与单位'},
    // Producer:{value:3,name:'授权生产商'},
    // Yiya:{value:4,name:'咿呀系统'},
    // OperatingCenter:{value:5,name:'运管中心'}
    // 推广代理商就是广告主
    Agency:{value:1,name:'代理商'},
    Trafficsource:{value:2,name:'企业商户'},
    Producer:{value:3,name:'生产商'},
    Yiya:{value:4,name:'平台'},
    OperatingCenter:{value:5,name:'运管中心'},
    youfeiPrice: {value: 6, name: '邮费核算'}
};

// 申请审核状态
export var ApplicationReviewStatus = {
    Reviewing:{value:0,name:'审核中'},
    Accept:{value:1,name:'已通过'},
    Denied:{value:2,name:'未通过'},
    Holding:{value:3,name:'审核通过，等待缴费'},
    Quit:{value:4,name:'已退驻'}
};

//订单状态
export var OrderStatus = {
    Unpaied:{value:0,name:'未支付'},
    Purchased:{value:1,name:'已支付'},
    Making:{value:2,name:'等待发货'},
    Shipped:{value:3,name:'已发货'},
    Deliver:{value:4,name:'已签收'}
};

//订单类型
export var OrderType = {
    // O0:{value:0,name:'C端普通下单'},
    // O1:{value:1,name:'影楼内部下单'},
    // O2:{value:2,name:'普通用户下单'},
    // O3:{value:3,name:'推广者下单'}
    O0:{value:0,name:'商城订单'},
    O1:{value:1,name:'影楼内部下单'},
    O2:{value:2,name:'普通用户下单'},
    O3:{value:3,name:'企业商户订单'}
};
