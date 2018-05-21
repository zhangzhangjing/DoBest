

//bytelength  一行字符数
function writeTextOnCanvas(ctx_2d, lineheight, bytelength, text ,startleft, starttop){
    function getTrueLength(str){//获取字符串的真实长度（字节长度）
        var len = str.length, truelen = 0;
        for(var x = 0; x < len; x++){
            if(str.charCodeAt(x) > 128){
                truelen += 2;
            }else{
                truelen += 1;
            }
        }
        return truelen;
    }
    function cutString(str, leng){//按字节长度截取字符串，返回substr截取位置
        var len = str.length, tlen = len, nlen = 0;
        for(var x = 0; x < len; x++){
            if(str.charCodeAt(x) > 128){
                if(nlen + 2 < leng){
                    nlen += 2;
                }else{
                    tlen = x;
                    break;
                }
            }else{
                if(nlen + 1 < leng){
                    nlen += 1;
                }else{
                    tlen = x;
                    break;
                }
            }
        }
        return tlen;
    }

    for(var i = 1; getTrueLength(text) > 0; i++){
        var tl = cutString(text, bytelength);
        ctx_2d.fillText(text.substr(0, tl).replace(/^\s+|\s+$/, ""), startleft, (i-1) * lineheight + starttop);
        text = text.substr(tl);
    }
}


module.exports = {
                    writeTextOnCanvas:writeTextOnCanvas
                }
