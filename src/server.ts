
import express from 'express'
import router from './routes/routes'

const app = express()

app.use(express.json())

//routers

app.use('/', router)


export default app