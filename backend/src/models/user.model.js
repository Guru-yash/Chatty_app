import mongoose from "mongoose";

//schema defined
const userSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            required : true,
            unique : true,
        },
        fullname : {
            type : String,
            required : true,
        },
        password : {
            type : String,
            required : true,
            minLength : 6,
        },
        profilePic : {
             type : String,
             default:"",
        }
    },
    { timestamps: true }
);

//model creation
const User = mongoose.model("User", userSchema);

export default User;