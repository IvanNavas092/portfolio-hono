import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from 'hono/cors'
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const app = new Hono();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.use('*', cors())


app.post('/prueba', async (c) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Debes dejar claro quien es Ivan Navas, de momento solo puedes decir que tiene 22 años"
    });
    console.log(response.text);
    return c.json({
        message: response.text
    })
})

serve({
    fetch: app.fetch,
    port: 3000
})

console.log('Servidor iniciado en http://localhost:3000')