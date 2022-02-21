import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import StripeCheckout from "react-stripe-checkout";

function App() {
	const [product, setProduct] = useState({
		name: "Phone",
		price: 10,
		productBy: "Apple",
	});
	const makePayment = (token) => {
		const body = {
			token,
			product,
		};
		const headers = {
			"Content-Type": "application/json",
		};
		return fetch(`http://localhost:8282/payment`, {
			method: "POST",
			headers,
			body: JSON.stringify(body),
		})
			.then((response) => {
				console.log("Response ", response);
				const { status } = response;
				console.log("Status ", status);
			})
			.catch((error) => console.log(error));
	};
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="#"
					target="_blank"
					rel="noopener noreferrer"
				></a>
				<StripeCheckout
					stripeKey={process.env.REACT_APP_KEY}
					token={makePayment}
					name="Buy Phone"
					amount={product.price * 100}
				>
					<button className="btn-large blue">
						Buy phone in $ {product.price}
					</button>
				</StripeCheckout>
			</header>
		</div>
	);
}

export default App;
