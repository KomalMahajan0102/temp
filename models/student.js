const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const studentSchema = new Schema({
   
    email: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    classroomCode: {
        type: String,
        enum : ['1cs1','1it1','1entc1','1enc1','1ce1','1ee1','1me1','1aiml1','1aids1'],
        required: true
    },
    
    

});

studentSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("Student", studentSchema);
