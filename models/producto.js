const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    brand: {
        type: String,
        required: [true, 'la Marca es obligatoria'],
    },
    model: {
        type: String,
        required: [true, 'El Modelo es obligatorio'],
    },
    operator: {
        type: String,
        required: [true, 'El operador es obligatorio'],
        default: 'SIN_OPERADOR'
    },
    condition:{
        type: String,
        required: [true, 'Estado del producto obligatorio'],
        default: 'USADO',
        enum: {
            values: ['NUEVO','USADO','NO_FUNCIONA'],
            message: '{VALUE} no es valido'
          }
    },
    status: {
        type: Boolean,
        default: true,
        required: [true, 'El estado es obligatorio']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario propietorio es obligatorio']
    },
    price: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'la categoria propietorio es obligatorio']
    },
    description: {
        type: String
    },
    descriptionHTML: {
        type: String
    },
    available: {
        type: Boolean,
        default: true 
    },

  });

  // esta función permite filtrar el modelo producto, quitar de poder devolverlo entero o parcial pero se guarda el modelo entero en DB
  ProductoSchema.methods.toJSON = function() {
    const {__v, status, ...producto} = this.toObject(); //pongo lo que no quiero mostrar y todo lo demás que si en producto
    return producto //filtrada
}


  module.exports = model('Producto', ProductoSchema);
