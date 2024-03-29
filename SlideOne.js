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
    bg = undefined;
    slides = [];
    fullWindow = true;
    enableMouseDownEvent = true;
    enableKeyDownEvent = true;
    loop = true;
    showCursor = true;

    constructor(src) {
        if (src instanceof Array) {
            for (const elem of src) {
                this.slides.push(new SoSlideSource(elem));
            }
        }
        else {
            this.bg = src.bg;
            if (src !== undefined && src.slides instanceof Array) {
                for (const elem of src.sllides) {
                    this.slides.push(new SoSlideSource(elem));
                }
            }
        }
    }
}

class SoSlideSource {
    layers = [];

    constructor(src) {
        if (src !== undefined) {
            if (src instanceof Array) {
                for (const elem of src) {
                    this.layers.push(this.#createLayerSource(elem));
                }
            }
            else {
                this.layers.push(this.#createLayerSource(src));
            }
        }
    }

    #createLayerSource(src) {
        if (src.t === undefined && src.text === undefined) {
            return new SoImageLayerSource(src);
        }
        else {
            return new SoTextLayerSource(src)
        }
    }
}

class SoImageLayerSource {
    image = "";
    x = 0;
    y = 0;
    w = -1;
    h = -1;
    anchor = "topleft";

    constructor(src) {
        if (src !== undefined) {
            if (typeof src === "string") {
                this.image = src;
            }
            else {
                this.image = src.image !== undefined ? src.image :
                    src.img !== undefined ? src.img :
                    src.i !== undefined ? src.i : this.image;
                this.x = src.x === undefined ? this.x : src.x;
                this.y = src.y === undefined ? this.y : src.y;
                this.w = src.w === undefined ? this.w : src.w;
                this.h = src.h === undefined ? this.h : src.h;
                this.anchor = src.anchor !== undefined ? src.anchor :
                    src.a !== undefined ? src.a : this.anchor;
            }
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
    anchor = "topleft";
    x = 0;
    y = 0;

    constructor(src) {
        if (src !== undefined) {
            this.text = src.text !== undefined ? src.text :
                src.t !== undefined ? src.t : this.text;
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
    ready = false;
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

class SlideOne {
    #slideOneData = new SoData();
    currentIndex = 0;
    #funcDict = {};

    constructor(canvasSource, parameter) {
        const canvas = this.#getCanvas(canvasSource);
        const src = new SlideOneSource(parameter);
        this.#init(canvas, src);
    }

    #init(canvas, slideOneSource){
        const data = new SoData();
        data.defaultWidth = canvas.width;
        data.defaultHeight = canvas.height;
        data.source = slideOneSource;
        data.canvas = canvas;
        data.ctx = canvas.getContext("bitmaprenderer");
        const funcDict = this.#funcDict;

        // funcs
        funcDict["loadBg"] = this.#loadBg;
        funcDict["loadFg"] = this.#loadFg;
        funcDict["setLayerPosition"] = this.#setLayerPosition;

        this.#slideOneData = data;
        
        //this.#loadBg(data, funcDict);
        if (slideOneSource.enableMouseDownEvent !== false) {
            this.#enableMouseDownEvent();
        }
        if (slideOneSource.enableKeyDownEvent !== false) {
            this.#enableKeyDownEvent();
        }
        if (slideOneSource.loop !== false) {
            this.#enableLoopSlide();
        }
        if (slideOneSource.showCursor !== false) {
            data.canvas.addEventListener("mousemove", (event) => this.#onMouseMoveCallback(event, data, this.#drawCore));
            this.#showCursor();
        }
        if (slideOneSource.fullWindow !== false) {
            this.#enableFullWindowMode();
            this.resize(window.innerWidth, window.innerHeight);
        }
    }

    start(onLoadCallback) {
        const data = this.#slideOneData;
        const funcDict = this.#funcDict;
        funcDict["onLoadCallback"] = onLoadCallback;
        if (data.ready) {
            return;
        }
        this.#loadBg(data, funcDict);
    }


    draw() {
        const data = this.#slideOneData;
        this.#drawCore(data);
    }

    drawNext(loop) {
        const data = this.#slideOneData;
        const fgImageCount = data.slides.length;
        if (loop === undefined) {
            loop = data.loopSlide;
        }
        if (data.currentIndex < fgImageCount - 1) {
            data.currentIndex++;
            this.draw();
        }
        else if (loop) {
            data.currentIndex = 0;
            this.draw();
        }
    }

    drawPrev(loop) {
        const data = this.#slideOneData;
        const fgImageCount = data.slides.length;
        if (loop === undefined) {
            loop = data.loopSlide;
        }
        if (0 < data.currentIndex) {
            data.currentIndex--;
            this.draw();
        }
        else if (loop) {
            data.currentIndex = fgImageCount - 1;
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

    #showCursor() {
        const data = this.#slideOneData;
        data.cursorVisible = true;
    }

    #enableMouseDownEvent() {
        const data = this.#slideOneData;
        data.canvas.addEventListener("mousedown", (event) => this.#onMouseDownCallback(event, data, this.#drawCore));
    }

    #enableKeyDownEvent(target) {
        if (target === undefined) {
            target = window;
        }
        target.addEventListener("keydown", (event) => this.#onKeyDown(event, this));
    }

    #enableLoopSlide() {
        const data = this.#slideOneData;
        data.loopSlide = true;
    }

    #enableFullWindowMode() {
        window.addEventListener('resize', () => this.resize(window.innerWidth, window.innerHeight), false);
    }

    #setLayerPosition(dst, defaultWidth, defaultHeight) {
        const w = dst.w < 0 ? dst.image !== undefined ? dst.image.width : 0 : dst.w;
        const h = dst.h < 0 ? dst.image !== undefined ? dst.image.height : 0 : dst.h;
        const anchor = dst.anchor.toLowerCase();
        if (anchor === "top") {
            dst.x += (defaultWidth - w) / 2;
        }
        else if (anchor === "topright") {
            dst.x += (defaultWidth - w);
        }
        else if (anchor === "left") {
            dst.y += (defaultHeight - h) / 2;
        }
        else if (anchor === "center") {
            dst.x += (defaultWidth - w) / 2;
            dst.y += (defaultHeight - h) / 2;
        }
        else if (anchor === "right") {
            dst.x += (defaultWidth - w);
            dst.y += (defaultHeight - h) / 2;
        }
        else if (anchor === "bottomleft") {
            dst.y += (defaultHeight - h);
        }
        else if (anchor === "bottom") {
            dst.x += (defaultWidth - w) / 2;
            dst.y += (defaultHeight - h);
        }
        else if (anchor === "bottomright") {
            dst.x += (defaultWidth - w);
            dst.y += (defaultHeight - h);
        }
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

    #getCanvas(src) {
        if (typeof src === "string") {
            return document.getElementById(src);
        }
        return src;
    }

    #loadBg(data, funcDict) {
        const source = data.source;
        if (source.bg !== undefined) {
            const bgImage = new Image();
            bgImage.src = source.bg;
            data.bg = bgImage;
            bgImage.onload = () => funcDict["loadFg"](data, funcDict);
        }
        else {
            funcDict["loadFg"](data, funcDict);
        }
    }

    #loadFg(data, funcDict) {
        // ! メンバーアクセス禁止
        const source = data.source;
        const fileCount = source.slides.length;
        const loadingList = [];
        for (const slide of source.slides) {
            const slideData = new SoSlideData();
            if (typeof slide === "string") { // TEXTの場合は、画像ファイルとして扱う
                const layer = new SoImageLayer();
                const fgImage = new Image();
                loadingList.push({image: fgImage, file: slide, layer: layer});
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
                for (const layerSource of layersSource) {
                    if (layerSource.image !== undefined) {
                        const layer = new SoImageLayer();
                        const fgImage = new Image();
                        loadingList.push({image: fgImage, file: layerSource.image, layer: layer});
                        layer.image = fgImage;
                        layer.x = layerSource.x;
                        layer.y = layerSource.y;
                        layer.w = layerSource.w;
                        layer.h = layerSource.h;
                        layer.anchor = layerSource.anchor;
                        slideData.layers.push(layer);
                    }
                    else if(layerSource.text !== undefined) {
                        const layer = new SoTextLayer();
                        layer.font = layerSource.size + "px " + layerSource.font;
                        layer.size = layerSource.size;
                        layer.style = layerSource.color;
                        layer.text = layerSource.text;
                        layer.align = layerSource.align;
                        layer.baseline = layerSource.baseline;
                        layer.x = layerSource.x;
                        layer.y = layerSource.y;
                        slideData.layers.push(layer);
                    }
                }
            }
            data.slides.push(slideData);
        }

        const loadingFunc = (idx, dat) => {
            if (idx < loadingList.length) {
                loadingList[idx].image.src = loadingList[idx].file;
                loadingList[idx].image.onload = () => {
                    funcDict["setLayerPosition"](loadingList[idx].layer, dat.defaultWidth, dat.defaultHeight);
                    loadingFunc(idx + 1, dat);
                };
            }
            else {
                data.ready = true;
                const onLoadCallback = funcDict["onLoadCallback"];
                if (onLoadCallback) {
                    onLoadCallback();
                }
            }
        }
        loadingFunc(0, data);
    }
    
    #drawCore(data) {
        if (!data.ready) {
            return;
        }
        const canvasCtx = data.ctx;
        const bgImage = data.bg;
        const slide = data.slides[data.currentIndex];
        const defaultWidth = data.defaultWidth;
        const defaultHeight = data.defaultHeight;
        const offScreenCanvas = new OffscreenCanvas(defaultWidth, defaultHeight);
        const offScreenCtx = offScreenCanvas.getContext("2d");
        if (bgImage !== null) {
            offScreenCtx.drawImage(bgImage, 0, 0, defaultWidth, defaultHeight);
        }
        const effectParameter = new SoEffectParameter(offScreenCtx, data);
        for (const effect of data.backgroundEffects) {
            effect.draw(effectParameter);
        }
        for (const layer of slide.layers) {
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
                for (const line of multiLine) {
                    offScreenCtx.fillText(line, layer.x, textY);
                    textY += layer.size;
                }
            }
        }
        for (const effect of data.foregroundEffects) 
        {
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
        return [width, height];
    }

    #onMouseDownCallback(event, data, drawFunc){
        if (event.buttons !== 1) {
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