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

app.listen(5555);

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