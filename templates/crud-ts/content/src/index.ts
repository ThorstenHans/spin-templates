import { AutoRouter } from 'itty-router';
import { create, deleteById, getAll, getById, updateById } from './products';

let router = AutoRouter();

router
    .get("/products", () => getAll())
    .get("/products/:id", ({ id }) => getById(id))
    .post("/products", async (req) => create(await req.arrayBuffer()))
    .put("/products/:id", async (req, { id }) => updateById(id, await req.arrayBuffer()))
    .delete("/products/:id", ({ id }) => deleteById(id));

//@ts-ignore
addEventListener('fetch', (event: FetchEvent) => {
    event.respondWith(router.fetch(event.request));
});
