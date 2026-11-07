import express from "express";
import mongoose from "mongoose";
import Evento from "../models/evento.js";
/*mongoose.connect('mongodb://127.0.0.1:27017/eventos');
let app = express();
app.use(express.json());*/

const router = express.Router();

//const Evento = require (__dirname + "/models/evento");

router.get('/', (req, res) => {
    Evento.find().populate('recinto').then(resultado => {
        if(resultado)
            res.status(200)
                .send( {ok: true, 
                        resultado: resultado});
        else
            res.status(500)
                .send( {ok: false, 
                        error: "No se han encontrado eventos"});

    }).catch (error => {
        res.status(500)
           .send( {ok: false, 
                   error: "No se han encontrado eventos"});
    });
});
router.get('/:id', (req, res) => {
   Evento.findById(req.params.id).populate('recinto').then(resultado => {
        if(resultado)
            res.status(200)
               .send({ok: true, 
                      resultado: resultado});
        else
            res.status(404)
               .send({ok: false, 
                      error: `Evento ${req.params.id} no encontrado`});
    }).catch (error => {
        res.status(404)
           .send({ok: false, 
                  error: `Evento ${req.params.id} no encontrado`});
    }); 
});
router.get('/localidad/:nombre', (req, res) => {
    const fechaAhora=new Date();
    Evento.find({fecha: {$gte: fechaAhora}})
        .populate({
            path: 'recinto',
            match: {localidad: req.params.nombre}
        })
        .then(eventos => {
            const resultado=eventos.filter(e => e.recinto!==null)
            if(resultado && resultado.length > 0)
                res.status(200)
                    .send({ok: true,
                           resultado: resultado
                    });
            else
                res.status(404)
                    .send({ok: false,
                           error: "No se han encontrado eventos"
                    });
        }).catch(error => {
            res.status(404)
                .send({ok: false,
                       error: "No se han encontrado eventos"
                });
        });
});

router.post('/', (req, res) => {
    let nuevoEvento = new Evento({
        nombre: req.body.nombre,
        fecha: req.body.fecha,
        recinto: req.body.recinto,
        entradas: req.body.entradas,
    });

    nuevoEvento.save().then(resultado => {
        res.status(201)
           .send({ok: true, resultado: resultado});
    }).catch(error => {
        res.status(500)
           .send({ok: false, 
                  error: "Error añadiendo evento"});
    });
});

router.put('/:id', (req, res) => {
    Evento.findByIdAndUpdate(req.params.id, {
        $set: {
            nombre: req.body.nombre,
            fecha: req.body.fecha,
            recinto: req.body.recinto,
            entradas: req.body.entradas
        }
    }, {returnDocument: 'after'}).then(resultado => {
        if(resultado)
            res.status(200)
                .send({ok: true, 
                       resultado: resultado});
        else
            res.status(404)
                .send({ok: false, 
                       error:`Error actualizando evento ${req.params.id}`});
    }).catch(error => {
        res.status(404)
           .send({ok: false, 
                  error:`Error actualizando evento ${req.params.id}`});
    });
});

router.delete('/:id', (req, res) => {
    Evento.findByIdAndDelete(req.params.id)
        .then(resultado => {
            if(resultado)
                res.status(200)
                    .send({ok: true, 
                           resultado: resultado});
            else
                res.status(404)
                    .send({ok: false, 
                           error:`Error eliminando evento ${req.params.id}`});
        }).catch(error => {
            res.status(404)
            .send({ok: false, 
                   error:`Error eliminando evento ${req.params.id}`});
        });
});

router.get('/entradas/:idEvento/:tipoEntrada', (req, res) => {
    Evento.findById(req.params.idEvento)
        .then(evento => {
            if (!evento) {
                return res.status(404).send({
                    ok: false,
                    error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
                });
            }
            const entrada = evento.entradas.find(
                e => e.tipo.toLowerCase() === req.params.tipoEntrada.toLowerCase()
            );

            if (entrada) {
                res.status(200).send({
                    ok: true,
                    resultado: {
                        precio: entrada.precio,
                        disponibles: entrada.disponibles
                    }
                });
            } else {
                res.status(404).send({
                    ok: false,
                    error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
                });
            }
        }).catch(error => {
            res.status(404)
                .send({ok: false,
                       error: `Error obteniendo datos de entrada para evento ${req.params.idEvento}`
                });
        });
});

router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', (req, res) => {
    const cantidadRestar= parseInt(req.params.cantidad);

    Evento.findById(req.params.idEvento)
        .then(evento => {
            if(!evento){
                return res.status(404)
                    .send({ok: true, 
                           error: `Error actualizando entradas del evento ${req.params.idEvento}`});
            }    
            const entrada= evento.entradas.find(e => e.tipo === req.params.tipoEntrada);
            if(entrada && entrada.disponibles >= cantidadRestar){
                entrada.disponibles -= cantidadRestar;

                return evento.save().then(resultado => {
                    res.status(200).send({
                        ok: true,
                        resultado: resultado
                    });
                });
            }else{
                res.status(404)
                    .send({ok: false, 
                           error:`Error actualizando entradas del evento ${req.params.idEvento}`});
            }
        }).catch(error => {
            res.status(404)
            .send({ok: false, 
                    error:`Error actualizando entradas del evento ${req.params.idEvento}`});
        });
});
export default router;
//app.listen(8080);