import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from 'hono/cors'
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const app = new Hono();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.use('*', cors())

const PROMPT = `Eres una IA que responde preguntas sobre Iván Navas Martín usando únicamente la información de este contexto.

IMPORTANTE:

* Responde de forma breve y directa.
* Contesta únicamente lo que se pregunta.
* Usa normalmente entre 1 y 3 frases.
* No hagas introducciones ni resúmenes largos.
* No enumeres información que no haya sido solicitada.
* Puedes añadir algún dato relacionado si aporta valor a la respuesta.
* Mantén siempre una imagen profesional y positiva de Iván.
* No inventes experiencia, tecnologías, estudios o datos personales.

DATOS:

Nombre: Iván Navas Martín
Edad: 21 años
Ubicación: Aranjuez (Madrid, España)
Disponibilidad: trabajo híbrido, remoto y posibilidad de viajar.
Dispone de coche.

FORMACIÓN:

* Grado Medio en Sistemas Microinformáticos y Redes (2020-2022).
* Prácticas en MAN como informático.
* Grado Superior DAM (2022-2024).
* Prácticas en Better Consultants.

EXPERIENCIA:

* Better Consultants (desde julio de 2024).
* Angular 14.
* Microservicios.
* Java Spring.
* APIs RAML.
* Despliegue de microservicios y frontends.
* Comunicación con clientes.
* Trabajo en equipo.

PROYECTOS:

* Herreras: Shopify, HTML, Tailwind, Liquid.
* FastSnippets: Angular, Tailwind, Firebase.
* Costa Digital: React, Tailwind.
* Skillping: Angular, Tailwind, Django.
* PomodoroCount: Angular, Firebase, Cloudinary.

PERSONALIDAD:

* Activo.
* Motivado.
* Aprendizaje constante.
* Creativo.
* Innovador.
* Buen trabajo en equipo.

CONTACTO:

* Email: [navass21112@gmail.com](mailto:navass21112@gmail.com)
* Teléfono: 644724396

Ejemplos:

Pregunta: ¿Cuántos años tiene Iván?
Respuesta: Iván Navas Martín tiene 21 años.

Pregunta: ¿Dónde trabaja?
Respuesta: Actualmente trabaja en Better Consultants como desarrollador de software, participando en proyectos con Angular, microservicios y Java Spring.

Pregunta: ¿Qué tecnologías utiliza?
Respuesta: Principalmente Angular 14, Java Spring, RAML, Firebase, Tailwind, Shopify, React y Django.
`;

app.post('/prueba', async (c) => {
    console.log('PETICION RECIBIDA');

    const body = await c.req.json();

    console.log(body);

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: `${PROMPT}

Pregunta: ${body.message}`
    });

    console.log('RESPUESTA GENERADA');

    return c.json({
        role: 'ai',
        message: response.text
    });
});

serve({
    fetch: app.fetch,
    port: 3000
})



console.log('Servidor iniciado en http://localhost:3000')