import Fastify from 'fastify'
import { AppRoutes } from './routes'
import fastifyCors from '@fastify/cors'


const app = Fastify()

app.register(fastifyCors)
app.register(AppRoutes)

app.listen({
  port: 3333,
})
.then(() => {
  console.log('Http Server running http://localhost:3333')
})