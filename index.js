let imageData, context_input, context_output, context_noise;
const url = "maxresdefault.jpg";
const img = new Image();
const canvas_input = document.getElementById("canvas_input");
const canvas_output = document.getElementById("histogram_output");
const noise_output = document.getElementById("noise_output");
const start_button = document.getElementById("start_processing");
const noise_button = document.getElementById("start_noise");
var recXPos, recYPos, recHeight, recWidth;
var workers = [];

window.onload = function() {
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
        canvas_input.width = img.width;
        canvas_input.height = img.height;
        context_input = canvas_input.getContext("2d");
        context_input.drawImage(img, 0, 0);
        noise_output.width = img.width;
        noise_output.height = img.height;
        context_noise = noise_output.getContext("2d");
        context_noise.drawImage(img, 0, 0);
        canvas_output.width = img.width;
        canvas_output.height = 100;
        context_output = canvas_output.getContext("2d");
    };
    start_button.addEventListener('click', createHistogram);
    noise_button.addEventListener('click', createNoise);
};

function createHistogram() {
    const columnsRanges = getWorkersColumnsRanges();
    for (const ranges of columnsRanges) {
        for (const [start, end] of ranges) {
            const worker = new Worker('./worker.js');
            workers.push(worker);
            imageData = context_input.getImageData(start, 0, end - start, canvas_input.height);
            worker.addEventListener('message', createWorkerListener(start));
            worker.postMessage({ imageData }, [imageData.data.buffer]);
        }
    }
}

function createNoise() {
    var yPos;
    yPos = 0;
    for (let step = 0; step < 5; step++) {
        const worker = new Worker('./noiseWorker.js');
        const imageData = context_input.getImageData(0, yPos, 1280, 144);
        worker.addEventListener('message', createNoiseWorkerListener(0, yPos));
        worker.postMessage({ imageData }, [imageData.data.buffer]);
        yPos += 144;
    }

}

function createWorkerListener(start) {
    return ({ data }) => {
        context_output.putImageData(data, start, 0);
    }
}

function getWorkersColumnsRanges() {
    const width = canvas_input.width;
    const columnsRanges = [];
    let start = 0;
    for (let i = 0; i < width; i++) {
        let end = start + 1;
        columnsRanges.push([start, end]);
        start = end;
    }
    columnsRanges[columnsRanges.length - 1][1] = width;
    const columnsPerWorker = parseInt(width / 4);
    const workersColumns = [];
    while (columnsRanges.length !== 0) {
        workersColumns.push(columnsRanges.splice(0, columnsPerWorker));
    }
    return workersColumns;
}

function createNoiseWorkerListener(x, y) {
    return ({ data }) => {
        context_noise.putImageData(data, x, y);
    }
}