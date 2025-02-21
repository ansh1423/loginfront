import { useRouter } from "next/router";

export default function ThankYouPage() {
  const router = useRouter(); // Navigation for Pages Router

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600">Thank You!</h1>
      <p className="text-lg text-gray-700 mt-2">We appreciate your visit. Have a great day!</p>
      
      {/* Button to navigate back to home */}
      <button
        onClick={() => router.push("/")}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-700 transition"
      >
        Go to Home
      </button>
    </div>
  );
}
