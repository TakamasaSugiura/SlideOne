class ClockEffect {
    direction = "BottomRight";
    margin = 10;
    size = 48;
    color = "white";

    constructor(parameter) {
        if (typeof parameter === "string") {
            this.direction = parameter;
            return;
        }
        if (parameter.direction !== undefined) {
            this.direction = parameter.direction;
        }
        if (parameter.margin !== undefined) {
            this.margin = parameter.margin;
        }
        if (parameter.size !== undefined) {
            this.size = parameter.size;
        }
        if (parameter.color !== undefined) {
            this.color = parameter.color;
        }
    }

    draw(data) {
        const ctx = data.ctx;
        const today = new Date();
        const secondSource = "00" + today.getSeconds();
        const minuteSource = "00" + today.getMinutes();
        const time = today.getHours() + ":" + minuteSource.substring(minuteSource.length - 2, minuteSource.length) + ":" + secondSource.substring(secondSource.length - 2, secondSource.length);
        ctx.font = this.size + "px sans"
        ctx.fillStyle = this.color;
        const direction = this.direction.toUpperCase();
        if (direction == "TOPLEFT") {
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillText(time, this.margin, this.margin);
        }
        else if (direction === "TOP") {
            ctx.textBaseline = "top";
            ctx.textAlign = "center";
            ctx.fillText(time, data.canvasRect.w / 2, this.margin);
        }
        else if (direction === "TOPRIGHT") {
            ctx.textBaseline = "top";
            ctx.textAlign = "right";
            ctx.fillText(time, data.canvasRect.w - this.margin, this.margin);
        }
        else if (direction === "LEFT") {
            ctx.textBaseline = "middle";
            ctx.textAlign = "left";
            ctx.fillText(time, this.margin, data.canvasRect.h / 2);
        }
        else if (direction === "CENTER") {
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText(time, data.canvasRect.w / 2, data.canvasRect.h / 2);
        }
        else if (direction === "RIGHT") {
            ctx.textBaseline = "middle";
            ctx.textAlign = "right";
            ctx.fillText(time, data.canvasRect.w - this.margin, data.canvasRect.h / 2);
        }
        else if (direction === "BOTTOMLEFT") {
            ctx.textBaseline = "bottom";
            ctx.textAlign = "left";
            ctx.fillText(time, this.margin, data.canvasRect.h - this.margin);
        }
        else if (direction === "BOTTOM") {
            ctx.textBaseline = "bottom";
            ctx.textAlign = "center";
            ctx.fillText(time, data.canvasRect.w / 2, data.canvasRect.h - this.margin);
        }
        else {
            ctx.textBaseline = "bottom";
            ctx.textAlign = "right";
            ctx.fillText(time, data.canvasRect.w - this.margin, data.canvasRect.h - this.margin);
        }
    }
}