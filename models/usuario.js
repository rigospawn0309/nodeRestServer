const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique:true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

  });
// esta función permite filtrar el modelo usuario, quitar de poder devolverlo entero y se guarda el modelo entero en DB
UsuarioSchema.methods.toJSON = function() {
    const {__v, password,_id, ...user} = this.toObject();
    user.uid = _id;
    return user //filtrado
}



module.exports = model('Usuario', UsuarioSchema);