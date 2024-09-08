import { Router } from "express";


import { routerTask } from "../presentation/task/routes";
import { routerProjects } from "../presentation/projects/routes";
import { routerAuth } from "../presentation/auth/routes";


const router = Router()

router.use('/api/projects', routerProjects)

router.use('/api/task', routerTask)

router.use('/api/auth', routerAuth)


export default router