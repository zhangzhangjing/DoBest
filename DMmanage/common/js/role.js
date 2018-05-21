

	//是否有权限
function permitted(identity, privileges)
{
    // console.log(identity, privileges);
    if(privileges == 0) {
        return true;
    }
	//逆序位比较
    var privilegeBits = privileges.toString(2).split('').reverse();
    var uBits = identity.toString(2).split('').reverse();
    var length = Math.max(privilegeBits.length, uBits.length);
    //console.log(uBits, privilegeBits);
    for(var i = 0;i < length;i++)
    {
        var bit = privilegeBits[i] || 0;
        var ubit = uBits[i] || 0;
        //console.log(bit, ubit);
        if(bit == 1 && bit == ubit)
        {
        	//console.log("permitted:", true);
            return true
        }
    }
    //console.log("permitted:", false);
    return false;
}


module.exports = {
    System:1,
    Agent:2,//代理商
    Branch:4,//分支机构
    Employee:8,//机构员工
    Printer:16,//印刷厂
    Freelance:32,//微商
    CTSAdmin:64,//管理员
    CTSUser:128,//用户
    CalendarAgency:256,  //台历-代理商
    CalendarProducer:512, //台历-生产商
    CalendarTrafficsource:1024, //台历-推广者（影楼）
    CalendarEmployees:2048, //员工
    CalendarFinancial:4096, //会计
    permitted:permitted
}
