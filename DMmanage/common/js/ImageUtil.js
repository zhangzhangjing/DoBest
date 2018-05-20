import ViewUtil from './ViewUtil';

function getCropRectWithRatio(originWidth,originHeight,maxLength)
{
    var ratio = 0;
    var canvasWidth = 0;
	var canvasHeight = 0;
    if (originWidth > originHeight)
    {
        //横构图,宽度控制在1500以内
        ratio = 4 / 3;
        canvasHeight = Math.min(originHeight, maxLength / ratio);
        canvasWidth = canvasHeight * ratio;
    }
    else
    {
        //竖构图,高度控制在1500以内
        ratio = 3 / 4;
        canvasWidth = Math.min(originWidth, maxLength * ratio);
        canvasHeight = canvasWidth / ratio;
    }
	var scale = ViewUtil.getAdaptiveScale(originWidth, originHeight, canvasWidth, canvasHeight, false)
	var imageWidth = originWidth * scale;
	var imageHeight = originHeight * scale;
	var imageX = (canvasWidth - imageWidth) * 0.5;
	var imageY = (canvasHeight - imageHeight) * 0.5;
    var data = {};
    data['canvasWidth'] = canvasWidth;
    data['canvasHeight'] = canvasHeight;
    data['x'] = imageX;
    data['y'] = imageY;
    data['width'] = imageWidth;
    data['height'] = imageHeight;
    return data;
}

function cropImage(image, canvas, rect)
{
    var context = canvas.getContext("2d"); 
    context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
    return canvas.toDataURL("image/jpeg");
}

module.exports = {
                    getCropRectWithRatio:getCropRectWithRatio,
                    cropImage:cropImage
                }

