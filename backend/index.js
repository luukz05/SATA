const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let ultimoAviso = null;
let avisoId = 0;
//para abrir o server ngrok rodar ngrok http 3001, pegar o link e jogar no front e no esp
app.post("/", (req, res) => {
  const { mensagem } = req.body;
  if (!mensagem)
    return res.status(400).send({ erro: "Mensagem é obrigatória" });

  avisoId++;

  const agora = new Date();
  ultimoAviso = {
    id: avisoId,
    mensagem,
    data: agora.toISOString(), // também pode usar agora.toLocaleString() se preferir string pronta
  };

  console.log("Novo aviso:", ultimoAviso);
  res.status(201).send({ sucesso: true });
});

app.get("/", (req, res) => {
  res.send(
    ultimoAviso || {
      id: 0,
      mensagem: "Nenhum aviso ainda.",
      data: new Date().toISOString(),
    }
  );
});

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));
