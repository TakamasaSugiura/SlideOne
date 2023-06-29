# SlideOne

A slide show library for html/javascript

# Constructor

## SlideOne

| parameter | description |
|--|--|
| canvas | A target canvas id or canvas element |
| slideOneSource | Image sources. It could be an array of image names or an object described bellow |

### slide One source

| property | description |
|--|--|
| bg | A back ground image file (optional) |
| slides | Image names or slide objects |
| fullWindow | Resize drawing area automatically. (optional, default = true) |
| enableMouseDownEvent | (optional, default = true) |
| enableKeyDownEvent | (optional, default = true) |
| loop | (optional, default = true) |
| showCursor | (optional, default = true) |


# Methods

## Start

Start to load and draw images.

| parameter | description |
|--|--|
| onLoadCallback | An callback function called after loading. (optional) |


# Usage

## Example1

```html
<canvas id="canvas" width="1920" height="1080" style="display: block; margin: auto;  position: absolute; top:50%; left:50%; transform: translate(-50%, -50%);"></canvas>
<script src="../SlideOne.js"></script>
<script>
    const _canvas = document.getElementById("canvas");
    const _slide = new SlideOne(_canvas, ["images/1.jpg", "images/2.jpg", "images/3.jpg", "images/4.jpg"]);
    _slide.start();
</script>
```

