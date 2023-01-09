const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const calculateOrderAmount = async (items) => {
    const amount = items.reduce((prevValue, currentValue) => {
      return prevValue + (currentValue.product.discountPrice * currentValue.count)
    },0)
    return amount * 100;
  };

const paymentIntentHandler = async (req, res) => {
    const items = req.body.items
    const amount = await calculateOrderAmount(items)
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'INR',
            automatic_payment_methods: { enabled: true },
        })
        
        return res.status(200).send({
            clientSecret: paymentIntent.client_secret,
            amount
          });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ 'message': `${error}` })
    }
}

module.exports= { paymentIntentHandler }


