
function getUniqid(length)
    {
        var CHARS = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9"]
        var uniqid = "";
        var index = 0;
        for (var i = 0; i < length; i++) {
        	index = parseInt(Math.random() * CHARS.length);
        	uniqid += CHARS[index];
        }
        return uniqid;
    }

function omit(content, max)
{
    content = content || "";
    if(content.length > max)
    {
        return content.substr(0, max) + "...";
    }
    return content;
}

function babyBirthdayRenderHeader(createElement, { column }) {
    return createElement(
          'div',
          { style:{ "display": "inline-block" }},
          [
            createElement('span',{ style:{ "color": "#1d2088" } },'生日'),
            createElement('span',{ },'/'),
            createElement('span',{ style:{ "color": "#e60012" } },'预产期')
          ]
    );
}


module.exports = {
                    getUniqid:getUniqid,
                    omit:omit,
                    babyBirthdayRenderHeader:babyBirthdayRenderHeader
                }
