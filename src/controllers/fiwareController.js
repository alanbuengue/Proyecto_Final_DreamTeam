const axios = require('axios');


const SERVER_IP  = '46.17.108.45';
const ORION_PORT = '1026';
const API_KEY    = 'asd12345';
const IOTA_PORT  = '7896';
const IOTA_SERVICE_PORT = '4041';


// ORION -----------------------------------------------------------------

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

// create Orion Ambiente Entity
exports.createOrionEntity = async function(req,res) {

    // params must come from req.body

   let { id, type, description, temperature, humidity, acidity } = req.body;

   if(!id || !type || !description || !temperature || !humidity || !acidity) {
         return res.status(400).send({error: "Missing parameters"});
    }
    
    let data = {
        "id":   id,
        "type": type,
        "description": description,
        "temperature": temperature,
        "humidity": humidity,
        "accidity": acidity
    };

    let config = {
        method: 'post',
        url: 'http://'+ SERVER_IP +':'+ ORION_PORT +'/v2/entities',
        headers: { 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
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
    
    let { id } = req.body;
    
    if(!id) {
        return res.status(400).send({error: "Missing parameters"});
    }

    let config = {
        method: 'delete',
        url: 'http://'+ SERVER_IP +':'+ ORION_PORT +'/v2/entities/' + id,
        headers: {},
        timeout: 2000,
    };

    try {
        let response = await axios(config);
        return res.status(204).send(response.data);
    } catch (err) {
        console.log(err)
        return res.send(err);
    }
};

// SENSOR -----------------------------------------------------------------

// Get Sensor Measurments Info.

exports.getSensorData = async function(req, res) {
    
    let { entityId, headers } = req.body;

    if(!entityId  || !headers) {
        return res.status(400).send({ error: "Missing parameters" });
    }

    let iotUrlGet = 'http://' + SERVER_IP + ':' + ORION_PORT + '/v2/entities/' + entityId;

    var config = {
        method: 'get',
        url: iotUrlGet,
        headers: headers,
        timeout: 3000
    };

    try {
        let response = await axios(config);
        return res.status(200).send(response.data);
    } catch (err) {
        return res.send(err);
    }
};

// IOT -----------------------------------------------------------------

// Sends Info to IOT Device as a Sensor Would

exports.sendSensorData = async function (req, res) {
    
    let { device_id, temperature, humidity, acidity, headers } = req.body;

    if(!device_id || !temperature || !humidity || !acidity || !headers) {
        return res.status(400).send({error: "Missing parameters"});
    }

    let iotUrlPost = 'http://' + SERVER_IP + ':' + IOTA_PORT + '/iot/json';
    
    // sends a string
    var data = JSON.stringify([
        {
            te: temperature
        },
        {
            hu: humidity
        },
        {
            ac: acidity
        }
    ]);

    var config = {
        method: 'post',
        url: iotUrlPost,
        headers: headers,
        params: {
            k: API_KEY,
            i: device_id
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


// Get IOT Services from a type 
exports.getIotServices = async function (req, res) {
    
    let { headers } = req.body;
    
    if(!headers) {
        return res.status(400).send({error: "Missing parameters"});
    }
    
    let orionUrl = 'http://' + SERVER_IP + ':' + IOTA_SERVICE_PORT + '/iot/services';
    
    let config = {
        method: 'get',
        url: orionUrl,
        headers: headers,
        timeout:2000
    };

    try {
        let response = await axios(config);
        return res.status(200).send(response.data);
    } catch (err) {
        return res.status(400).send(err);
    }
};

// Creates a IOT Service, to later provision a sensor for that Service

exports.createIotService = async function(req,res) {

    // a service needs an api key to restrict access
    let { services, method, configUrl, headers } = req.body;

    if(!services || !method || !configUrl || !headers) {
        return res.status(400).send({error: "Missing parameters"});
    }
    
    let data = {
        services
    };

    let config = {
        method: method,
        url: configUrl,
        headers: headers,
        timeout: 3000,
        data : data
    };

    try {
        let response = await axios(config);
        return res.status(201).send('Service Created: ' + response.data);
    } catch (err) {
        
        return res.send(err);
    }

    // After creating a Service the device should be created

}


// Creates a IOT Device for a given service

exports.createIotDevice = async function(req,res) {
    
    let {
        devices, headers
    } = req.body;

    device_id   = devices.device_id;
    entity_name = devices.entity_name;
    entity_type = devices.entity_type;
    timezone    = devices.timezone;
    attributes  = devices.attributes;
    static_attributes = devices.static_attributes;
    

    if(!device_id || !entity_name || !entity_type || !timezone || !attributes || !static_attributes || !headers || !devices) {
        return res.status(400).send({error: "Missing parameters"});
    }

    console.log(req.body);

    // Create IoT Agent
    // The device_id will later receive info. from a sensor / put request


    let data = JSON.stringify({
        "devices": devices
    });
    
    let config = {
        method: 'post',
        url: 'http://' + SERVER_IP + ':' + IOTA_SERVICE_PORT + '/iot/devices',
        headers: headers,
        timeout: 3000,
        data : data
    };
    
    try {
        let response = await axios(config);
        return res.status(201).send(response.data);
    } catch (err) {
        console.log(err)
        return res.send(err);
    }
    
}   