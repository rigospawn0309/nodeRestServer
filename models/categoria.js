const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
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
    }
  });

  // esta función permite filtrar el modelo usuario, quitar de poder devolverlo entero y se guarda el modelo entero en DB
CategoriaSchema.methods.toJSON = function() {
    const {__v, status, ...categoria} = this.toObject(); //pongo lo que no quiero mostrar
    return categoria //filtrada
}


  module.exports = model('Categoria', CategoriaSchema);
