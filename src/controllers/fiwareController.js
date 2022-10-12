const axios = require('axios');

const SERVER_IP  = '46.17.108.45';
const ORION_PORT = '1026';
const API_KEY    = 'asd12345';
const IOTA_PORT  = '7896';
const IOTA_SERVICE_PORT = '4041';

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

// Get All Orion Entities
exports.getOrionEntities = async function (req, res) {
    let orionUrl = 'http://' + SERVER_IP + ':' + ORION_PORT + '/v2/entities';
    
    let config = {
        method: 'get',
        url: orionUrl,
        headers: { 
          'Fiware-Service': 'sensor', 
          'Fiware-ServicePath': '/'
        },
        timeout: 2000
      };

    try {
        let response = await axios(config);
        return res.status(200).send(response.data);
    } catch (err) {
        return res.status(400).send(err);
    }
};

// create Orion Entity
exports.createOrionEntity = async function(req,res) {

    // params must come from req.body

    let eName = "new_entity_2";
    let eId   = "new:002";
    let eType  = "Ambiente";
    let eDescription = "A new entity for y purpose";

    let service = "sensor";
    let ServicePath = "/";
    
    let data = JSON.stringify({
        "id":   eId,
        "type": eType,
        "description": {
            "value": eDescription,
            "type":  "Text"
        },
        // ENTITY VALUES _ Structure
        "online": {
            "value": true,
            "type": "Boolean"
        },
        "temperature": {
            "value": 24,
            "type": "Number"
        },
        "humidity": {
            "value": 56,
            "type": "Number"
        },
        "pressure": {
            "value": 1,
            "type": "Number"
        },
        
    });

    let config = {
        method: 'post',
        url: 'http://'+ SERVER_IP +':'+ ORION_PORT +'/v2/entities',
        headers: { 
            'Fiware-Service': service, 
            'Fiware-ServicePath': ServicePath, 
            'X-Auth-Token': API_KEY, 
            'Content-Type': 'application/json'
        },
            timeout: 2000,
            data : data
    };

    try {
        let response = await axios(config);
        return res.status(201).send(response.data);
    } catch (err) {
        
        return res.send(err);
    }

};

// Delete Orion Entity
exports.deleteEntity = async function(req,res) {
    
    // entity data
    // let entityId = req.body.entityId;
    let service     = "sensor";
    let servicePath = "/";
    let entityId    = "new:002";

    let config = {
        method: 'delete',
        url: 'http://'+ SERVER_IP +':'+ ORION_PORT +'/v2/entities/' + entityId,
        headers: { 
            'Fiware-Service': service, 
            'Fiware-ServicePath': servicePath, 
            'X-Auth-Token': API_KEY
        },
        timeout: 2000,
    };

    try {
        let response = await axios(config);
        return res.status(201).send(response.data);
    } catch (err) {
        console.log(err)
        return res.send(err);
    }
};

// Get Sensor Measurments Info.

exports.getSensorData = async function(req, res) {
    
    // these should come from req.body / req.params
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


// Sends Info to IOT Device as a Sensor Would

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


// Creates a IOT Service, to later provision a sensor for that Service

exports.createIotService = async function(req,res) {

    // service name should come from req.body
    // a service needs an api key to restrict access

    let SERVICE_NAME   = 'test';
    let CBROKER_URL    = 'http://' + SERVER_IP + ':' + ORION_PORT;
    let IOT_CONFIG_URL = 'http://' + SERVER_IP + ':' + IOTA_SERVICE_PORT+ "/iot/services";
    let ENTITY_TYPE    = 'Ambiente';
    let SERVICE_PATH   = '/';
    let NEW_API_KEY    = '555ppp'; 

    let data = JSON.stringify({
        "services": [
            {
            "apikey": NEW_API_KEY,
            "cbroker": CBROKER_URL,
            "entity_type": ENTITY_TYPE,
            "resource": "/iot/json"
            }
        ]
    });

    let config = {
        method: 'post',
        url: IOT_CONFIG_URL,
        headers: { 
            'Fiware-Service': SERVICE_NAME, 
            'Fiware-ServicePath': SERVICE_PATH, 
            'Content-Type': 'application/json'
        },
        timeout: 3000,
        data : data
    };

    try {
        let response = await axios(config);
        return res.status(201).send(response.data);
    } catch (err) {
        
        return res.send(err);
    }

    // After creating a Service the device should be created

}


// Creates a IOT Device for a given service

exports.createIotDevice = async function(req,res) {

    // Create IoT Agent
    // The device_id will later receive info. from a sensor / put request

    let IOT_DEVICE_ID   = "ambiente-sensor:002";
    let IOT_ENTITY_NAME = "ambiente:002";
    let ENTITY_TYPE     = "Ambiente";

    let SERVICE_NAME = "test";
    let SERVICE_PATH = "/";
    let NEW_API_KEY  = "555ppp";

    let entity_atributes = [
        {
            "object_id": "ac",
            "name": "acidity",
            "type": "Float"
        },
        {
            "object_id": "hu",
            "name": "humidity",
            "type": "Float"
        },
        {
            "object_id": "te",
            "name": "temperature",
            "type": "Float"
        }
    ];

    let data = JSON.stringify({
        "devices": [
        {
            "device_id": IOT_DEVICE_ID,
            "entity_name": IOT_ENTITY_NAME,
            "entity_type": ENTITY_TYPE,
            "timezone": "America/Buenos_Aires",
            "attributes": entity_atributes,
            "static_attributes": [
            {
                "name": "refStore",
                "type": "Relationship",
                // VER ESTO STORE NUEVO?
                "value": "urn:ngsi-ld:Store:001"
            }
            ]
        }
        ]
    });
    
    let config = {
        method: 'post',
        url: 'http://' + SERVER_IP + ':' + IOTA_SERVICE_PORT + '/iot/devices',
        headers: { 
            'Fiware-Service': SERVICE_NAME, 
            'Fiware-ServicePath': SERVICE_PATH, 
            'X-Auth-Token': NEW_API_KEY, 
            'Content-Type': 'application/json'
            },
        timeout: 3000,
        data : data
    };
    
    try {
        let response = await axios(config);
        return res.status(201).send(response.data);
    } catch (err) {
        return res.send(err);
    }

}