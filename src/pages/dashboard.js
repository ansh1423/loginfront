import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../context/Authcontext"; 
// import ThankYou from "../components/ThankYou";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/"); // Redirect to the homepage if not authenticated
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-2xl font-bold text-gray-800">Welcome to the Dashboard</h2>
      <ThankYou />
    </div>
  );
}
