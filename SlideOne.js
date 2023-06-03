class SlideOneSource {
    bg = "";
    slides = [];

    constructor(src) {
        if (src !== undefined) {
            this.bg = src.bg === undefined ? this.bg : src.bg;
            this.slides = src.slides === undefined ? this.slides : src.slides;
        }
    }
}

class SoSlideSource {
    layers = [];

    constructor(src) {
        if (src !== undefined) {
            this.layers = src.layers === undefined ? this.layers : src.layers;
        }
    }
}

class SoImageLayerSource {
    image = "";
    x = 0;
    y = 0;
    w = -1;
    h = -1;

    constructor(src) {
        if (src !== undefined) {
            this.image = src.image === undefined ? this.image : src.image;
            this.x = src.x === undefined ? this.x : src.x;
            this.y = src.y === undefined ? this.y : src.y;
            this.w = src.w === undefined ? this.w : src.w;
            this.h = src.h === undefined ? this.h : src.h;
        }
    }
}

class SoTextLayerSource {
    text = "";
    font = "sans";
    size  = 36;
    color = "white";
    align = "start";
    baseline = "top";
    x = 0;
    y = 0;

    constructor(src) {
        if (src !== undefined) {
            this.text = src.text === undefined ? this.text : src.text;
            this.font = src.font === undefined ? this.font : src.font;
            this.size = src.size === undefined ? this.size : src.size;
            this.color = src.color === undefined ? this.color : src.color;
            this.align = src.align === undefined ? this.align : src.align;
            this.baseline = src.baseline === undefined ? this.baseline : src.baseline;
            this.x = src.x === undefined ? this.x : src.x;
            this.y = src.y === undefined ? this.y : src.y;
        }
    }
}

class SoData {
    defaultWidth = -1;
    defaultHeight = -1;
    source = null; // SlideOneSource
    slides = []; // SlideData[]
    canvas = null;
    ctx = null;
    bg = null;
    currentIndex = 0;
    mouseX = -1;
    mouseY = -1;
    windowRatio = 1;
    backgroundEffects = [];
    foregroundEffects = [];
    timerCount = 0;
}

class SoSlideData {
    layers = [];
}

class SoImageLayer {
    image = null;
    x = 0;
    y = 0;
    w = -1;
    h = -1;
}

class SoTextLayer {
    text = "";
    font = "";
    style = ""; // color
    align = "";
    baseline = "";
    x = 0;
    y = 0;
}


class SoPoint {
    x = 0;
    y = 0;

    constructor (x, y) {
        if (x !== undefined) {
            this.x = x;
        }
        if (y !== undefined) {
            this.y = y;
        }
    }
}

class SoSize {
    w = 0;
    h = 0;
    
    constructor (w, h) {
        if (w !== undefined) {
            this.w = w;
        }
        if (h !== undefined) {
            this.h = h;
        }
    }
}

class SoRect {
    x = 0;
    y = 0;
    w = 0;
    h = 0;

    constructor (x, y, w, h) {
        if (x !== undefined) {
            this.x = x;
        }
        if (y !== undefined) {
            this.y = y;
        }
        if (w !== undefined) {
            this.w = w;
        }
        if (h !== undefined) {
            this.h = h;
        }
    }
}

class SoColor {
    r = 0;
    g = 0;
    b = 0;
    get rgbColorElementString() {
        return this.r + "," + this.g + "," + this.b;
    }
}

class SoLightColor8 {
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

class SoEffectParameter {
    #ctx = null;
    #timerCount = 0;
    #canvasRect = new SoRect();
    #mousePosition = new SoPoint();

    get ctx() {
        return this.#ctx;
    }
    get timerCount() {
        return this.#timerCount;
    }
    get canvasRect() {
        return this.#canvasRect;
    }
    get mousePosition() {
        return this.#mousePosition;
    }

    constructor(ctx, soData) {
        this.#ctx = ctx;
        this.#canvasRect = new SoRect(0, 0, soData.defaultWidth, soData.defaultHeight);
        this.#mousePosition = new SoPoint(soData.mouseX, soData.mouseY);
        this.#timerCount = soData.timerCount;
    }
}


class PolkaDotParameter {
    point = new SoPoint();
    radius = 0;
    color = new SoLightColor8();
}

class PolkaDotsEffect {
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
                const dotParameter = new PolkaDotParameter();
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

class ClockEffect {
    draw(data) {
        const ctx = data.ctx;
        const today = new Date();
        const secondSource = "00" + today.getSeconds();
        const minuteSource = "00" + today.getMinutes();
        const time = today.getHours() + ":" + minuteSource.substring(minuteSource.length - 2, minuteSource.length) + ":" + secondSource.substring(secondSource.length - 2, secondSource.length);
        ctx.font = "48px sans"
        ctx.fillStyle = "white";
        ctx.textBaseline = "bottom";
        ctx.textAlign = "right";
        ctx.fillText(time, data.canvasRect.w - 10, data.canvasRect.h - 10);
    }
}

class SlideOne {
    #slideOneData = new SoData();
    currentIndex = 0;

