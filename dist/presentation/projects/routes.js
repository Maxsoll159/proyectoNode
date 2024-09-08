"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const routerProjects = (0, express_1.Router)();
routerProjects.get('/', controller_1.ProjectController.getAllProjects);
routerProjects.post("/", controller_1.ProjectController.createProject);
exports.default = routerProjects;
