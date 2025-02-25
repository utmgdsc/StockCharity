// pages/success.tsx
import { useRouter } from 'next/router';
import { FC } from 'react';

const SuccessPage: FC = () => {
  const router = useRouter();
  const { session_id } = router.query;

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
        onClick={() => router.push('/home')}
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Return Home
      </button>
    </div>
  );
};

export default SuccessPage;