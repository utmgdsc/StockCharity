// pages/success.tsx
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';

interface JwtPayload {
  user_id: number;
}

// /success?session_id=
const SuccessPage: FC = () => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const token = Cookie.get('token');

  // this is to get the query param session_id from the URL
  // why is it so roundabout? because retrieving query params is kinda weird
  // doing const { session_id } = router.query; results in session_id undefined sometimes
  useEffect(() => {
    if (!router.isReady) return;

    const { session_id } = router.query;
    if (typeof session_id === 'string') {
      setSessionId(session_id);
    }
  }, [router.isReady, router.query]); // this seems to set sessionId reliably

  useEffect(() => {
    async function handle_sucess_donation() {
      if (!token || !sessionId) return;

      try {
        // decoding the JWT and extract the user id
        const decoded = jwtDecode<JwtPayload>(token);
        const user_id = decoded.user_id;

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        };

        // request the account info from /account/<userId> endpoint
        const accountResponse = await axios.get(`http://localhost:8000/account/${user_id}/`, config);
        const { email } = await accountResponse.data;
        console.log(email);

        // why does the api endpoint also require charity name?
        const charity = "Lorem Ipsum";

        // making request to backend
        await axios.post('http://localhost:8000/api/send-payment-recieved-email', { receiver: email, charity });

        console.log("Stripe session ID:", sessionId);
        await axios.post('http://localhost:8000/api/success', { session_id: sessionId }, config);
      } catch (error) {
        console.error("Error sending payment received email:", error);
      }
    }
    handle_sucess_donation();
  }, [sessionId, token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Donation!</h1>
      <p className="text-lg mb-6">Your donation was processed successfully.</p>
      {sessionId && (
        <div className="bg-white shadow p-4 rounded border border-gray-200">
          <p className="font-semibold mb-1">Checkout Session ID:</p>
          <p className="text-sm break-words">{sessionId}</p>
        </div>
      )}
      <button
        onClick={() => router.push('/')}
        className="mt-8 bg-sky-900 hover:bg-sky-900 text-white px-4 py-2 rounded"
      >
        Return Home
      </button>
    </div>
  );
};

export default SuccessPage;