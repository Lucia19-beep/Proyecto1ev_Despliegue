import express from "express";
import mongoose from "mongoose";

import Recinto from "../models/recinto.js";
/*mongoose.connect('mongodb://127.0.0.1:27017/recintos');
let app = express();
app.use(express.json());*/

const router = express.Router();
//const Recinto = require (__dirname + "/models/recinto");

router.get('/', (req, res) => {
    Recinto.find().then(resultado => {
        if(resultado)
            res.status(200)
                .send( {ok: true, 
                        resultado: resultado});
        else
            res.status(500)
                .send( {ok: false, 
                        error: "No se han encontrado recintos"});
    }).catch (error => {
        res.status(500)
           .send( {ok: false, 
                   error: "No se han encontrado recintos"});
    });
});
router.get('/:id', (req, res) => {
   Recinto.findById(req.params.id).then(resultado => {
        if(resultado)
            res.status(200)
               .send({ok: true, 
                      resultado: resultado});
        else
            res.status(404)
               .send({ok: false, 
                      error: `Recinto ${req.params.id} no encontrado`});
    }).catch (error => {
        res.status(404)
           .send({ok: false, 
                  error: `Recinto ${req.params.id} no encontrado`});
    }); 
});
router.get('/localidad/:nombre', (req, res) => {
    Recinto.find({localidad: req.params.nombre})
        .then(resultado => {
            if(resultado && resultado.length > 0)
                res.status(200)
                    .send({ok: true,
                           resultado: resultado
                    });
            else
                res.status(404)
                    .send({ok: false,
                           error: "No se han encontrado recintos de la localidad indicada"
                    });
        }).catch(error => {
            res.status(404)
                .send({ok: false,
                       error: "No se han encontrado recintos de la localidad indicada"
                });
        });
});

router.post('/', (req, res) => {
    let nuevoRecinto = new Recinto({
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        localidad: req.body.localidad,
        aforoMaximo: req.body.aforoMaximo,
    });

    nuevoRecinto.save().then(resultado => {
        res.status(201)
           .send({ok: true, resultado: resultado});
    }).catch(error => {
        res.status(500)
           .send({ok: false, 
                  error: "Error añadiendo recinto"});
    });
});

router.delete('/:id', (req, res) => {
    Recinto.findByIdAndDelete(req.params.id)
    .then(resultado => {
        if(resultado)
            res.status(200)
                .send({ok: true, 
                       resultado: resultado});
        else
            res.status(404)
                .send({ok: false, 
                       error:`Error eliminando recinto ${req.params.id}`});
    }).catch(error => {
        res.status(404)
           .send({ok: false, 
                  error:`Error eliminando recinto ${req.params.id}`});
    });
});
export default router;
//app.listen(8080);