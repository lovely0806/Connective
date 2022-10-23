import React from 'react';
import axios from 'axios';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import CheckoutForm from '../../../components/checkoutform/index';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51LtYQ9BVuE7MeVAFs01fSH87XUvxogXFb96j59PUdsofGCwwfIiUu5mEzspPcLc0bzqgXramq2ywesmEWLq03oQN00RYxeQSaK');

export const Checkout = ({ client_secret }) => {
  const options = {
    clientSecret: client_secret,
    appearance: {/*...*/},
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

export const getServerSideProps = async (context) => {
  const { id } = context.params;
  const clientData = await axios.get(`/api/verify-client/${id}`);
  return {
    props: {
      client_secret: clientData.data.client_secret
    }
  }
}

