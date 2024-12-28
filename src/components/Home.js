import { useAuth } from "../context/AuthContext"

export default function Home() {
    const { user } = useAuth() 
    return (
        <div className="flex flex-col items-center  min-h-screen bg-gray-100 p-6">
  <h2 className="text-3xl font-bold mb-4">Home</h2>
  
  { !user ? (
    <p className="text-red-600 text-lg">Welcome Guest</p>
  ) : (
    <p className="text-green-600 text-lg">Welcome {user.username}</p>
  )}

 

  
</div>

    )
}