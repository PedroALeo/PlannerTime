import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const signupRedirect = () => {
    navigate("/signup");
  };


  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Prepare the data to send
    const credentials = { email, password };

    try {
      // Send a POST request to the login API
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      // Check if the response is successful
      if (!response.ok) {
        console.log("login error");
        throw new Error("Login failed. Please try again.");
      }

      // Parse the response body
      const data = await response.json();

      // Assuming the response contains a token
      const token = data.token;

      // Store the token in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("email", email);
      localStorage.setItem("isLogged", "true");

      navigate("/articles");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="pt-8">
      <form onSubmit={login} className="max-w-sm mx-auto">
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="your@email.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Senha
          </label>
          <input
            type="password"
            id="password"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div className="flex items-start mb-5">
          <div onClick={signupRedirect} className="flex items-center h-5 ">
            <a className="text-blue-700 hover:blue-990 cursor-pointer hover:underline">Cadastre-se</a>
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 cursor-pointer hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
