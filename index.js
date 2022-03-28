const express = require("express"); // npm i express
const agents = require("./data/agentes.js");
const app = express();
const jwt = require("jsonwebtoken"); // npm i jsonwebtoken

app.listen(3000, () => console.log("Servidor escuchando en el puerto 3000"));
let secretKey = "Agentes de SHIELD";

app.use(express.static(__dirname+'/public'))

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/SignIn", (req, res) => {
  const { email, password } = req.query;
  const agent = agents.results.find(
    (a) => a.email == email && a.password == password
  );
  if (agent) {
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 120,
        data: agent,
      },
      secretKey
    );
    res.send(`
  <a href="/Dashboard?token=${token}"> <p> Ir al Dashboard de SHIELD </p> </a>
  Bienvenido super agente secreto, ${email}.
  <script>
  localStorage.setItem('token', JSON.stringify("${token}"))
  </script>
  `);
  } else {
    res.send("<h1>Usuario o contraseña incorrecta</h1>");
  }
});

app.get("/Dashboard", (req, res) => {
  let { token } = req.query;
  jwt.verify(token, secretKey, (err, decoded) => {
    err
      ? res.status(401).send({
          error: "401 Unauthorized",
          message: err.message,
        })
      :
        res.send(`<h2>Bienvenido al Dashboard de SHIELD ${decoded.data.email}</h2>
            <img src="/img/dashboard.png"><br><br>
            <a href=/login><button>Cerrar sesión</button></a>
            <style>
                body{
                  background-color: #0F1E1F;
                  color: white;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-direction: column;
                }
            </style>
            <script>
            document.querySelector('button').addEventListener('click', ()=>{
              localStorage.clear();
            })
            </script>
      `);
  });
});

