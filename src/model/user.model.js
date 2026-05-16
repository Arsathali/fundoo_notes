import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

        name : {
            type : String,
            required : true
        },

        email : {
            type : String,
            required : true,
            unique : true
        },

        provider : {
            type : String,
            enum : ["local","google"],
            default : "local"
        },
        
        password: {
            type: String,
            required: function() {
                return this.provider === "local";
            }
        }
    }, {timestamps: true} );
    

const User = mongoose.model("Users",userSchema);

export default User;