
class PolkaDotsFadeEffectColor {
    colorNum = 0;
    get r() {
        return (this.colorNum & 0x04) > 0 ? 255 : 128;
    }
    get g() {
        return (this.colorNum & 0x02) > 0 ? 255 : 128;
    }
    get b() {
        return (this.colorNum & 0x01) > 0 ? 255 : 128;
    }
    get rgbColorElementString() {
        return this.r + "," + this.g + "," + this.b;
    }
}

class PolkaDotsFadeEffectParameter {
    point = new SoPoint();
    radius = 0;
    color = new PolkaDotsFadeEffectColor();
}

class PolkaDotsFadeEffect {
    numberOfDots = 20;
    dotParameters = [];
    draw(data) {
        const ctx = data.ctx;
        const duration = data.timerCount % 40;
        if (duration >= 20) {
            return;
        }
        if (duration == 0) {
            // initialize
            this.dotParameters.length = 0;
            for (let index = 0; index < this.numberOfDots; index++) {
                const dotParameter = new PolkaDotsFadeEffectParameter();
                dotParameter.point.x = this.getRndInteger(0, data.canvasRect.w);
                dotParameter.point.y = this.getRndInteger(0, data.canvasRect.h);
                dotParameter.radius = this.getRndInteger(20, 100);
                dotParameter.color.colorNum = this.getRndInteger(1, 7);
                this.dotParameters.push(dotParameter);
            }
        }
        else {
            for (let index = 0; index < this.dotParameters.length; index++) {
                const dotParam = this.dotParameters[index];
                const alpha = (10 - Math.abs(duration - 10)) / 10; 
                let radgrad = ctx.createRadialGradient(dotParam.point.x, dotParam.point.y, 0, dotParam.point.x, dotParam.point.y, dotParam.radius);
                radgrad.addColorStop(0, 'rgba(' + dotParam.color.rgbColorElementString + ',' + (alpha * 0.5) + ')');
                radgrad.addColorStop(0.8, 'rgba(' + dotParam.color.rgbColorElementString + ',' + (alpha * 0.4) + ')');
                radgrad.addColorStop(1, 'rgba(' + dotParam.color.rgbColorElementString + ',0)');
                ctx.beginPath();
                ctx.fillStyle = radgrad;
                ctx.ellipse(dotParam.point.x, dotParam.point.y, dotParam.radius, dotParam.radius, 0, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
}