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
                "id": "urn:ngsi-ld:Device:919",
                "type": "MyNewType",
                "description": {
                    "value": "My entity description",
                    "type": "Text",
                },
                "temperature": {
                    "type": "float",
                    "value": "99.0"
                },
                "humidity": {
                    "type": "float",
                    "value": "99.0"
                },
                "acidity": {
                    "type": "float",
                    "value": "99.0"
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

    // get iot info
    it('Should Get Iot Info', function (done) {
        axios({
            method: 'get',
            url: 'http://localhost/iot',
        }).then(res => {
            assert.equal(res.status,201);
            // console.log(res.data);
            done();
        }).catch(err => {
            done(err);
        });
    });

    // get iot services
    it('Should Get Iot Services', function (done) {
        axios({
            method: 'get',
            url: 'http://localhost/iot/services',
        }).then(res => {
            assert.equal(res.status,200);
            // console.log(res.data);
            done();
        }).catch(err => {
            done(err);
        });
    });

    
    
});
