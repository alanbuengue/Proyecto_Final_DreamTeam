const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));


const { User, Plot, Crop, Ambient, Irrigation, Comment, Sensor } = require("./src/db/models");



// accept json in post request
app.use(express.json());

//fetch test
const fetch = require('node-fetch');

app.get('/hello', function (req, res) {
    return res.json("Hello World");
});

app.get('/', function (req, res) {
    return res.json("Holis");
});
// Fiware Routes

// Orion - Get Version
const fiwareRouter = require("./src/routes/fiwareRoutes");
app.get('/orion', fiwareRouter);
app.get('/orion/entities', fiwareRouter);
app.post('/orion/entities', fiwareRouter);
app.delete('/orion/entities', fiwareRouter);


// IOT get / post info to device
app.get('/iot', fiwareRouter);
app.post('/iot', fiwareRouter);
app.get('/iot/services',fiwareRouter);

// create a IoT service
app.post('/iot/services',fiwareRouter);




//get city information
app.get('/weather/:city', async function (req, res) {

    try {

        let city = req.params.city;

        const promise1 = new Promise((resolve, reject) => {
            resolve(getCity(city).then(data => { //A PARTIR DEL .THEN ES PARA TRAER LA INFO DEL CLIMA. SIN ESO TRAE LA INFO DE LA CIUDAD
                return getWeather(data.Key); //LE PASO LA KEY DE LA CIUDAD PARA TRAER EL CLIMA
            }));
        });

        promise1.then((value) => {
            //console.log(value);
            res.status(201).json(value)

        });

    } catch (err) {
        res.status(500).json("Error")
    }
})

const key = "XqTo6NpoDJ97BTGhKfFc5FeAwJcZ82sa";

const getCity = async (city) => {

    const base = "http://dataservice.accuweather.com/locations/v1/cities/search";
    const query = `?apikey=${key}&q=${city}`;

    const response = await fetch(base + query);
    const data = await response.json();

    return data[0];
};

/*
getCity("manchester")
    .then(data=> console.log(data))
    .catch(err => console.log(err));

    */


//get weather information

const getWeather = async (id) => {

    const base = "http://dataservice.accuweather.com/currentconditions/v1/";
    const query = `${id}?apikey=${key}`

    const response = await fetch(base + query);
    const data = await response.json();

    return data[0];

}

//********************************************************************** */
//ABM USERS

app.post('/user', async function (req, res) {

    const { name, email, password } = req.body;
    console.log(req.body);

    try {

        if (name == "" || email == "" || password == "") {
            res.status(401).json('Los valores no pueden ser nulos');
        } else {

            //Busco que no exista ya el email
            let auxUser = await User.findOne({
                where: { email: email }
            })
            console.log(auxUser)

            if (auxUser == null) {

                await User.create({
                    name: name,
                    email: email,
                    password: password,
                    isAdmin: false,
                    idPlot: 0
                })
                res.status(201).json('Usuario creado!');
            } else {
                res.status(401).json('Ya existe ese email');
            }
        }
    } catch (err) {
        res.status(500).json('Fallo la creacion del usuario.');
    }
})

app.put('/user', async function (req, res) {

    const { email, idPlot } = req.body;

    try {
        let auxUser = await User.findOne({
            where: { email: email }
        })
        if (auxUser != null) {
            auxUser.idPlot = idPlot;
            await auxUser.save();
            res.status(201).json('El usuario ' + email + " asigno la parcela: " + idPlot);
        } else {
            res.status(401).json('El email no existe');
        }
    } catch (err) {
        res.status(500).json('No se pudo realizar la operacion');
    }
})

//********************************************************************** */
//ABM PLOT


app.post('/plot', async function (req, res) {

    const { description, idCrop, idAmbient, idSensor } = req.body;
    console.log(req.body);

    try {

        if (description == "" || idCrop == "" || idAmbient == "" || idSensor == "") {
            res.status(401).json('Los valores no pueden ser nulos');
        } else {

            await Plot.create({
                description: description,
                idCrop: idCrop,
                idAmbient: idAmbient,
                idSensor: idSensor,
            })
            res.status(201).json('Parcela creado!');
        }
    } catch (err) {
        res.status(500).json('Fallo la creacion de la parcela.');
    }
})

