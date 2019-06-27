const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

let contReq = 0;

server.use((req, res, next) => {
  contReq++;

  console.log(`Número de requisições já feitas na aplicação: ${contReq}!`);

  return next();
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  if (!projects.find(p => p.id === id)) {
    return res.status(400).json({ error: "Projeto informado não existe!!" });
  }

  return next();
}

server.get("/Projects", (req, res) => {
  return res.json(projects);
});

server.post("/Projects", (req, res) => {
  const { id, title } = req.body;

  const newProject = { id: id, title: title, tasks: [] };

  projects.push(newProject);

  return res.json(projects);
});

server.post("/Projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const alterProject = projects.find(p => p.id === id);

  alterProject.tasks.push(title);

  return res.json(alterProject);
});

server.put("/Projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const alterProject = projects.find(p => p.id === id);

  alterProject.title = title;

  return res.json(alterProject);
});

server.delete("/Projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const delProject = projects.findIndex(p => p.id === id);

  projects.splice(delProject, 1);

  return res.send();
});

server.listen(3000);
