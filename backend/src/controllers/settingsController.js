import Settings from "../models/settingsModel.js";

// @desc    Save payment settings
// @route   POST /api/settings/payment
// @access  Private/Admin
const savePaymentSettings = async (req, res) => {
  try {
    const { paymentMethods, paymentGateway, shipping } = req.body;

    // Find existing settings or create new
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    // Update payment methods
    if (paymentMethods) {
      settings.paymentMethods = {
        creditCard: paymentMethods.pmCreditCard || false,
        paypal: paymentMethods.pmPayPal || false,
        googlePay: paymentMethods.pmGooglePay || false,
        applePay: paymentMethods.pmApplePay || false,
        cod: paymentMethods.pmCOD || false,
      };
    }

    // Update payment gateway
    if (paymentGateway) {
      settings.paymentGateway = {
        provider: paymentGateway.gatewayProvider || "Stripe",
        apiKey: paymentGateway.gatewayAPIKey || "",
      };
    }

    // Update shipping
    if (shipping) {
      settings.shipping = {
        flatRate: parseFloat(shipping.shippingFlatRate) || 8.00,
        freeThreshold: parseFloat(shipping.shippingFreeThreshold) || 100.00,
      };
    }

    await settings.save();

    res.status(200).json({
      message: "Payment settings saved successfully",
      settings,
    });
  } catch (error) {
    console.error("Error saving payment settings:", error);
    res.status(500).json({
      message: "Failed to save payment settings",
      error: error.message,
    });
  }
};

export { savePaymentSettings };
