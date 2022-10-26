const axios = require('axios');
const { use } = require('chai');
const chai = require('chai');
const { DESCRIBE } = require('sequelize');
const { assert } = chai;


// Testing fiware api with mocha
// router.get('/orion', fiwareController.getVersion);

describe('Orion Tests', function () {
    
    it('Shoul Get Orion Version', function (done) {
        axios({
            method: 'get',
            url: 'http://localhost/orion',
        }).then(res => {
            assert.equal(res.status,200);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Should Get Orion Entities', function (done) {
        axios({
            method: 'get',
            url: 'http://localhost/orion/entities',
        }).then(res => {
            assert.equal(res.status,200);
            // console.log(res.data);
            done();
        }).catch(err => {
            done(err);
        });
    });

    // post ambiente entity
    it('Should Create Orion Ambiente Entity', function (done) {
        
        axios({
            method: 'post',
            url: 'http://localhost/orion/entities',
            
            data: {
                'id': 'urn:ngsi-ld:Device:919',
                'type': 'MyNewType',
                'description': {
                    'value': 'My entity description',
                    'type': 'Text',
                },
                'temperature': {
                    'type': 'float',
                    'value': '99.0'
                },
                'humidity': {
                    'type': 'float',
                    'value': '99.0'
                },
                'acidity': {
                    'type': 'float',
                    'value': '99.0'
                }    
            }
        }).then(res => {
            assert.equal(res.status,201);
            done();
        }).catch(err => {
            console.log(err);
            done(err);
        });
    });


    // delete entity
    it('Should Delete Orion Entity', function (done) {
        axios({
            method: 'delete',
            url: 'http://localhost/orion/entities',
            data: {
                'id': 'urn:ngsi-ld:Device:919',
            }
        }).then(res => {
            assert.equal(res.status,204);
            done();
        }).catch(err => {
            done(err);
        });
    });

    // IOT DEVICE TESTS
    
    // get iot info
    it('Should Get Iot Info', function (done) {
        axios({
            method: 'get',
            url: 'http://localhost/iot',
            data: {
                'entityId': 'ambiente:001',
                'entityType': 'ambiente',
                'headers': {
                    'Fiware-Service': 'sensor',
                    'Fiware-Servicepath': '/'
                }
            }
        }).then(res => {
            assert.equal(res.status,200);
            // console.log(res.data);
            done();
        }).catch(err => {
            done(err);
        });
    });


    // Create iot service
    it ('Should Create A IOT Service', function (done) {
        axios({
            method: 'post',
            url: 'http://localhost/iot/services',
            data: {
                'services': [
                    {
                      'apikey': 'test1234',
                        'cbroker': 'http://46.17.108.45:1026',
                        'entity_type': 'Ambiente',
                        'resource': '/iot/json',
                    }],
                'method': 'post',
                'configUrl': 'http://46.17.108.45:4041/iot/services',
                'entityType': 'Ambiente',
                'resource': '/iot/json',
                'headers': { 
                    'Fiware-Service': 'testService3', 
                    'Fiware-ServicePath': '/', 
                    'Content-Type': 'application/json'
                }
            }
        
        }).then(res => {
            assert.equal(res.status,201);
            done();
        }).catch(err => {
            done(err);
        });
    });        

    // get iot service
    it('Should Get Iot Created Service', function (done) {
        axios({
            method: 'get',
            url: 'http://localhost/iot/services',
            data: {
                'headers': { 
                    'Fiware-Service': 'testService3', 
                    'Fiware-ServicePath': '/', 
                    'Content-Type': 'application/json'
                }
            }
        }).then(res => {
            assert.equal(res.status,200);
            // console.log(res.data);
            done();
        }).catch(err => {
            done(err);
        });
    });


    // SENSOR DATA TESTS

    // get sensor data
    it('Should Get Sensor Data', function (done) {
        axios({
            method: 'get',
            url: 'http://localhost/iot',
            data: {
                'headers': {
                    'Accept': '*/*',
                    'Connection': 'keep-alive',
                    'Fiware-Service': 'sensor',
                    'Fiware-ServicePath': '/',
                },
                'entityId': 'ambiente:001',
                'entityType': 'Ambiente',
            },
        }).then(res => {
            assert.equal(res.status,201);
            // console.log(res.data);
            done();
        }).catch(err => {
            done(err);
        });
    });

    // send sensor data
    it('Should Send Sensor Data', function (done) {
        axios({
            method: 'post',
            url: 'http://localhost/iot',
            data: {
                'device_id': 'ambiente-sensor:001',
                'temperature': '23.0',
                'humidity': '24.0',
                'acidity': '7.0',
                'headers': { 
                    'Fiware-Service': 'sensor', 
                    'Fiware-ServicePath': '/',
                    'X-Auth-Token': 'asd12345',
                    'Content-Type': 'application/json'
                }
            }
        }).then(res => {
            assert.equal(res.status,201);
            // console.log(res.data);
            done();
        }).catch(err => {
            done(err);
        });
    });

});