const cors = require("cors");
const express = require("express");
const stripe = require("stripe")(
	"sk_test_51KVXcCSGWov14k2CiHRr57tqyzwITrj6UiZz5PoIz6AYZrMcQpwATtXk8nI00JriUl1iAjte28mQnx7hpH6tUP5100MJFxXLrd"
);
const uuid = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send("It works on website");
});

app.post("/payment", (req, res) => {
	const { product, token } = req.body;
	console.log("PRODUCT ", product);
	console.log("Price ", product.price);
	const idempotencyKey = uuid.v4();

	return stripe.customers
		.create({
			email: token.email,
			source: token.id,
		})
		.then((customer) => {
			stripe.charges.create(
				{
					amount: product.price * 100,
					currency: "usd",
					customer: customer.id,
					receipt_email: token.email,
					description: `Purchase of ${product.name}`,
					shipping: {
						name: token.card.name,
						address: {
							country: token.card.address_country,
						},
					},
				},
				{ idempotencyKey }
			);
		})
		.then((result) => res.status(200).json(result))
		.catch((err) => console.log(err));
});

app.listen(8282, () => console.log("Listening on port 8282"));
