import CanvasUtil from './CanvasUtil';


function adImageCompose(canvas, bgImage, QRCodeImage, title, content){
    var context = canvas.getContext("2d");
    context.drawImage(bgImage,0,0,bgImage.width, bgImage.height);

    //二维码
    var QRCodeRect = {x:194, y:1072, width:230, height:230};
    context.drawImage(QRCodeImage,QRCodeRect.x, QRCodeRect.y, QRCodeRect.width, QRCodeRect.height);

    // 标题
    context.textBaseline = 'top';
    context.font = "36px Arial";
    context.fillStyle = "#ffffff";
    context.textAlign="center";
    var firstlinetxt='';
    var secondlinetxt='';
    if(title.length>11){
      firstlinetxt=title.substring(0,11);
      secondlinetxt=title.substring(11,title.length);
    }else{
      firstlinetxt=title;
    }

    context.fillText(firstlinetxt, 390, 340);
    context.fillText(secondlinetxt, 390, 390);

    // 内容
    context.textBaseline = 'top';
    context.font = "28px Microsoft YaHei";
    context.fillStyle = "#ffffff";
    context.textAlign="left";
    var lineHeight = 36;
    var chars = 48;
    CanvasUtil.writeTextOnCanvas(context, lineHeight, chars, content, 55, 1567);

    return new Promise((resolve, reject) => {
        canvas.toBlob( function(data){
            console.log('canvas.toBlob:', data);
            if(data){
                resolve(data)
            }else{
                reject('生成失败');
            }

        }, "image/jpeg",0.85)
    })


    // return canvas.toDataURL("image/jpeg");
}

module.exports = {
                    adImageCompose:adImageCompose
                }