    constructor(canvasSource, slideOneSource, onLoadCallback) {
        if (!(slideOneSource instanceof SlideOneSource)) {
            console.error("The Source is not SlideOneSource object.");
            return;
        }
        const canvas = this.#getCanvas(canvasSource);
        const data = new SoData();
        data.defaultWidth = canvas.width;
        data.defaultHeight = canvas.height;
        data.source = slideOneSource;
        data.canvas = canvas;
        data.ctx = canvas.getContext("bitmaprenderer");
        data.effect = new PolkaDotsEffect();

        const funcDict = {};

        // funcs
        funcDict["loadBg"] = this.#loadBg;
        funcDict["loadFg"] = this.#loadFg;
        funcDict["onLoadCallback"] = onLoadCallback;

        this.#slideOneData = data;
        
        this.#loadBg(data, funcDict);
        this.resize(window.innerWidth, window.innerHeight);
    }


    draw() {
        const data = this.#slideOneData;
        this.#drawCore(data);
    }

    drawNext() {
        const data = this.#slideOneData;
        const fgImageCount = data.slides.length;
        if (data.currentIndex < fgImageCount - 1) {
            data.currentIndex++;
            this.draw();
        }
    }

    drawPrev() {
        const data = this.#slideOneData;
        if (0 < data.currentIndex) {
            data.currentIndex--;
            this.draw();
        }
    }

    resize(windowWidth, windowHeight) {
        const data = this.#slideOneData;
        const defaultWidth = data.defaultWidth;
        const defaultHeight = data.defaultHeight;
        const canvas = data.canvas;

        const [actualWidth, actualHeight] = this.#calcActualSize(windowWidth, windowHeight, defaultWidth, defaultHeight);
    
        canvas.style.width = actualWidth + 'px';
        canvas.style.height = actualHeight + 'px';
        data.ratio = actualWidth / defaultWidth;
    };

    registerMouseMoveEvent(){
        const data = this.#slideOneData;
        data.canvas.addEventListener("mousemove", (event) => this.#onMouseMoveCallback(event, data, this.#drawCore));
    }

    registerMouseDownEvent() {
        const data = this.#slideOneData;
        data.canvas.addEventListener("mousedown", (event) => this.#onMouseDownCallback(event, data, this.#drawCore));
    }

    registerKeyDownEvent(target) {
        if (target !== undefined) {
            target.addEventListener("keydown", (event) => this.#onKeyDown(event, this))
        }
    }

    startTimer() {
        setInterval(() => {
            const data = this.#slideOneData;
            data.timerCount ++;
            if (data.timerCount >= 10000) {
                data.timerCount = 0;
            }
            this.#drawCore(data);
        }, 100);
    }

    addBackgroundEffect(effect) {
        this.#slideOneData.backgroundEffects.push(effect);
    }

    addForegroundEffect(effect) {
        this.#slideOneData.foregroundEffects.push(effect);
    }

    enableFullWindowMode() {
        window.addEventListener('resize', () => this.resize(window.innerWidth, window.innerHeight), false);
    }

    #getCanvas(src) {
        if (typeof src === "string") {
            return document.getElementById(src);
        }
        return src;
    }

    #loadBg(data, funcDict) {
        const source = data.source;
        const bgImage = new Image();
        bgImage.src = source.bg;
        data.bg = bgImage;
        bgImage.onload = () => funcDict["loadFg"](data, funcDict);
    }

    #loadFg(data, funcDict) {
        // ! メンバーアクセス禁止
        const source = data.source;
        const fileCount = source.slides.length;
        const loadingList = [];
        for (let index = 0; index < fileCount; index++) {
            if (index < fileCount) {
                const slide = source.slides[index];
                const slideData = new SoSlideData();
                if (typeof slide === "string") { // TEXTの場合は、画像ファイルとして扱う
                    const layer = new SoImageLayer();
                    const fgImage = new Image();
                    loadingList.push({"i": fgImage, "f": slide});
                    layer.image = fgImage;
                    slideData.layers.push(layer);
                }
                else {
                    let layersSource = [];
                    if (slide.layers !== undefined) {
                        layersSource = slide.layers;
                    }
                    else if (slide instanceof Array) {
                        layersSource = slide;
                    }
                    for (let layerIndex = 0; layerIndex < layersSource.length; layerIndex++) {
                        const layerSource = layersSource[layerIndex];
                        if (layerSource.image !== undefined) {
                            const imageLayerSource = new SoImageLayerSource(layerSource);
                            const layer = new SoImageLayer();
                            const fgImage = new Image();
                            loadingList.push({"i": fgImage, "f": imageLayerSource.image});
                            layer.image = fgImage;
                            layer.x = imageLayerSource.x;
                            layer.y = imageLayerSource.y;
                            layer.w = imageLayerSource.w;
                            layer.h = imageLayerSource.h;
                            slideData.layers.push(layer);
                        }
                        else if(layerSource.text !== undefined) {
                            const textLayerSource = new SoTextLayerSource(layerSource);
                            const layer = new SoTextLayer();
                            layer.font = textLayerSource.size + "px " + textLayerSource.font;
                            layer.style = textLayerSource.color;
                            layer.text = textLayerSource.text;
                            layer.align = textLayerSource.align;
                            layer.baseline = textLayerSource.baseline;
                            layer.x = textLayerSource.x;
                            layer.y = textLayerSource.y;
                            slideData.layers.push(layer);
                        }
                    }
                }
                data.slides.push(slideData);
            }
        }

        const loadingFunc = (idx) => {
            if (idx < loadingList.length) {
                loadingList[idx]["i"].src = loadingList[idx]["f"];
                loadingList[idx]["i"].onload = loadingFunc(idx + 1);
            }
            else {
                const onLoadCallback = funcDict["onLoadCallback"];
                if (onLoadCallback) {
                    onLoadCallback();
                }
            }
        }
        loadingFunc(0);
    }
    
