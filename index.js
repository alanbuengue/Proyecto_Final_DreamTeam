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
const crop = require('./src/db/models/crop');
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

// create a IoT device / sensor
app.post('/iot/devices',fiwareRouter);




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
    const query = `${id}?apikey=${key}&language=${'es-mx'}&details=${'true'}`

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


//Get users


app.get('/users', async function(req,res) {
    try{
        const users = await User.findAll();
        return res.status(201).send(users).json;
    }catch(err){
        res.status(500).send('No se pudo realizar la operacion' + err);
    }
})

app.get('/users/:id', async function(req,res) {
    try{
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        return res.status(201).send(user).json;
    }catch(err){
        res.status(500).send('No se pudo realizar la operacion' + err);
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

                await Crop.create({
                    cropType: cropType,
                    minus_temp: minus_temp,
                    minus_ph: minus_ph,
                    max_humidity: max_humidity,
                })
                res.status(201).json('Cultivo creado!');
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
        console.log(req.params)
        let idPlot = req.params.idPlot;
        let irrigations;
        if (idPlot == null || idPlot == undefined || idPlot == '') {
            return res.Status(400).json("Invalid IdPlot")
        }
        /*let myPlot = await Plot.findOne({
            where : {id : plotId}
        })*/
        /*if(myPlot != null ){
             irrigations = await myPlot.getIrrigations();
        }*/

        irrigations = await Irrigation.findAll({
            where : {idPlot : idPlot}
        })
        console.log(irrigations)
        if(irrigations != null){
            console.log("hhh"+ irrigations)
            return res.status(201).json(irrigations);
        }
        if(irrigations == null){
            return res.status(201).json("No irrigations found for the Plot Id")
        }
    } catch (err) {
        res.status(400).json(err)
    }
})
app.get('/comments/:idIrrigation', async function (req, res) {
    try {
        let idIrrigation = req.params.idIrrigation;
        let comments;
        if(idIrrigation == null || idIrrigation == undefined || idIrrigation == ''){
            return res.status(400).json("Invalid irrigationId")
        }
        comments = await Comment.findAll({
            where : {idIrrigation : idIrrigation}
        })
        if(comments == null){
            return res.status(201).json("No comments found for the Plot Id")
        }
        if(comments != null){
            return res.status(201).json(comments)
        }
    } catch (err) {
        res.status(500).json("Error")
    }
})
app.post('/login', async function (req, res) {

    const { email, password } = req.body;
    console.log(req.body);

    try {
        if (email == "" || password == "") {
            res.status(401).json('Los valores no pueden ser nulos');
        } else {
            let auxUser = await User.findOne({
                where: { email: email , password : password}
            })

            if (auxUser == null) {
                res.status(201).json('Login incorrecto');
            } else {
                res.status(201).json(auxUser);
            }
        }
    } catch (err) {
        res.status(500).json('error 500 en login');
    }
})

///**************************************************** */

//Realizar el endpoint que retorne una parcela y su cultivo
app.get('/plot/:plotId', async function(req,res) {
    try{
        
        const plotId = req.params.plotId;
        
        if(!plotId){
            return res.status(400).json("Invalid plotId")
        }

        //const plotId = req.query.plotId;
        const plot = await Plot.findByPk(plotId);

        const cropId = plot.idCrop;

        let crop = await Crop.findOne({
            where: { id: cropId }
        })

        var data = {
            tipocultivo: crop.cropType,
            tempMinima: crop.minus_temp,
            phMinimo: crop.minus_ph,
            humedadMax: crop.max_humidity,
            desc: plot.description,
            idPlot: plot.id,
            idCrop: crop.id,

        };

        return res.status(201).send(data).json;
    }catch(err){
        res.status(500).send('No se pudo realizar la operacion: ' + err);
    }

})


//WEATHER INFO FOR ANDROID

app.get('/weatherInfo/:city', async function (req, res) {

    try {

        let city = req.params.city;

        const promise1 = new Promise((resolve, reject) => {
            resolve(getCity(city).then(data => { //A PARTIR DEL .THEN ES PARA TRAER LA INFO DEL CLIMA. SIN ESO TRAE LA INFO DE LA CIUDAD
                return getWeather(data.Key); //LE PASO LA KEY DE LA CIUDAD PARA TRAER EL CLIMA
            }));
        });

        promise1.then((value) => {
            console.log(value);

            let rain_desc = value.PrecipitationType;
            
            if(rain_desc == null) {
                rain_desc = "Sin Lluvia"
            }

            let time = value.LocalObservationDateTime.split("T");
            let date = time[0].split("-");
            let timeLong = time[1].split("-");
            let timeShort = timeLong[0]
            
            if(city == "buenosaires") {
                city = "Buenos Aires";
            }

            var result = {
                atmospheric_contition: value.WeatherText,
                humidity: value.RelativeHumidity,
                location: city,
                rain_desc: rain_desc,
                raining: value.HasPrecipitation,
                temperature: value.Temperature.Metric.Value,
                time: timeShort,
            };

            res.status(201).json(result)

        });

    } catch (err) {
        res.status(500).json("Error")
    }
})

