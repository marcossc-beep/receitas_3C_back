import Fastify from 'fastify'

const servidor = Fastify()

servidor.get('/usuarios', () => {
    return 'Está funcionando!'
})

servidor.listen({
    port: 3000
})