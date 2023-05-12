import Fastify from 'fastify'
import { AppRoutes } from './routes'

const app = Fastify()

app.register(AppRoutes)

app.listen({
    port: 3333,
})
.then( () => {
    console.log('Http Server running http://localhost:3333')
})
