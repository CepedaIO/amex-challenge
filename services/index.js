import Fastify from 'fastify';
import listenMock from '../mock-server/index.js';
import {callWithFalloff} from "./api.js";
import {getEventByUserId, addEvent} from "./endpoints.js";

const fastify = Fastify({ logger: true });
fastify.get('/getUsers', async (request, reply) => {
    const resp = await fetch('http://event.com/getUsers');
    const data = await resp.json();
    reply.send(data); 
});

fastify.post('/addEvent', async (request, reply) => {
    const data = await callWithFalloff(() => addEvent(request.body), -1, [ 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200 ]);
    reply.send(data);
});

fastify.get('/getEvents', async (request, reply) => {  
    const resp = await fetch('http://event.com/getEvents');
    const data = await resp.json();
    reply.send(data);
});

fastify.get('/getEventsByUserId/:id', async (request, reply) => {
    const { id } = request.params;

    const events = await callWithFalloff(() => getEventByUserId(id), -1);
    reply.send(events);
});

fastify.listen({ port: 3000 }, (err) => {
    listenMock();
    if (err) {
      fastify.log.error(err);
      process.exit();
    }
});
