async function consultaPosts(){

    const posts = await fetch('http://localhost:3333/posts')
                        .then(resposta => {
                            return resposta.json()
                        }) // bateu na api e devolveu o resultado

    let conteudoTabela = ''
    // percorrendo cada post presente em posts(no banco)
    posts.forEach(post => {
        // Acumula na variável conteúdoTabela os dados de cada post
        conteudoTabela+= `<tr> <td> ${post.id} </td> <td> ${post.title} </td> <td> ${post.content} </td>
        <td> ${post.published} </td> </tr>` 
    })

    // Vamos jogar os dados no html
    document.getElementById('corpoTabela').innerHTML = conteudoTabela
}