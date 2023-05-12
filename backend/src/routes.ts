import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";


export async function AppRoutes(app: FastifyInstance) {
  
  // Cria rota com o verbo get
  app.get("/hello", () => {
    return "Hello World";
  });

  // rota para listar os posts cadastrados no banco de dados
  app.get("/posts", async () => {
    // await indica que a função somente continua depois que os dados vierem
    const posts = await prisma.post.findMany();
    return posts;
  });

  // Retornando só o título do post
  app.get("/posts/title/:title", async (request) => {
    const titleParam = z.object({
      title: z.string(),
    });

    const { title } = titleParam.parse(request.params);

    const posts = await prisma.post.findMany({
      where: {
        title: {
          startsWith: title,
        },
      },
    });
    return posts;
  });

  app.post("/post", async (request) => {
    const postBody = z.object({
      title: z.string(),
      content: z.string(),
      published: z.boolean(),
    });

    const { title, content, published } = postBody.parse(request.body);

    const newPost = await prisma.post.create({
      data: {
        title: title,
        content: content,
        published: published,
      },
    });
    return newPost;
  });

  // Put é quando preciso atualizar todos os campos de um registro no banco
  // Patch é quando preciso atualizar UM campo apenas no banco
  app.patch("/post/content", async (request) => {
    // Cria um objeto zod para definir um esquema de dados
    const contentBody = z.object({
      id: z.number(),
      content: z.string(),
    });
  
    // Recupera os dados do frontend
    const { id, content } = contentBody.parse(request.body);
  
    // Verifica se o post existe no banco de dados
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
  
    if (!post) {
      throw new Error("Post não encontrado");
    }
  
    // Atualiza no banco de dados
    const postUpdated = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        content: content,
      },
    });
    return postUpdated;
  });

  // Atualizar post
  app.put("/post/:id", async (request) => {
    const idParam = z.object({
      id: z.string(),
    });

    const putBody = z.object({
      title: z.string(),
      content: z.string(),
    });

    const { id } = idParam.parse(request.params);
    const { title, content } = putBody.parse(request.body);

    const idNumber = Number(id);
    const postUpdated = await prisma.post.updateMany({
      where: {
        id: idNumber,
        published: true,
      },
      data: {
        title: title,
        content: content,
      },
    });
    return postUpdated.count >= 1
      ? "Atualização realizada com sucesso"
      : "Nada foi atualizado";
  });

  app.delete("/post/:id", async (request) => {
    const IdParam = z.object({
      id: z.string(),
    });
  
    const { id } = IdParam.parse(request.params);
  
    const idNumber = Number(id);
  
    // Verifica se o post existe no banco de dados
    const post = await prisma.post.findUnique({
      where: {
        id: idNumber,
      },
    });
  
    if (!post) {
      throw new Error("Post não encontrado");
    }
  
    const postDeleted = await prisma.post.delete({
      where: {
        id: idNumber,
      },
    });
    return postDeleted;
  });
}
