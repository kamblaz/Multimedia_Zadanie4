const process = (pixels) => {
    const colorsAverage = calculateSliceAverageColor(pixels);
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = colorsAverage.r;
        pixels[i + 1] = colorsAverage.g;
        pixels[i + 2] = colorsAverage.b;
    }
}

addEventListener('message', ({ data }) => {
    process(data.imageData.data);
    postMessage(data.imageData);
});

function calculateSliceAverageColor(pixels) {
    const colorsSum = {
        r: 0,
        g: 0,
        b: 0
    }
    for (let i = 0; i < pixels.length; i += 4) {
        colorsSum.r += pixels[i];
        colorsSum.g += pixels[i + 1];
        colorsSum.b += pixels[i + 2];
    }
    let pixelsCount = pixels.length / 4;
    return {
        r: colorsSum.r / pixelsCount,
        g: colorsSum.g / pixelsCount,
        b: colorsSum.b / pixelsCount
    }
}