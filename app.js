const express = require('express')
const app = express();
const http = require('http').createServer(app);
const  io = require('socket.io')(http);
const HID = require('node-hid');
const devices = HID.devices();

const COLORS = {
    on: [38, 255, 0, 248, 7],
    off: [38, 255, 0, 249, 6],
    stronger : [38, 255, 0, 255, 0],
    lighter : [38, 255, 0, 253, 2],
    flash : [38, 255, 0, 240, 15],
    strobe : [38, 255, 0, 236, 19],
    smooth : [38, 255, 0, 232, 23],
    mode : [38, 255, 0, 228, 27],
    white : [38, 255, 0, 252, 3],
    red : [38, 255, 0, 247, 8],
    orangered : [38, 255, 0, 243, 12],
    darkorange : [38, 255, 0, 239, 16],
    orange : [38, 255, 0, 235, 20],
    gold : [38, 255, 0, 231, 24],
    green : [38, 255, 0, 246, 9],
    limegreen : [38, 255, 0, 242, 13],
    lightseagreen: [38, 255, 0, 238, 17],
    deepskyblue : [38, 255, 0, 234, 21],
    dodgerblue : [38, 255, 0, 230, 25],
    blue : [38, 255, 0, 245, 10],
    lightskyblue : [38, 255, 0, 241, 14],
    pink : [38, 255, 0, 237, 18],
    hotpink : [38, 255, 0, 233, 22],
    mediumvioletred : [38, 255, 0, 229, 26],
}

function getColorName(code){
    for (let key in COLORS) {
        if (COLORS[key].join() === code.join() ) return key
    }
}

function getDevice(devices, deviceName, callback) {
    devices.forEach(
        device => {
            if (device.product === deviceName) callback(new HID.HID(device.path));
        });

}

// "IR Receiver"
function encodeIrData(data) {
    return Buffer.from({"type": "Buffer", "data": data})
}

app.use(express.static('public'))

io.on('connection', (socket) => {
    console.log('a user connected');
    getDevice(devices, "IR Receiver", (device) => {
        device.on('data', data => {
            let decoded = JSON.stringify(data);  //{"type":"Buffer","data":[38,255,0,242,13]}
            let code = JSON.parse(decoded).data;
            console.log(code);
            socket.emit("change", getColorName(code));
        });
        device.on('error', err => console.log(err));
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});
