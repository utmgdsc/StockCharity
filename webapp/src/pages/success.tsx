// pages/success.tsx
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useCookies } from 'react-cookie';

interface JwtPayload {
  user_id: number;
}

// /success?session_id=
const SuccessPage: FC = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [cookies] = useCookies(['token']);

  useEffect(() => {
    async function sendEmail() {
      if (!cookies.token) return;

      try {
        // decoding the JWT and extract the user id
        const decoded = jwtDecode<JwtPayload>(cookies.token);
        const userId = decoded.user_id;

        const config = {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        };

        // request the account info from /account/<userId> endpoint
        const accountResponse = await axios.get(`http://localhost:8000/account/${userId}/`, config);
        const { email } = accountResponse.data;

        // why does the api endpoint also require charity name?
        const charity = "Lorem Ipsum";

        // making request to backend
        await axios.post('http://localhost:8000/api/send-payment-recieved-email', { receiver: email, charity });
      } catch (error) {
        console.error("Error sending payment received email:", error);
        // TODO: Still need to add the donation record to the DB somehow
      }
    }
    sendEmail();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Donation!</h1>
      <p className="text-lg mb-6">Your donation was processed successfully.</p>
      {session_id && (
        <div className="bg-white shadow p-4 rounded border border-gray-200">
          <p className="font-semibold mb-1">Checkout Session ID:</p>
          <p className="text-sm break-words">{session_id}</p>
        </div>
      )}
      <button
        onClick={() => router.push('/')}
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Return Home
      </button>
    </div>
  );
};

export default SuccessPage;