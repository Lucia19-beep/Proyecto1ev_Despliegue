import mongoose from "mongoose";


let entradaSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        minlength: 3
    },
    precio: {
        type: Number,
        required: true,
        minlength: 0,
    },
    disponibles: {
        type: Number,
        required: true,
        minlength: 0,
    }
});

let eventoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required:true,
        minlength: 5

    },
    fecha: {
        type: Date,
        required:true,
    },
    recinto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recintos',
        required: true
    },
    entradas: [entradaSchema]

});
let Evento = mongoose.model('eventos', eventoSchema);
let Entrada = mongoose.model('entradas', entradaSchema);

export default Evento;