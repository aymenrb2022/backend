
const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var enqSchema = new mongoose.Schema ({

    nom:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    comment:{
        type:String,
        required:true, 
    },
    status :{
        type:String,
        default:'Communiqué',
        enum:['Communiqué','Contacté','En cours'],
    }
   
});




//Export the model
module.exports = mongoose.model('Contact', enqSchema);
