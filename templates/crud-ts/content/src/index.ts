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

// Create table is part of this app for demonstration purposes
// In a real-world application you don't want to expose
// this capability via HTTP
// before deploying this application to production, remove the 
// corresponding post handler in the router above or
// add proper authentication capabilities to prevent abuse
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
