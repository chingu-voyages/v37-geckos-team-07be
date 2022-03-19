const { Schema, model } = require('mongoose');

// TODO: Please edit the user model to whatever makes sense for our project
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = User;
