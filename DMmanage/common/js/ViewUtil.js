
function getAdaptiveScale(targetW, targetH, containerW, containerH, inscribed)
{
    var widthRate = targetW / containerW;
    var heightRate = targetH / containerH;
    var rate = inscribed ? Math.max(widthRate, heightRate, 1) : Math.min(widthRate, heightRate);
    var adaptiveScale = 1 / rate;
    return adaptiveScale;
}

module.exports = {
                    getAdaptiveScale:getAdaptiveScale
                }
