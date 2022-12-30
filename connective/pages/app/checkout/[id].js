import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {withIronSession} from "next-iron-session"
import CheckoutForm from '../../../components/checkoutform/index';
import { useRouter } from 'next/router';
import Head from 'next/head'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Checkout = ({ user }) => {
  const [options, setOptions] = useState()
  const router = useRouter()

  const getOptions = async() => {
    const {id} = router.query
    const clientData = await axios.get(`/api/stripe/verify-client/${id}`);
    
    setOptions({
      clientSecret: clientData.data.client_secret,
      appearance: {/*...*/}, // edit the appearance from here
    });
  }

  useEffect(() => {
    getOptions()
  }, [])

  if(options) {
    return (
      <Elements stripe={stripePromise} options={options}>
        <Head>
          <title>Checkout - Conenctive</title>
        </Head>
        <CheckoutForm />
      </Elements>
    );
  } else {
    return (
      <p>Loading...</p>
    )
  }
  
}; 

export const getServerSideProps = withIronSession(
  async ({req, res}) => {
      const user = req.session.get("user")

      if(!user) {
          return {props: {}}
      }

      return {
          props: {user}
      }
  },
  {
      cookieName: "Connective",
      cookieOptions: {
          secure: process.env.NODE_ENV == "production" ? true: false
      },
      password: process.env.APPLICATION_SECRET
  }
)

export default Checkout;