//***************************** */
//REGAR O NO REGAR, ESA ES LA CUESTION

app.get('/irrigation', async function (req, res) {
/*
    const promise1 = new Promise((resolve, reject) => {
        resolve(getIotMethod());
    });*/

    const promise1 = new Promise((resolve, reject) => {
        resolve(irrigationAll());
    });

    /*
    promise1.then((value) => {


        const humidity = value.humidity.value
        res.status(201).json(humidity)

    });
    */

    res.status(201).json("true")


})








const irrigationAll = async () => {

    const plots = await Plot.findAll();
    let plotsCity = plots[0].city //Agarro el plot 0 y pregunto por su ciudad

    let crops = [];
    
    for ( const uniqPlot of plots) {
        
        const auxCrop = await Crop.findOne({
            where: { id: uniqPlot.idCrop }
        })

        crops.push(auxCrop);

    }

    
    //Traigo la humedad del clima actual
    const climePromise = new Promise((resolve, reject) => {
            resolve(getCity(plotsCity).then(data => { //A PARTIR DEL .THEN ES PARA TRAER LA INFO DEL CLIMA. SIN ESO TRAE LA INFO DE LA CIUDAD
                return getWeather(data.Key); //LE PASO LA KEY DE LA CIUDAD PARA TRAER EL CLIMA
            }));
        });
        
        

    climePromise.then((value) => {
        let data = {
            humidityClima: value.RelativeHumidity, //No use
            rain_desc: value.HasPrecipitation,
            temperature: value.Temperature.Metric.Value,
        }

        console.log(data) //funciona hasta acá

        sensorPromise = new Promise((resolve, reject) => {
            resolve(getIotMethod());
        })

        sensorPromise.then((value) => {

            return humiditySensor = value.humidity.value
        })
        
        .then ((data2)=> {
            
           // .then ((data2, value) => {
    
                for ( const uniqPlot of plots) {
                    let i = 0;
                    let auxCrop;
                    let encontro = false;
                    while (i < crops.size || !encontro) {
                        if(crops[i].id === uniqPlot.idCrop){
                            auxCrop = crops[i];
                            encontro = true;
                        }
                        i++;
                    }
                  // console.log(crop)
                  // console.log(uniqPlot)
                    
                   //Si hace mas de 6º en el ambiente = True
                    if (auxCrop.minus_temp < data.temperature){
                        
                        //Si no llueve = True
                        if (!data.rain_desc) {
                    
                            //Si la humedad minima de la planta es mayor que la captada = True
                            if (auxCrop.min_humidity > humiditySensor) {

                                //Si llegamos hasta acá hay que regar!!
                                console.log("HAY QUE REGAR " + uniqPlot.id)

                                water = ((auxCrop.max_humidity - humiditySensor) * 100)

                                Irrigation.create({
                                    waterUsed: water,
                                    idPlot: uniqPlot.id,
                                })

                            }

                         }      
                        
                    }

                    console.log("Vuelta del for each")
                }         
            })
        }
      
    )
        
    }




async function getIotMethod() {

    const base = "http://localhost/iot?entityId=ambiente:001&serviceHeader=sensor&servicePathHeader=/";

    const response = await fetch(base);
    const data = await response.json();

    return data;
}


//************************************ */
//COMMENTS IRRIGATION

app.get('/comment/:id', async function (req, res) {

    let id = req.params.id;
    
    if(!id) {
        res.status(401).json('Id incorrecto');
    }

    try {
        let comment = await Comment.findOne({
            where: { id: id }
        })
        if (comment != null) {
            res.status(201).json(comment);
        } else {
            res.status(401).json('El comentario con Id ' + id + " no existe.");
        }
    } catch (err) {
        res.status(500).json('No se pudo realizar la operacion');
    }
});

app.get('/irrigation/:id/comments', async function (req, res) {

    const id = req.params.id;
    
    if(!id) {
        res.status(401).json('El id no puede ser nulo');
    }

    try {
        
        await Irrigation.findOne({
            where: { id: id } 
        }).then(async irrigation => {
            const comments = await Comment.findAll({
                where: { idIrrigation: irrigation.id }
            });
            res.status(201).json(comments);
        });
        
    } catch (err) {
        res.status(500).json('No se pudo realizar la operacion');
    }
});



app.listen(80);