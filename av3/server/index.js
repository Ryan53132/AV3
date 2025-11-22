import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/api/popula", async (req, res) => {
  try {
    // --- Aeronaves ---
    const aeronave1 = await prisma.aeronave.create({
      data: {
        codigo: "AER001",
        nome: "Falcão X",
        modelo: "Militar",
        capacidade: 2,
        alcance: 3000
      }
    });

    const aeronave2 = await prisma.aeronave.create({
      data: {
        codigo: "AER002",
        nome: "AirBus BR",
        modelo: "Comercial",
        capacidade: 180,
        alcance: 8000
      }
    });

    // --- Etapas ---
    await prisma.etapa.createMany({
      data: [
        {
          nome: "Montagem Estrutural",
          prazo: new Date("2025-05-20"),
          status: "PENDENTE",
          aeronaveId: aeronave1.id,
        },
        {
          nome: "Instalação Elétrica",
          prazo: new Date("2025-06-11"),
          status: "EM_ANDAMENTO",
          aeronaveId: aeronave1.id,
        }
      ]
    });

    // --- Funcionários ---
    const func1 = await prisma.funcionario.create({
      data: {
        nome: "Carlos Silva",
        numeroCell: "1199999999",
        endereco: "Rua A, 123",
        username: "carlos",
        senha: "senha123",
        cargo: "Engenheiro",
      }
    });

    const func2 = await prisma.funcionario.create({
      data: {
        nome: "João Souza",
        numeroCell: "1198888888",
        endereco: "Rua B, 456",
        username: "joao",
        senha: "senha456",
        cargo: "Operador",
      }
    });

    // Associar funcionários a etapas
    const etapa = await prisma.etapa.findFirst();
    if (etapa) {
      await prisma.etapa.update({
        where: { id: etapa.id },
        data: {
          funcionarios: {
            connect: [{ id: func1.id }, { id: func2.id }]
          }
        }
      });
    }

    // --- Peças ---
    await prisma.peca.createMany({
      data: [
        {
          nome: "Turbina XP",
          tipo: "Importada",
          fornecedor: "Boeing Parts",
          status: "Producao",
          aeronaveId: aeronave1.id
        },
        {
          nome: "Painel Digital",
          tipo: "Nacional",
          fornecedor: "AeroTech BR",
          status: "Concluida",
          aeronaveId: aeronave1.id
        }
      ]
    });

    // --- Testes ---
    await prisma.teste.createMany({
      data: [
        {
          nome: "Teste Estrutural",
          tipo: "Mecanico",
          resultado: "APROVADO",
          aeronaveId: aeronave1.id
        },
        {
          nome: "Teste de Software",
          tipo: "Eletrico",
          resultado: "REPROVADO",
          aeronaveId: aeronave1.id
        }
      ]
    });

    res.json("Seed finalizado com sucesso!");
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao popular banco de dados" });
  }
})



app.get("/api/selectAero", async (req, res) => {
  const Aeros = await prisma.aeronave.findMany(
    {
      select: {
        id: true,
        nome: true,
      }
    }
  );
  res.json(Aeros)
})
app.get("/api/selectUsers", async (req, res) => {
  const user = await prisma.funcionario.findMany();
  res.json(user)
})

app.post("/api/login", async (req, res) => {
  const name = req.body.email
  const password = req.body.senha
  console.log(name, password, " teste teste")
  const user = await prisma.funcionario.findFirst({
    where: { name: name, password: password }
  });
  if (user) {
    res.json({ res: true, user: name })
  } else {
    res.json({ res: false })
  }
});

app.post("/api/select", async (req, res) => {
  try {
    if (req.body.tipo == "Aeronave") {
      const id = parseInt(req.body.id);
      const aeronave = await prisma.aeronave.findFirst({
        where: { id },
        include: {
          etapas: {
            include: {
              funcionarios: true
            }
          },
          pecas: true,
          testes: true
        }
      });
      
      return res.json(aeronave);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error asd" });
  }
})

app.post("/api/insert", async (req, res) => {
  try {
    if (req.body[1].tipo == "Aeronave") {
      await prisma.aeronave.create({ data: req.body[0] })
    } else if (req.body[1].tipo == "Etapa") {
      await prisma.etapa.create({ data: req.body[0] })
    }else if (req.body[1].tipo == "Peca") {
      await prisma.peca.create({ data: req.body[0] })
    }else if (req.body[1].tipo == "Teste") {
      await prisma.teste.create({ data: req.body[0] })
    }else if (req.body[1].tipo == "Funcionario") {
      await prisma.funcionario.create({ data: req.body[0] })
    }
    else {
      return res.status(400).json({ error: "Tipo de dado não encontrado" });
    }
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
})

app.post("/api/update", async (req, res) => {
  try {
    const body = Array.isArray(req.body) ? req.body[0] : req.body;
    if (body.tipo == "Etapa") {
      await prisma.etapa.update({ where: { id: body.id }, data: { status: body.status } })
    } else if (body.tipo == "Peca") {
      await prisma.peca.update({ where: { id: body.id }, data: { status: body.status } })
    } else if (body.tipo == "Funcionario") {
      const etapa = await prisma.etapa.findUnique({ where: { id: body.etapaId } });
      if (!etapa) {
        return res.status(404).json({ error: "Etapa não encontrada" });
      }
      await prisma.etapa.update({
        where: { id: body.etapaId },
        data: {
          funcionarios: {
            connect: { id: body.id }
          }
        }
      });
      return res.json({ success: true });
    } else {
      return res.status(400).json({ error: "Tipo de dado não encontrado" });
    }
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
})

app.post("/api/delete", async (req, res) => {
  try {
    const body = Array.isArray(req.body) ? req.body[0] : req.body;
    if (body.tipo == "Etapa") {
      await prisma.etapa.delete({ where: { id: body.id } })
    } else if (body.tipo == "Funcionario") {
      await prisma.funcionario.delete({ where: { id: body.id } })
    } else if (body.tipo == "Peca") {
      await prisma.peca.delete({ where: { id: body.id } })
    } else if (body.tipo == "Teste") {
      await prisma.teste.delete({ where: { id: body.id } })
    } else {
      return res.status(400).json({ error: "Tipo de dado não encontrado" });
    }
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
})

app.listen(3000, () => {
  console.log("Servidor Express rodando na porta http://localhost:3000/");
});
