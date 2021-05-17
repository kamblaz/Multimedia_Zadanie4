self.onmessage = e => {
    //const { imageData, filter } = e.data;
    const { imageData } = e.data;
    // if (filter == 'none') {
    //     none();
    // } else {
    //     grayscale(imageData);
    // }
    grayscale(imageData);
    self.postMessage(imageData, [imageData.data.buffer], i);
};

var x = 0;
var i = 0

function none() { x = 0 }

function grayscale({ data: d }) {
    // console.log(x);
    for (i = 0; i < d.length; i += 4) {
        const [r, g, b] = [d[i], d[i + 1], d[i + 2]];
        d[i] = d[i + 1] = d[i + 2] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    x++;
};