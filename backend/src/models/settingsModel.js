import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  paymentMethods: {
    creditCard: { type: Boolean, default: true },
    paypal: { type: Boolean, default: true },
    googlePay: { type: Boolean, default: false },
    applePay: { type: Boolean, default: false },
    cod: { type: Boolean, default: true },
  },
  paymentGateway: {
    provider: { type: String, default: "Stripe" },
    apiKey: { type: String, default: "" },
  },
  shipping: {
    flatRate: { type: Number, default: 8.00 },
    freeThreshold: { type: Number, default: 100.00 },
  },
}, {
  timestamps: true,
});

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