    #drawCore(data) {
        const canvasCtx = data.ctx;
        const bgImage = data.bg;
        const slide = data.slides[data.currentIndex];
        const defaultWidth = data.defaultWidth;
        const defaultHeight = data.defaultHeight;
        const offScreenCanvas = new OffscreenCanvas(defaultWidth, defaultHeight);
        const offScreenCtx = offScreenCanvas.getContext("2d");
        offScreenCtx.drawImage(bgImage, 0, 0, defaultWidth, defaultHeight);
        const effectParameter = new SoEffectParameter(offScreenCtx, data);
        for (let effectIndex = 0; effectIndex < data.backgroundEffects.length; effectIndex++) {
            const effect = data.backgroundEffects[effectIndex];
            effect.draw(effectParameter);
        }
        for (let layerIndex = 0; layerIndex < slide.layers.length; layerIndex++) {
            const layer = slide.layers[layerIndex];
            if (layer instanceof SoImageLayer) {
                const width = layer.w < 0 ? layer.image.width : layer.w;
                const height = layer.h < 0 ? layer.image.height : layer.h;
                offScreenCtx.drawImage(layer.image, layer.x, layer.y, width, height);
            }
            else if (layer instanceof SoTextLayer) {
                offScreenCtx.font = layer.font;
                offScreenCtx.fillStyle = layer.style;
                offScreenCtx.textBaseline = layer.baseline;
                offScreenCtx.textAlign = layer.align;
                offScreenCtx.fillText(layer.text, layer.x, layer.y);
            }
        }
        for (let effectIndex = 0; effectIndex < data.foregroundEffects.length; effectIndex++) {
            const effect = data.foregroundEffects[effectIndex];
            effect.draw(effectParameter);
        }
        if (data.mouseX >= 0) {
            offScreenCtx.beginPath();
            offScreenCtx.fillStyle = "#FF000099";
            offScreenCtx.ellipse(data.mouseX, data.mouseY, 20, 20, 0, 0, 2 * Math.PI);
            offScreenCtx.fill();
        }
        canvasCtx.transferFromImageBitmap(offScreenCanvas.transferToImageBitmap());
    }



    #calcActualSize(windowWidth, windowHeight, defaultWidth, defaultHeight) {
        const canvasRatio = defaultHeight / defaultWidth;
        const windowRatio = windowHeight / windowWidth;
        let width;
        let height;
    
        if (windowRatio < canvasRatio) {
            height = windowHeight;
            width = height / canvasRatio;
        }
        else {
            width = windowWidth;
            height = width * canvasRatio;
        }
        return [width * 1, height * 1];
    }

    #onMouseDownCallback(event, data, drawFunc){
        if(event.buttons !== 1) {
            return;
        }
        const fgImageCount = data.slides.length;
        if (data.currentIndex < fgImageCount - 1) {
            data.currentIndex++;
            drawFunc(data);
        }
    }

    #onMouseMoveCallback(event, data, drawFunc) {
        data.mouseX = event.offsetX / data.ratio;
        data.mouseY = event.offsetY / data.ratio;
        drawFunc(data);
    }

    #onKeyDown(event, self) {
        if (event.key === "ArrowRight") {
            self.drawNext();
        }
        else if (event.key === "ArrowLeft") {
            self.drawPrev();
        }
    }

}