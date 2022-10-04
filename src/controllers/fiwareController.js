
const axios = require('axios');

const SERVER_IP = "46.17.108.45";
const ORION_PORT = "1026";

// Get Orion Version
exports.getVersion = async function(req,res) {
    
    let orionUrl = "http://" + SERVER_IP + ":" + ORION_PORT + "/version";
    
    let config = {
        method: 'get',
        url: orionUrl,
        headers: {}
    };
      
    try {
        let response = await axios(config);
        return res.status(200).send(response.data);  
    } catch(err) {
        return res.status(400).send(err);
    }
    

}

// Get Orion Entities
exports.getOrionEntities = async function(req,res) {
    
    let orionUrl = "http://" + SERVER_IP + ":" + ORION_PORT + "/v2/entities";
    
    let config = {
        method: 'get',
        url: orionUrl,
        headers: {}
    };
      
    try {
        let response = await axios(config);
        return res.status(200).send(response.data);  
    } catch(err) {
        return res.status(400).send(err);
    }

}