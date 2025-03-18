import { Sqlite } from "@fermyon/spin-sdk";
import { json, status } from "itty-router";
import { v4 as uuidv4 } from 'uuid';
const dec = new TextDecoder();

export interface Product {
    id: string,
    name: string
}
export const getAll = (): Response => {
    const db = Sqlite.openDefault();
    const queryResult = db.execute("SELECT Id, Name from Products", []);
    const products = queryResult.rows.map((row) => {
        return {
            id: row['Id']!,
            name: row['Name']!
        } as Product
    })
    return json(products)
};

export const getById = (id: string): Response => {
    if (!id) {
        return new Response('Bad Request', { status: 400 });
    }
    const db = Sqlite.openDefault();
    const queryResult = db.execute("SELECT Id, Name FROM Products WHERE Id = ?", [id]);
    if (queryResult.rows.length == 0) {
        return new Response('Not Found', { status: 404 });
    }
    const found = {
        id: queryResult.rows[0]['Id']!,
        name: queryResult.rows[0]['Name']
    } as Product;
    return json(found)
};

export const create = (body: ArrayBuffer): Response => {
    const payload = JSON.parse(dec.decode(body));
    if (!payload || !payload.name) {
        return new Response('Bad Request', { status: 400 });
    }
    try {
        const db = Sqlite.openDefault()
        const id = uuidv4();
        const result = db.execute("INSERT INTO Products (Id, Name) VALUES (?, ?)", [id, payload.name]);
        return json({ id: id, name: payload.name } as Product, {
            status: 201,
            headers: {
                'location': `/products/${id}`,
                'content-type': 'application/json'
            }
        });
    }
    catch (err) {
        console.log(`Error while storing new product: ${err}`);
        return new Response('Internal Server Error', { status: 500 });
    }
};

export const updateById = (id: string, body: ArrayBuffer): Response => {
    const payload = JSON.parse(dec.decode(body));
    if (!payload || !payload.name || !id) {
        return new Response('Bad Request', { status: 400 });
    }
    try {
        const db = Sqlite.openDefault()
        db.execute("UPDATE Products set NAME=? WHERE Id=?", [payload.name, id])
        return json({ id: id, name: payload.id } as Product)
    }
    catch (err) {
        console.log(`Error while updating a product: ${err}`);
        return new Response('Internal Server Error', { status: 500 });
    }
};

export const deleteById = (id: string): Response => {
    if (!id) {
        return new Response('Bad Request', { status: 400 });
    }
    try {
        const db = Sqlite.openDefault()
        db.execute("DELETE FROM Products WHERE Id=?", [id])
        return status(204)
    }
    catch (err) {
        console.log(`Error while deleting a product: ${err}`);
        return new Response('Internal Server Error', { status: 500 });
    }
};