import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const Logar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, senha: senha }),
    });

    const data = await res.json();
    console.log(data)
    if(data.res){
      navigate("/Aerocode");
    }else{
      document.getElementById("erro")!.innerHTML = `Senha ou usuario incorreto`
    }

    
  };
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={Logar}>

            <div className="mb-4">
              <Label
                htmlFor="username"
                className="block mb-2 text-sm font-bold text-gray-700"
              >
                Username
              </Label>
              <Input
                type="text"
                id="username"
                className="w-64 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <Label
                htmlFor="password"
                className="block mb-2 text-sm font-bold text-gray-700"
              >
                Password
              </Label>
              <Input
                type="password"
                id="password"
                className="w-64 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <Button
              type="submit"

            >
              Log In
            </Button>
          </form>
          <p><small>Click no botao para logar </small></p>
          <p><small id="erro"></small></p>
        </div>
      </div>
    </>
  );
}
