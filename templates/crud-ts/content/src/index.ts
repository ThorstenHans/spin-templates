import { AutoRouter } from 'itty-router';
import { Sqlite } from "@fermyon/spin-sdk";
import { create, deleteById, getAll, getById, updateById } from './products';

let router = AutoRouter();

router
    .get("/products", () => getAll())
    .get("/products/:id", ({ id }) => getById(id))
    .post("/products", async (req) => create(await req.arrayBuffer()))
    .put("/products/:id", async (req) => updateById(req.params.id, await req.arrayBuffer()))
    .delete("/products/:id", ({ id }) => deleteById(id))
    .post("/create-table", () => createTable());

const createTable = (): Response => {
    try {
        const db = Sqlite.openDefault();
        const queryResult = db.execute("CREATE TABLE IF NOT EXISTS Products ( Id TEXT PRIMARY KEY, Name TEXT NOT NULL); ", []);
        return new Response(null, { status: 204 })
    } catch (err) {
        console.log(`Error while creating table ${err}`);
        return new Response(null, { status: 500 })
    }

}

//@ts-ignore
addEventListener('fetch', (event: FetchEvent) => {
    event.respondWith(router.fetch(event.request));
});
