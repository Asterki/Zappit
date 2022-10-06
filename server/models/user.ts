import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        value: {
            type: String,
            required: true,
            unique: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verifiedAt: {
            type: Date,
            default: null,
        },
    },
    userID: {
        type: String,
        required: true,
        unique: true,
    },

    locale: {
        type: String,
        required: false,
        default: "en",
    },

    tfa: {
        secret: {
            type: String,
            required: false,
            default: "",
        },
        backupCodes: {
            type: Array,
            required: false,
            default: [],
        },
    },
});

User.plugin(passportLocalMongoose);

export default mongoose.model("User", User, "users");
