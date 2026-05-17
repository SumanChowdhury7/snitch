import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      amount: {
        type: Number,
        required: true
      },
        currency: {
          type: String,
          enum: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR'],
          default: 'INR',
          required: true
        }
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    images: [
      {
        url: {
          type: String,
          required: true
      },
      alt: {
        type: String,
        required: false
      }
    }
    ]
  },
  {
    timestamps: true
  }
);

const productModel = mongoose.model("product", productSchema);

export default productModel;