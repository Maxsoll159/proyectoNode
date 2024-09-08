"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
class ProjectController {
}
exports.ProjectController = ProjectController;
_a = ProjectController;
ProjectController.getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Todos los proyecto");
});
ProjectController.createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //boyd
    console.log(req.body);
    res.send("Creanod Poryecto....");
});
