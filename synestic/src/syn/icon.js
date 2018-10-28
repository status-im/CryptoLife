// The random number is a js implementation of the Xorshift PRNG
import Prando from 'prando';

const LAYOUT = [
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4],
    [4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4],
    [4, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4],
    [4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4],
    [4, 4, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 4, 4],
    [4, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4],
    [4, 4, 3, 3, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 4],
    [4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4],
    [4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4],
    [4, 4, 3, 3, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 4],
    [4, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4],
    [4, 4, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 4, 4],
    [4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4],
    [4, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4],
    [4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4],
    [4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
]

function createColor(rng) {
    //saturation is the whole color spectrum
    var h = Math.floor(rng.next() * 360);
    //saturation goes from 40 to 100, it avoids greyish colors
    var s = ((rng.next() * 60) + 40) + '%';
    //lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
    var l = ((rng.next() + rng.next() + rng.next() + rng.next()) * 25) + '%';

    var color = 'hsl(' + h + ',' + s + ',' + l + ')';
    return color;
}

function createImageData(size, rng) {
    var width = size; // Only support square icons for now
    var height = size;

    var dataWidth = Math.ceil(width / 2);
    var mirrorWidth = width - dataWidth;

    var data = [];
    for (var y = 0; y < height; y++) {
        var row = [];
        for (var x = 0; x < dataWidth; x++) {
            // this makes foreground and background color to have a 43% (1/2.3) probability
            // spot color has 13% chance
            row[x] = Math.floor(rng.next() * 2.3);
        }
        var r = row.slice(0, mirrorWidth);
        r.reverse();
        row = row.concat(r);

        for (var i = 0; i < row.length; i++) {
            data.push(row[i]);
        }
    }

    return data;
}

function buildOpts(syn) {
    var opts = {};

    opts.seed = syn.seed;
    opts.rng = new Prando(syn.hash);

    opts.size = 40
    opts.scale = 5
    opts.trackColors = [
        createColor(opts.rng),
        createColor(opts.rng),
        createColor(opts.rng),
        createColor(opts.rng),
        createColor(opts.rng),
    ];

    return opts;
}

export function renderIcon(syn, canvas) {
    let opts = buildOpts(syn);
    var imageData = createImageData(opts.size, opts.rng);
    var width = Math.sqrt(imageData.length);

    canvas.width = canvas.height = opts.size * opts.scale;
    var cc = canvas.getContext('2d');

    // for (let i = 0; i < 5; i++) {
    //     cc.fillStyle = opts.bgcolor;
    //     cc.fillRect(
    //         i*opts.scale*2, 
    //         i*opts.scale*2,
    //         canvas.width - i*opts.scale*2, 
    //         canvas.height - i*opts.scale*2, 
    //     );
    //     cc.fillStyle = opts.trackColors[i];
    // }

    for (var i = 0; i < imageData.length; i++) {
        var row = Math.floor(i / width);
        var col = i % width;
        var track = LAYOUT[parseInt(row / 2)][parseInt(col / 2)];

        // if data is 0, leave the background
        if (imageData[i] && Object.values(syn.tracks)[track].enabled) {

            // if data is 2, choose spot color, if 1 choose foreground
            cc.fillStyle = opts.trackColors[track]
            cc.fillRect(col * opts.scale, row * opts.scale, opts.scale, opts.scale);
        }
    }
    return canvas;
}