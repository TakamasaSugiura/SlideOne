class ClockEffect {
    direction = SoDirection.BottomRight;
    margin = 10;

    constructor(direction) {
        if (direction instanceof SoDirection) {
            this.direction = direction;
        }
        else if (direction !== undefined) {
            this.direction = new SoDirection(direction);
        }
    }

    draw(data) {
        const ctx = data.ctx;
        const today = new Date();
        const secondSource = "00" + today.getSeconds();
        const minuteSource = "00" + today.getMinutes();
        const time = today.getHours() + ":" + minuteSource.substring(minuteSource.length - 2, minuteSource.length) + ":" + secondSource.substring(secondSource.length - 2, secondSource.length);
        ctx.font = "48px sans"
        ctx.fillStyle = "white";
        if (this.direction.name == "TopLeft") {
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillText(time, this.margin, this.margin);
        }
        else if (this.direction.name === "Top") {
            ctx.textBaseline = "top";
            ctx.textAlign = "center";
            ctx.fillText(time, data.canvasRect.w / 2, this.margin);
        }
        else if (this.direction.name === "TopRight") {
            ctx.textBaseline = "top";
            ctx.textAlign = "right";
            ctx.fillText(time, data.canvasRect.w - this.margin, this.margin);
        }
        else if (this.direction.name === "Left") {
            ctx.textBaseline = "middle";
            ctx.textAlign = "left";
            ctx.fillText(time, this.margin, data.canvasRect.h / 2);
        }
        else if (this.direction.name === "Center") {
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText(time, data.canvasRect.w / 2, data.canvasRect.h / 2);
        }
        else if (this.direction.name === "Right") {
            ctx.textBaseline = "middle";
            ctx.textAlign = "right";
            ctx.fillText(time, data.canvasRect.w - this.margin, data.canvasRect.h / 2);
        }
        else if (this.direction.name === "BottomLeft") {
            ctx.textBaseline = "bottom";
            ctx.textAlign = "left";
            ctx.fillText(time, this.margin, data.canvasRect.h - this.margin);
        }
        else if (this.direction.name === "Bottom") {
            ctx.textBaseline = "bottom";
            ctx.textAlign = "center";
            ctx.fillText(time, data.canvasRect.w / 2, data.canvasRect.h - this.margin);
        }
        else if (this.direction.name === "BottomRight") {
            ctx.textBaseline = "bottom";
            ctx.textAlign = "right";
            ctx.fillText(time, data.canvasRect.w - this.margin, data.canvasRect.h - this.margin);
        }
    }
}