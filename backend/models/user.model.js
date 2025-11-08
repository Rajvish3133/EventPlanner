const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    Phonenumber: {
      type: Number,
      maxlength: 10,
      required: true,
    },

    role: {
      type: String,
      enum: ["Client", "Admin"],
      default: "Client",
    },


    rsvps: [
      {
        eventId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event", // reference to Event model
          required: true,
        },
        status: {
          type: String,
          enum: ["Going", "Maybe", "Decline"],
          default: "Maybe",
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);
userSchema.pre ('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.generateToken = function () {
    const token = jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
    return token;
}

module.exports=mongoose.model("User", userSchema);
