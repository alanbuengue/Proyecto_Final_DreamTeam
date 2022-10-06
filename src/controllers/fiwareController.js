const axios = require('axios');

const SERVER_IP = '46.17.108.45';
const ORION_PORT = '1026';
const API_KEY = 'asd12345';
const IOTA_PORT = '7896';

// Get Orion Version
exports.getVersion = async function (req, res) {
    let orionUrl = 'http://' + SERVER_IP + ':' + ORION_PORT + '/version';

    let config = {
        method: 'get',
        url: orionUrl,
        headers: {}
    };

    try {
        let response = await axios(config);
        return res.status(200).send(response.data);
    } catch (err) {
        return res.status(400).send(err);
    }
};

// Get Orion Entities
exports.getOrionEntities = async function (req, res) {
    let orionUrl = 'http://' + SERVER_IP + ':' + ORION_PORT + '/v2/entities';

    let config = {
        method: 'get',
        url: orionUrl,
        headers: {}
    };

    try {
        let response = await axios(config);
        return res.status(200).send(response.data);
    } catch (err) {
        return res.status(400).send(err);
    }
};

exports.sendSensorData = async function (req, res) {
    // must come from req.body
    let IOT_DEVICE_ID = 'ambiente-sensor:001';
    let FIWARE_SERVICE = 'sensor';
    let SERVICE_PATH = '/';

    let iotUrlPost = 'http://' + SERVER_IP + ':' + IOTA_PORT + '/iot/json';

    // sensor data should be randomly generated

    let temp = '18';
    let hum = '22.2';
    let aci = '7.3';

    // sends a string
    var data = JSON.stringify([
        {
            te: temp
        },
        {
            hu: hum
        },
        {
            ac: aci
        }
    ]);

    var config = {
        method: 'post',
        url: iotUrlPost,
        headers: {
            'Fiware-Service': FIWARE_SERVICE,
            'Fiware-ServicePath': SERVICE_PATH,
            'X-Auth-Token': API_KEY,
            'Content-Type': 'application/json'
        },
        params: {
            k: API_KEY,
            i: IOT_DEVICE_ID
        },
        data: data
    };

    try {
        let response = await axios(config);
        return res.status(201).send(response.data);
    } catch (err) {
        return res.status(400).send(err);
    }
};

exports.getSensorData = async function (req, res) {
    // must come from req.body

    let ENTITY_ID = 'ambiente:001';
    let ENTITY_TYPE = 'Ambiente';
    let FIWARE_SERVICE = 'sensor';
    let SERVICE_PATH = '/';

    let iotUrlGet = 'http://' + SERVER_IP + ':' + ORION_PORT + '/v2/entities/' + ENTITY_ID;

    var config = {
        method: 'get',
        url: iotUrlGet,
        headers: {
            Accept: '*/*',
            Connection: 'keep-alive',
            'Fiware-Service': FIWARE_SERVICE,
            'Fiware-ServicePath': SERVICE_PATH
        },
        params: {
            type: ENTITY_TYPE
        },
        timeout: 3000
    };

    try {
        let response = await axios(config);
        return res.status(201).send(response.data);
    } catch (err) {
        return res.send(err);
    }
};
