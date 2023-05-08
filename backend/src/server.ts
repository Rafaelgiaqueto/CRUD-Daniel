import Fastify from 'fastify'

const app = Fastify()

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

import cors from '@fastify/cors'

app.register(cors)

import {number, z} from 'zod'


// Cria rota com o verbo get
app.get('/hello', () => {
	return 'Hello World'
})

// rota para listar os posts cadastrados no banco de dados
app.get('/posts', async () => {
    // await indica que a função somente continua depois que os dados vierem
    const posts = await prisma.post.findMany()
    return posts
})

// Retornando só o título do post
app.get('/posts/title/:title', async (request) => {
    const titleParam = z.object({
        title: z.string()
    })

    const {title} = titleParam.parse(request.params)

    const posts = await prisma.post.findMany({
        where: {
            title: {
                startsWith: title   
            }
        }
    })
    return posts
})

app.post('/post', async (request) => {
    const postBody = z.object({
        title: z.string(),
        content: z.string(),
        published: z.boolean()
    })

    const {title, content, published} = postBody.parse(request.body)

    const newPost = await prisma.post.create({
        data: {
            title: title,
            content: content,
            published: published
        }
    })
    return newPost
})

// Put é quando preciso atualizar todos os campos de um registro no banco
// Patch é quando preciso atualizar UM campo apenas no banco
app.patch('/post/content', async (request) => {

    // Cria um objeto zod para definir um esquema de dados
    const contentBody = z.object({
        id: z.number(),
        content: z.string()
    })

    // Recupera os dados do frontend
    const {id, content} = contentBody.parse(request.body)

    // Atualiza no banco de dados
    const postUpdated = await prisma.post.update({
        where: { 
            id: id
        },
        data: {
            content: content
        }
    })
    return postUpdated
})

app.delete('/post/:id',async (request) => {
    const IdParam = z.object({
        id: z.string()
    })

    const {id} = IdParam.parse(request.params)

    const idNumber = Number(id)

    const postDeleted = await prisma.post.delete({
        where: {
            id: idNumber
        }
    })
    return postDeleted
})  

app.listen({
    port: 3333,
})
.then( () => {
    console.log('Http Server running http://localhost:3333')
})
