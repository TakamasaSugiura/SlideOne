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