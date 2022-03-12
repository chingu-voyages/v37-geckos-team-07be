const { Schema, model } = require('mongoose');
const ObjectId = Schema.Types.ObjectId;
const Decimal128 = Schema.Types.Decimal128;

// TODO: edit the user model to whatever makes sense for our project
const movementSchema = new Schema(
  {
    userId: { type: ObjectId, required: true },
    amount: { type: Decimal128, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    isIncome: { type: Boolean, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

const Movement = model('Movement', movementSchema);

module.exports = Movement;