app.put('/plot/:id', async function (req, res) {

    const { description, idCrop, idAmbient, idSensor } = req.body;
    let id = req.params.id;

    try {
        let auxPlot = await Plot.findOne({
            where: { id: id }
        })
        if (auxPlot != null) {

            if (description != "") {
                auxPlot.description = description;
            }

            if (idCrop != "") {
                auxPlot.idCrop = idCrop;
            }

            if (idAmbient != "") {
                auxPlot.idAmbient = idAmbient;
            }

            if (idSensor != "") {
                auxPlot.idSensor = idSensor;
            }

            await auxPlot.save();
            res.status(201).json('Se registró los cambios de la parcela: ' + id);

        } else {
            res.status(401).json('La parcela ' + id + " no existe.");
        }
    } catch (err) {
        res.status(500).json('No se pudo realizar la operacion');
    }
})

//********************************************************************** */
//ABM USERS

app.post('/crop', async function (req, res) {

    const { cropType, minus_temp, minus_ph, max_humidity } = req.body;

    try {

        if (cropType == "" || minus_temp == "" || minus_ph == "" || max_humidity == "") {
            res.status(401).json('Los valores no pueden ser nulos');
        } else {


            //REVISAR ROMPE ACÁ, TRAE ID CROP DE LA NADA
            //Busco que no exista ya el cultivo
            let auxCrop = await Crop.findOne({
                where: { cropType: cropType }
            })
            

            if (auxCrop == null) {

                await Crop.create({
                    cropType: cropType,
                    minus_temp: minus_temp,
                    minus_ph: minus_ph,
                    max_humidity: max_humidity,
                })
                res.status(201).json('Cultivo creado!');
               } else {
                res.status(401).json('Ya existe el cultivo');
            }
        }
    } catch (err) {
        res.status(500).json('Fallo la creacion del cultivo.');
    }
})


app.put('/crop/:tipo', async function (req, res) {

    const { cropType, minus_temp, minus_ph, max_humidity } = req.body;
    let tipo = req.params.tipo;

    try {
        let auxCrop = await Crop.findOne({
            where: { cropType: tipo }
        })
        if (auxCrop != null) {

            if (cropType != "") {
                auxCrop.cropType = cropType;
            }

            if (minus_temp != "") {
                auxCrop.minus_temp = minus_temp;
            }

            if (minus_ph != "") {
                auxCrop.minus_ph = minus_ph;
            }

            if (max_humidity != "") {
                auxCrop.max_humidity = max_humidity;
            }

            await auxCrop.save();
            res.status(201).json('Se registró los cambios del cultivo: ' + cropType);

        } else {
            res.status(401).json('El cultio ' + tipo + " no existe.");
        }
    } catch (err) {
        res.status(500).json('No se pudo realizar la operacion');
    }
})


//********************************************************************** */
//ABM IRRIGATION


app.post('/irrigation', async function (req, res) {

    const { waterUsed, idPlot } = req.body;
    console.log(req.body);

    try {

        if (waterUsed == "" || idPlot == "" ) {
            res.status(401).json('Los valores no pueden ser nulos');
        } else {

            await Irrigation.create({
                waterUsed: waterUsed,
                idPlot: idPlot,
            })
            res.status(201).json('Riego creado!');
        }
    } catch (err) {
        res.status(500).json('Fallo la creacion del riego.');
    }
})

app.put('/Irrigation/:id', async function (req, res) {

    const { waterUsed, idPlot } = req.body;
    let id = req.params.id;

    try {
        let auxIrri = await Plot.findOne({
            where: { id: id }
        })
        if (auxIrri != null) {

            if (waterUsed != "") {
                auxIrri.waterUsed = waterUsed;
            }

            if (idPlot != "") {
                auxIrri.idPlot = idPlot;
            }

            await auxIrri.save();
            res.status(201).json('Se registró los cambios del riego ' + id);

        } else {
            res.status(401).json('El riego con Id ' + id + " no existe.");
        }
    } catch (err) {
        res.status(500).json('No se pudo realizar la operacion');
    }
})


//********************************************************************** */
//ABM COMMENT


app.post('/comment', async function (req, res) {

    const { idIrrigation, text } = req.body;

    try {

        if (idIrrigation == "" || text == "" ) {
            res.status(401).json('Los valores no pueden ser nulos');
        } else {

            await Comment.create({
                idIrrigation: idIrrigation,
                text: text,
            })
            res.status(201).json('Comentario creado!');
        }
    } catch (err) {
        res.status(500).json('Fallo la creacion del comentario.');
    }
})

app.put('/comment/:id', async function (req, res) {

    const { idIrrigation, text } = req.body;
    let id = req.params.id;

    try {
        let auxComment = await Comment.findOne({
            where: { id: id }
        })
        if (auxComment != null) {

            if (idIrrigation != "") {
                auxComment.idIrrigation = idIrrigation;
            }

            if (text != "") {
                auxComment.text = text;
            }

            await auxComment.save();
            res.status(201).json('Se registró los cambios del comentario ' + id);

        } else {
            res.status(401).json('El comentario con Id ' + id + " no existe.");
        }
    } catch (err) {
        res.status(500).json('No se pudo realizar la operacion');
    }
})


