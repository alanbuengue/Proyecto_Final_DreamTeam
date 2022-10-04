
const axios = require('axios');


// Get Orion Version
exports.getVersion = async function(req,res) {
    
    let serverIp = "46.17.108.45";
    let orionPort = "1026";
    
    let orionUrl = "http://" + serverIp + ":" + orionPort + "/version";
    
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
    
    let serverIp = "46.17.108.45";
    let orionPort = "1026";
    
    let orionUrl = "http://" + serverIp + ":" + orionPort + "/v2/entities";
    
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