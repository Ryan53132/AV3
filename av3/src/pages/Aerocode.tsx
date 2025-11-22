import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react"

type varAero = { id: number, nome: string }
type Aero = { id: number; codigo: string, nome: string, modelo: string, capacidade: number, alcance: number; etapas: Etapa[]; pecas: Peca[]; testes: Teste[] };
type User = { id: number; nome: string; numeroCell: string; endereco: string; username: string; password: string; createdAt: Date; };
type Etapa = { id: number; nome: string; prazo: string; status: string; funcionarios: User[] }
type Peca = { id: number; nome: string; tipo: string; fornecedor: string; status: string }
type Teste = { id: number; nome: string; tipo: string; resultado: string }


function Aerocode() {

  
  const [aeronaves, setAeronaves] = useState<varAero[]>([]);
  const [Users, setUsers] = useState<User[]>([]);
  const [Aeroselected, setAeroselected] = useState<Aero | null>(null);
  const [etapa, setEtapa] = useState<Etapa[]>([]);
  const [pecas, setPeca] = useState<Peca[]>([]);
  const [testes, setTeste] = useState<Teste[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/selectAero")
      .then(res => res.json())
      .then((data: varAero[]) => setAeronaves(data));
    fetch("http://localhost:3000/api/selectUsers")
      .then(res => res.json())
      .then((data: User[]) => setUsers(data));
  }, []);

  function isSelected() {
    if (!Aeroselected) {
      return false
    }
    return true
  }
  async function recarregarDados() {
    if (Aeroselected) {
      let res = await fetch("/api/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Aeroselected.id, tipo: "Aeronave" }),
      });
      const selectedAero = await res.json();
      setAeroselected(selectedAero);
      setEtapa(selectedAero.etapas || []);
      setPeca(selectedAero.pecas || []);
      setTeste(selectedAero.testes || []);
    }
    fetch("http://localhost:3000/api/selectUsers")
      .then(res => res.json())
      .then((data: User[]) => setUsers(data));
  }
  async function selectAero(e: React.FormEvent) {
    e.preventDefault()
    let form = e.target as HTMLFormElement;
    let id = (form.elements.namedItem("Aeroselect") as HTMLSelectElement).value;
    let tipo = "Aeronave"
    let res = await fetch("/api/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: parseInt(id), tipo: tipo }),
    });
    const selectedAero = await res.json();
    setAeroselected(selectedAero);
    setEtapa(selectedAero.etapas || []);
    setPeca(selectedAero.pecas || []);
    setTeste(selectedAero.testes || []);
    console.log(selectedAero.etapas)
  }
  async function CriarAero(e: React.FormEvent) {
    e.preventDefault()
    let form = e.target as HTMLFormElement;
    let tipo = "Aeronave"
    let nome = (form.elements.namedItem("Nome") as HTMLInputElement).value
    let codigo = (form.elements.namedItem("Codigo") as HTMLInputElement).value
    let modelo = (form.elements.namedItem("Modelo") as HTMLSelectElement).value
    let capacidade = (form.elements.namedItem("Capacidade") as HTMLInputElement).value
    let alcance = (form.elements.namedItem("Alcance") as HTMLInputElement).value
    let res = await fetch("/api/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          codigo: codigo,
          nome: nome,
          modelo: modelo,
          capacidade: parseInt(capacidade),
          alcance: parseInt(alcance)
        },
        { tipo: tipo }]),
    })
    console.log("debug: funcionou", res)
    // Recarregar lista de aeronaves
    fetch("http://localhost:3000/api/selectAero")
      .then(res => res.json())
      .then((data: varAero[]) => setAeronaves(data));
  }
  async function CriarTeste(e: React.FormEvent) {
    e.preventDefault()
    let form = e.target as HTMLFormElement;
    let tipo = "Teste"
    let nome = (form.elements.namedItem("nome") as HTMLInputElement).value
    let tipoTeste = (form.elements.namedItem("tipoTeste") as HTMLSelectElement).value
    let resultado = (form.elements.namedItem("resultado") as HTMLSelectElement).value
    let res = await fetch("/api/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        { nome: nome, tipo: tipoTeste, resultado: resultado, aeronaveId: Aeroselected?.id },
        { tipo: tipo }]),
    })
    console.log("debug: funcionou", res)
    await recarregarDados()
  }
  async function CriarEtap(e: React.FormEvent) {
    e.preventDefault()
    if (!isSelected()) { 
      alert("Selecione uma aeronave primeiro!");
      return false 
    }
    let form = e.target as HTMLFormElement;
    let tipo = "Etapa"
    let nome = (form.elements.namedItem("nome") as HTMLInputElement).value
    let prazo = (form.elements.namedItem("prazo") as HTMLInputElement).value
    let res = await fetch("/api/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          nome: nome,
          prazo: prazo,
          aeronaveId: Aeroselected?.id
        },
        { tipo: tipo }]),
    })
    console.log("debug: funcionou", res)
    await recarregarDados()
  }
  async function CriarFunc(e: React.FormEvent) {
    e.preventDefault()
    let form = e.target as HTMLFormElement;
    let tipo = "Funcionario"
    let nome = (form.elements.namedItem("nome") as HTMLInputElement).value
    let numeroCell = (form.elements.namedItem("numeroCell") as HTMLInputElement).value
    let endereco = (form.elements.namedItem("endereco") as HTMLInputElement).value
    let username = (form.elements.namedItem("username") as HTMLInputElement).value
    let senha = (form.elements.namedItem("senha") as HTMLInputElement).value
    let cargo = (form.elements.namedItem("cargo") as HTMLSelectElement).value
    let res = await fetch("/api/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          nome: nome,
          numeroCell: numeroCell,
          endereco: endereco,
          username: username,
          senha: senha,
          cargo: cargo
        },
        { tipo: tipo }]),
    })
    console.log("debug: funcionou", res)
    await recarregarDados()
  }
  async function CriarPeca(e: React.FormEvent) {
    e.preventDefault()
    let form = e.target as HTMLFormElement;
    let tipo = "Peca"
    let nome = (form.elements.namedItem("nome") as HTMLInputElement).value
    let tipoPeca = (form.elements.namedItem("tipoPeca") as HTMLSelectElement).value
    let fornecedor = (form.elements.namedItem("fornecedor") as HTMLInputElement).value
    let status = (form.elements.namedItem("status") as HTMLSelectElement).value
    let res = await fetch("/api/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ nome: nome, tipo: tipoPeca, fornecedor: fornecedor, status: status, aeronaveId: Aeroselected?.id },
      { tipo: tipo }]),
    })
    console.log("debug: funcionou", res)
    await recarregarDados()
  }
  async function EditarEtap(e: React.FormEvent) {
    e.preventDefault()
    let form = e.target as HTMLFormElement;
    let id = (form.elements.namedItem("Etapa") as HTMLSelectElement).value;
    let tipo = "Etapa"
    let status = (form.elements.namedItem("status") as HTMLSelectElement).value
    let res = await fetch("/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: parseInt(id), tipo: tipo, status: status }),
    })
    console.log("debug: funcionou", res)
    await recarregarDados()
  }
  async function AdicionarFunc(e: React.FormEvent) {
    e.preventDefault()
    let form = e.target as HTMLFormElement;
    let id = (form.elements.namedItem("Funcionario") as HTMLSelectElement).value;
    let etapaId = (form.elements.namedItem("Etapa") as HTMLSelectElement).value;
    let res = await fetch("/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: parseInt(id), tipo: "Funcionario", etapaId: parseInt(etapaId) }),
    })
    console.log("debug: funcionou", res)
    await recarregarDados()
  }
  async function AtualizarStatusPeca(e: React.FormEvent) {
    e.preventDefault()
    let form = e.target as HTMLFormElement;
    let id = (form.elements.namedItem("Peca") as HTMLSelectElement).value;
    let tipo = "Peca"
    let status = (form.elements.namedItem("status") as HTMLSelectElement).value
    let res = await fetch("/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: parseInt(id), tipo: tipo, status: status }),
    })
    console.log("debug: funcionou", res)
    await recarregarDados()
  }
  async function ExcluirEtap(e: React.FormEvent) {
    e.preventDefault()
    let form = e.target as HTMLFormElement;
    let id = (form.elements.namedItem("Etapa") as HTMLSelectElement).value;
    let tipo = "Etapa"
    let res = await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: parseInt(id), tipo: tipo }),
    })
    console.log("debug: funcionou", res)
    await recarregarDados()
  }
  async function ExcluirFunc(e: React.FormEvent) {
    e.preventDefault()
    let form = e.target as HTMLFormElement;
    let id = (form.elements.namedItem("Funcionario") as HTMLSelectElement).value;
    let tipo = "Funcionario"
    let res = await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: parseInt(id), tipo: tipo }),
    })
    console.log("debug: funcionou", res)
    await recarregarDados()
  }
  async function ExcluirPeca(e: React.FormEvent) {
    e.preventDefault()
    let form = e.target as HTMLFormElement;
    let id = (form.elements.namedItem("Peca") as HTMLSelectElement).value;
    let tipo = "Peca"
    let res = await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: parseInt(id), tipo: tipo }),
    })
    console.log("debug: funcionou", res)
    await recarregarDados()
  }
  async function ExcluirTeste(e: React.FormEvent) {
    e.preventDefault()
    let form = e.target as HTMLFormElement;
    let id = (form.elements.namedItem("Teste") as HTMLSelectElement).value;
    let tipo = "Teste"
    let res = await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: parseInt(id), tipo: tipo }),
    })
    console.log("debug: funcionou", res)
    await recarregarDados()
  }
  return (
    <>
      <div className="">
        <Tabs defaultValue="Aeronave">
          <TabsList>
            <TabsTrigger value="Aeronave">Aeronave</TabsTrigger>
            <TabsTrigger value="Etapa">Etapa</TabsTrigger>
            <TabsTrigger value="EditEtapa">Editar Etapa</TabsTrigger>
            <TabsTrigger value="Peca">Peça</TabsTrigger>
            <TabsTrigger value="Teste">Teste</TabsTrigger>
          </TabsList>
          <TabsContent value="Aeronave">
            <motion.div
              key="info"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden p-4 border rounded-lg bg-card shadow-sm"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Aeronaves</CardTitle>
                  <CardDescription>
                    Escoha sua aeronave.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">

                  <form className="grid gap-2" onSubmit={selectAero}>
                    <input type="hidden" name="tipo" value={"Aeronave"} />
                    <Label htmlFor="tabs-demo-username">Escolher Aeronave</Label>
                    <Select name="Aeroselect">
                      <SelectTrigger>
                        <SelectValue placeholder="Aeronaves" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Aeronave</SelectLabel>
                          {aeronaves.map((aero) => (
                            <SelectItem key={aero.id} value={aero.id.toString()}>
                              {aero.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button type="submit">Selecionar</Button>
                  </form>

                  <form onSubmit={CriarAero} className="grid gap-2">
                    <Label>Criar Aeronave</Label>
                    <Input name="Nome" placeholder="Nome" />
                    <Input name="Codigo" placeholder="Codigo" />
                    <Select name="Modelo">
                      <SelectTrigger>
                        <SelectValue placeholder="Modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Modelo</SelectLabel>
                          <SelectItem value="Militar">Militar</SelectItem>
                          <SelectItem value="Comercial">Comercial</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Input name="Capacidade" placeholder="Capacidade" />
                    <Input name="Alcance" placeholder="Alcance" />
                    <Button type="submit">Criar Aeronave</Button>
                  </form>

                </CardContent>
                <CardFooter>
                  <Sair />
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="Etapa">
            <motion.div
              key="info"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden p-4 border rounded-lg bg-card shadow-sm"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Etapa</CardTitle>
                  <CardDescription>
                    Apos Escolher a Etapa, voce podera iniciar ou finalizar a etapa, assim como adicionar funcionarios a ela.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-6">

                  <form onSubmit={CriarEtap} className="grid gap-2">
                    <Label>Criar Etapa</Label>
                    <Input name="nome" placeholder="Nome da Etapa" />
                    <Input name="prazo" placeholder="Prazo da Etapa" />
                    <Button>Criar Etapa</Button>
                  </form>

                  <form onSubmit={ExcluirEtap} className="grid gap-2">
                    <Label htmlFor="new">excluir Etapa</Label>
                    <Select name="Etapa">
                      <SelectTrigger>
                        <SelectValue placeholder="Etapas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Etapas</SelectLabel>
                          {etapa.map((etapaItem) => (
                            <SelectItem key={etapaItem.id} value={etapaItem.id.toString()}>
                              {etapaItem.nome}
                            </SelectItem>))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button>Excluir Etapa</Button>
                  </form>

                  <form onSubmit={CriarFunc} className="grid gap-2">
                    <Label htmlFor="confirm">Criar Funcionario</Label>
                    <Input name="nome" placeholder="Nome do Funcionario" />
                    <Input name="numeroCell" placeholder="Numero do Funcionario" />
                    <Input name="endereco" placeholder="Endereco do Funcionario" />
                    <Input name="username" placeholder="Usuario do Funcionario" />
                    <Input name="senha" placeholder="Senha do Funcionario" />
                    <Select name="cargo">
                      <SelectTrigger>
                        <SelectValue placeholder="Cargo do Funcionario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Cargos</SelectLabel>
                          <SelectItem value="Administrador">Administrador</SelectItem>
                          <SelectItem value="Engenheiro">Engenheiro</SelectItem>
                          <SelectItem value="Operador">Operador</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button>Criar Funcionario</Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <Sair />
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="EditEtapa">
            <motion.div
              key="info"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden p-4 border rounded-lg bg-card shadow-sm"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Editar Etapa</CardTitle>
                  <CardDescription>
                    voce podera iniciar ou finalizar a etapa, assim como adicionar funcionarios a ela.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-6">
                  <form onSubmit={EditarEtap} className="grid gap-2">
                    <Select name="Etapa">
                      <SelectTrigger>
                        <SelectValue placeholder="Etapa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Etapa</SelectLabel>
                          {etapa.map((etapaItem) => (
                            <SelectItem key={etapaItem.id} value={etapaItem.id.toString()}>
                              {etapaItem.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select name="status">
                      <SelectTrigger>
                        <SelectValue placeholder="Status da Etapa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="PENDENTE">PENDENTE</SelectItem>
                          <SelectItem value="EM_ANDAMENTO">EM_ANDAMENTO</SelectItem>
                          <SelectItem value="CONCLUIDA">CONCLUIDA</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button>Atualizar Status</Button>
                  </form>
                  <form onSubmit={AdicionarFunc} className="grid gap-2">
                    <Label htmlFor="new">Adicionar funcionario a Etapa</Label>
                    <Select name="Funcionario">
                      <SelectTrigger>
                        <SelectValue placeholder="Funcionarios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Funcionarios</SelectLabel>
                          {Users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select name="Etapa">
                      <SelectTrigger>
                        <SelectValue placeholder="Etapas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Etapas</SelectLabel>
                          {etapa.map((etapaItem) => (
                            <SelectItem key={etapaItem.id} value={etapaItem.id.toString()}>
                              {etapaItem.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        </SelectContent>
                      </Select>
                    <Button type="submit">Adicionar</Button>
                  </form>
                  <form onSubmit={ExcluirFunc} className="grid gap-2">
                    <Label htmlFor="new">Excluir funcionario</Label>
                    <Select name="Funcionario">
                      <SelectTrigger>
                        <SelectValue placeholder="Funcionarios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Funcionarios</SelectLabel>
                          {Users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button type="submit">Excluir</Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <Sair />
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="Peca">
            <motion.div
              key="info"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden p-4 border rounded-lg bg-card shadow-sm"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Peca</CardTitle>
                  <CardDescription>
                    crie ou edite uma peça.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-6">
                  <form onSubmit={ExcluirPeca} className="grid gap-2">
                    <Label htmlFor="current">Excluir Peça</Label>
                    <Select name="Peca">
                      <SelectTrigger>
                        <SelectValue placeholder="Peças" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Peças</SelectLabel>
                          {pecas.map((peca) => (
                            <SelectItem key={peca.id} value={peca.id.toString()}>
                              {peca.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button>Excluir Peça</Button>
                  </form>
                  <form onSubmit={CriarPeca} className="grid gap-2">
                    <Label htmlFor="new">Criar Peça</Label>
                    <Input name="nome" placeholder="Nome da Peça" />
                    <Select name="tipoPeca">
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo da Peça" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipos</SelectLabel>
                          <SelectItem value="Importada">Importada</SelectItem>
                          <SelectItem value="Nacional">Nacional</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Input name="fornecedor" placeholder="Fornecedor da Peça" />
                    <Select name="status">
                      <SelectTrigger>
                        <SelectValue placeholder="Status da Peça" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="Producao">Producao</SelectItem>
                          <SelectItem value="Em_Andamento">Em_Andamento</SelectItem>
                          <SelectItem value="Concluida">Concluida</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button>Criar Peça</Button>
                  </form>
                  <form onSubmit={AtualizarStatusPeca} className="grid gap-2">
                    <Label htmlFor="confirm">Quando a peça for selecionada ira atualizar o status:</Label>
                    <Select name="Peca">
                      <SelectTrigger>
                        <SelectValue placeholder="Peças" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Peças</SelectLabel>
                          {pecas.map((peca) => (
                            <SelectItem key={peca.id} value={peca.id.toString()}>
                              {peca.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select name="status">
                      <SelectTrigger>
                        <SelectValue placeholder="Status da Peça" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="Producao">Producao</SelectItem>
                          <SelectItem value="Em_Transporte">Em Transporte</SelectItem>
                          <SelectItem value="Concluida">Concluida</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button>Atualizar Status</Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <Sair />
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="Teste">
            <motion.div
              key="info"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden p-4 border rounded-lg bg-card shadow-sm"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Teste</CardTitle>
                  <CardDescription>
                    Faca testes da aplicação aqui.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">

                  <form onSubmit={CriarTeste} className="grid gap-2">
                    <Label htmlFor="current">Criar Teste</Label>
                    <Input name="nome" placeholder="Nome do Teste" />
                    <Select name="tipoTeste">
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo do Teste" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipos</SelectLabel>
                          <SelectItem value="Aerodinamico">Aerodinamico</SelectItem>
                          <SelectItem value="Mecanico">Mecanico</SelectItem>
                          <SelectItem value="Eletrico">Eletrico</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Select name="resultado">
                      <SelectTrigger>
                        <SelectValue placeholder="Resultado do Teste" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Resultados</SelectLabel>
                          <SelectItem value="APROVADO">Aprovado</SelectItem>
                          <SelectItem value="REPROVADO">Reprovado</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button>Criar Teste</Button>
                  </form>

                  <form onSubmit={ExcluirTeste} className="grid gap-2">
                    <Label htmlFor="new">Excluir Teste</Label>
                    <Select name="Teste">
                      <SelectTrigger>
                        <SelectValue placeholder="Testes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Testes</SelectLabel>
                          {testes.map((teste) => (
                            <SelectItem key={teste.id} value={teste.id.toString()}>
                              {teste.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button>Excluir Teste</Button>
                  </form>
                  
                </CardContent>
                <CardFooter>
                  <Sair />
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
        {hud(Aeroselected)}
      </div>
    </>
  )
}

function hud(Aeroselected: Aero | null) {
  return (
    <div className="grid gap-6 p-6 bg-background text-foreground rounded-lg shadow-lg max-w-4xl mx-auto my-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <p><b>Código:</b> {Aeroselected?.codigo}</p>
          <p><b>Modelo:</b> {Aeroselected?.nome}</p>
          <p><b>Tipo:</b> {Aeroselected?.modelo}</p>
          <p><b>Capacidade:</b> {Aeroselected?.capacidade}</p>
          <p><b>Alcance:</b> {Aeroselected?.alcance} m</p>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Testes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {Aeroselected?.testes.map((teste) => (
              <div key={teste.id}>
                <p><b>Nome:</b> {teste.nome}</p>
                <p><b>Tipo:</b> {teste.tipo}</p>
                <p><b>Resultado:</b> {teste.resultado}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Etapas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Aeroselected?.etapas.map((etapa) => (
          <div key={etapa.id} className="border rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p><b>Nome:</b> {etapa.nome}</p>
                <p><b>Prazo:</b> {etapa.prazo}</p>
              </div>
              <Badge variant="outline">{etapa.status}</Badge>
            </div>
            <Separator />
            <div>
              {etapa.funcionarios.map((funcionario) => (
                <div key={funcionario.id}>
                  <p><b>Nome:</b> {funcionario.nome}</p>
                  <p><b>Telefone:</b> {funcionario.numeroCell}</p>
                  <p><b>Endereço:</b> {funcionario.endereco}</p>
                  <p><b>Usuário:</b> {funcionario.username}</p>
                </div>
              ))}
            </div>
          </div>
          ))}
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Peças</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {Aeroselected?.pecas.map((peca) => (
            <div key={peca.id} className="border rounded-lg p-3 space-y-2">
              <div>
                <p><b>Nome:</b> {peca.nome}</p>
                <p><b>Tipo:</b> {peca.tipo}</p>
                <p><b>Fornecedor:</b> {peca.fornecedor}</p>
              </div>
              <Badge variant="secondary">{peca.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Sair() {
  const navigate = useNavigate();
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  }
  return (
    <form onSubmit={handleLogout}>
      <div>
        <Button type="submit">Sair</Button>
      </div>
    </form>
  );
}

export default Aerocode;
