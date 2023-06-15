// Copyright 2023 Takamasa Sugiura
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
    cursorVisible = false;
    cursorStyle = "#FF000099";
    autoSlide = false;
    autoSlideInterval = 50;
    autoSlideCounter = 0;
    loopSlide = false;
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
    size = 0;
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
class SoDirection {
    name = "";
    static TopLeft = new SoDirection("TopLeft");
    static Top = new SoDirection("Top");
    static TopRight = new SoDirection("TopRight");
    static Left = new SoDirection("Left");
    static Center = new SoDirection("Center");
    static Right = new SoDirection("Right");
    static BottomLeft = new SoDirection("BottomLeft");
    static Bottom = new SoDirection("Bottom");
    static BottomRight = new SoDirection("BottomRight");

    constructor(name) {
        this.name = name;
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
        data.canvas.addEventListener("mousemove", (event) => this.#onMouseMoveCallback(event, data, this.#drawCore));
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
        else if (data.loopSlide) {
            data.currentIndex = 0;
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

    showCursor() {
        const data = this.#slideOneData;
        data.cursorVisible = true;
    }

    hideCursor() {
        const data = this.#slideOneData;
        data.cursorVisible = false;
    }

    enableMouseDownEvent() {
        const data = this.#slideOneData;
        data.canvas.addEventListener("mousedown", (event) => this.#onMouseDownCallback(event, data, this.#drawCore));
    }

    enableKeyDownEvent(target) {
        if (target === undefined) {
            target = window;
        }
        target.addEventListener("keydown", (event) => this.#onKeyDown(event, this))
    }

    enableLoopSlide() {
        const data = this.#slideOneData;
        data.loopSlide = true;
    }

    enableAutoSlide() {
        const data = this.#slideOneData;
        data.autoSlide = true;
    }

    get autoSlideInterval () {
        return this.#slideOneData.autoSlideInterval;
    }

    set autoSlideInterval (seconds) {
        this.#slideOneData.autoSlideInterval = seconds * 10;
    }

    startTimer() {
        setInterval(() => {
            const data = this.#slideOneData;
            data.timerCount ++;
            if (data.timerCount >= 10000) {
                data.timerCount = 0;
            }
            if (data.autoSlide) {
                data.autoSlideCounter ++;
                if (data.autoSlideCounter >= data.autoSlideInterval) {
                    if (data.currentIndex < data.slides.length - 1) {
                        data.currentIndex++;
                        this.#drawCore(data);
                    }
                    else if (data.loopSlide) {
                        data.currentIndex = 0;
                        this.#drawCore(data);
                    }
                    data.autoSlideCounter = 0;
                    return;
                }
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
                            layer.size = textLayerSource.size;
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
                let textY = layer.y;
                let multiLine = layer.text.split("\n");
                for (let lineCount = 0; lineCount < multiLine.length; lineCount ++) {
                    offScreenCtx.fillText(multiLine[lineCount], layer.x, textY);
                    textY += layer.size;
                }
            }
        }
        for (let effectIndex = 0; effectIndex < data.foregroundEffects.length; effectIndex++) {
            const effect = data.foregroundEffects[effectIndex];
            effect.draw(effectParameter);
        }
        if (data.cursorVisible) {
            offScreenCtx.beginPath();
            offScreenCtx.fillStyle = data.cursorStyle;
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
        else if (data.loopSlide) {
            data.currentIndex = 0;
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