//********************************************************************** */
//ABM sensor


app.post('/sensor', async function (req, res) {

    const {description, fiware_update_url, ph_measured, ac_measured,
        hu_measured, fiware_id  } = req.body;


    try {

        if (description == "" || fiware_update_url == "" || ph_measured == "" 
            || ac_measured == "" || hu_measured == "" || fiware_id == "" ) {

            res.status(401).json('Los valores no pueden ser nulos');
        } else {

            await Sensor.create({
                status: false,
                description: description,
                fiware_update_url: fiware_update_url,
                ph_measured: ph_measured,
                ac_measured: ac_measured,
                hu_measured: hu_measured,
                fiware_id: fiware_id
            })
            res.status(201).json('Sensor creado!');
        }
    } catch (err) {
        res.status(500).json('Fallo la creacion del sensor.');
    }
})

app.put('/sensor/:id', async function (req, res) {

    const {status, description, fiware_update_url, ph_measured, ac_measured,
        hu_measured, fiware_id  } = req.body;
    let id = req.params.id;

    try {
        let auxSensor = await Sensor.findOne({
            where: { id: id }
        })
        if (auxSensor != null) {

            if (status != "") {
                auxSensor.status = status;
            }

            if (description != "") {
                auxSensor.description = description;
            }
            if (fiware_update_url != "") {
                auxSensor.fiware_update_url = fiware_update_url;
            }

            if (ph_measured != "") {
                auxSensor.ph_measured = ph_measured;
            }
            if (ac_measured != "") {
                auxSensor.ac_measured = ac_measured;
            }

            if (hu_measured != "") {
                auxSensor.hu_measured = hu_measured;
            }
            if (fiware_id != "") {
                auxSensor.fiware_id = fiware_id;
            }

            await auxSensor.save();
            res.status(201).json('Se registró los cambios del sensor ' + id);

        } else {
            res.status(401).json('El sensor con Id ' + id + " no existe.");
        }
    } catch (err) {
        res.status(500).json('No se pudo realizar la operacion');
    }
})


//********************************************************************** */
//ABM AMBIENT


app.post('/ambient', async function (req, res) {

    const { temp, land_humidity, land_ph, latitude, longitude } = req.body;

    try {

        if (temp == "" || land_humidity == "" || land_ph == "" || latitude == ""
        || longitude == "") {
            res.status(401).json('Los valores no pueden ser nulos');
        } else {

            await Ambient.create({
                temp: temp,
                land_humidity: land_humidity,
                land_ph: land_ph,
                latitude: latitude,
                longitude: longitude
            })
            res.status(201).json('Ambiente creado!');
        }
    } catch (err) {
        res.status(500).json('Fallo la creacion del ambiente.');
    }
})

app.put('/ambient/:id', async function (req, res) {

    const { temp, land_humidity, land_ph, latitude, longitude } = req.body;
    let id = req.params.id;

    try {
        let auxAmbient = await Ambient.findOne({
            where: { id: id }
        })
        if (auxAmbient != null) {

            if (temp != "") {
                auxAmbient.temp = temp;
            }

            if (land_humidity != "") {
                auxAmbient.land_humidity = land_humidity;
            }
            if (land_ph != "") {
                auxAmbient.land_ph = land_ph;
            }

            if (latitude != "") {
                auxAmbient.latitude = latitude;
            }
            if (longitude != "") {
                auxAmbient.longitude = longitude;
            }

            await auxAmbient.save();
            res.status(201).json('Se registró los cambios del ambiente ' + id);

        } else {
            res.status(401).json('El ambiente con Id ' + id + " no existe.");
        }
    } catch (err) {
        res.status(500).json('No se pudo realizar la operacion');
    }
})

app.get('/irrigations/:idPlot', async function (req, res) {
    try {

        let plotId = req.params.idPlot;
        let irrigations;
        if (plotId == null || plotId == undefined || plotId == '') {
            return res.Status(400).json("Invalid IdPlot")
        }
        let myPlot = await Plot.findOne({
            where : {id : plotId}
        })
        if(myPlot != null ){
             irrigations = await myPlot.getIrrigations();
        }

        irrigations = await Plot.find({
            where : {idPlot : plotId}
        })

        if(irrigations != null){
            return res.status(201).json(irrigations);
        }
        if(irrigations = null){
            return res.status(201).json("No irrigations found for the Plot Id")
        }
    } catch (err) {
        res.status(500).json("Error")
    }
});


app.listen(80);