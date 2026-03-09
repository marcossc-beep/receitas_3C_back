import Fastify from 'fastify'
import { Pool } from 'pg'

const sql = new Pool({
    user: "postgres",
    password: "senai",
    host: "localhost",
    port: 5432,
    database: "receitas"
})

const servidor = Fastify()

servidor.get('/usuarios', async () => {
    const resultado = await sql.query('select * from usuario')
    return resultado.rows
})

servidor.post('/usuarios', async (request, reply) => {
    const nome = request.body.nome;
    const senha = request.body.senha;

    if (!nome || !senha) {
        reply.status(400).send({error: 'Nome ou Senha Inválidos!'})
    }

    const resultado = await sql.query('INSERT INTO usuario (nome, senha) VALUES ($1, $2)', [nome, senha])
    reply.status(201).send({mensagem: "Deu certo!"})
})

servidor.put('/usuarios/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id

    if (!body || !body.nome || !body.senha) {
        reply.status(400).send({error: 'nome ou senha inv!'})
    } else if (!id) {
        reply.status(400).send({error: 'Faltou o ID!'})
    }

    const existe = await sql.query(
        'select * from usuario where id = $1', [id]
    )
    
    if (existe.rows.length === 0) {
        reply.status(400).send(
            {error: 'Usuário não existe no banco!'}
        )
    }

    const resultado = await sql.query('UPDATE usuario SET nome = $1, senha = $2 WHERE id = $3', [body.nome, body.senha, id])     
    return 'Usuario alterado!'
})

servidor.delete('/usuarios/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query('DELETE FROM usuario where id = $1', [id])      
    reply.status(204)
})

servidor.listen({
    port: 3000
})