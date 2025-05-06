const express = require('express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const mysql = require('mysql2') // DB
// la variable requiere del paquete express

const cors = require('cors') // alguien puede acceder al servidor

const app = express()
const port = 3000

const multer = require('multer') // para la carga de archivos
const carpeta_archivos = multer({dest:'fotos/'}) // carpeta donde se guardaran los archivos

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// DEFINIR CONEXIÓN A MYSQL
const bd = mysql.createConnection({
    host:'localhost', // a prod seria la ip del dominio
    port:3306,
    user:'root',
    password: 'v5090L03',
    database:'dreamingflowers'
})

// CONECTAR MYSQL
bd.connect((err) => {
    if (err) {
        console.log("Error al conectarse a MySQL ):" + err.stack)
        return;
    }
    console.log("Conectado a MySQL (:")
})

// CREANDO NUESTRA PRIMERA RUTA
app.get('/',(req, res) => {
    res.send("Bienvenidos al servidor")
})

// ------------------------------------------ PROCESAR DATOS / schemas -----------------------------------------------------------------

/**
 * @swagger
 * components:
 *      schemas:
 *          Floreria:
 *              type: object
 *              required:
 *                  - nombre
 *                  - ubicacion
 *                  - telefono
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: ID autoincrementable de la floreria
 *                  nombre:
 *                      type: string
 *                      description: nombre de la floreria
 *                  ubicacion:
 *                      type: string
 *                      description: ubicación de la floreria
 *                  telefono:
 *                      type: string
 *                      description: número telefónico de la floreria
 *              example:
 *                  nombre: "El girasol de Benja"
 *                  ubicacion: "Av 135"
 *                  telefono: "66666666"
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          Producto:
 *              type: object
 *              required:
 *                  - nombre
 *                  - descripcion
 *                  - precio
 *                  - foto
 *                  - floreria
 *                  - categoria
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: ID autoincrementable de la floreria
 *                  nombre:
 *                      type: string
 *                      description: nombre del producto
 *                  descripcion:
 *                      type: string
 *                      description: descripcion del producto
 *                  precio:
 *                      type: double
 *                      description: precio del producto
 *                  foto:
 *                      type: string
 *                      description: foto del producto
 *                  floreria:
 *                      type: integer
 *                      description: floreria que vende el producto
 *                  categoria:
 *                      type: integer
 *                      description: categoría del producto
 *              example:
 *                  nombre: "corona de flores"
 *                  descripcion: "corona hecha con flores"
 *                  precio: 200
 *                  foto: corona.jpg
 *                  floreria: 1
 *                  categoria: 3
 */

// ----------------------------------------------------- TAGS -----------------------------------------------------------

/**
 * @swagger
 * tags:
 *      name: Florerias
 *      description: API del catálogo de florerias
 */

/**
 * @swagger
 * tags:
 *      name: Productos
 *      description: API del catálogo de productos
 */

// ------------------------------------------------------ GETS ----------------------------------------------------------

/**
 * @swagger
 * /florerias:
 *  get:
 *      summary: Listado de Florerias
 *      tags: [Florerias]
 *      responses:
 *          200:
 *              description: Muestra la lista de florerias
 */ 

/**
 * @swagger
 * /productos:
 *  get:
 *      summary: Listado de productos
 *      tags: [Productos]
 *      responses:
 *          200:
 *              description: Muestra la lista de productos
 */ 

// ------------------------------------------------- BUSQUEDA POR ID -----------------------------------------------------

/**
 * @swagger
 * /florerias/{id}:
 *  get:
 *      summary: Detalles de Floreria
 *      tags: [Florerias]
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID de la floreria
 *            required: true
 *      responses:
 *          200:
 *              description: Muestra detalles de floreria
 *          400:
 *              description: Error al mostrar detalles
 */

/**
 * @swagger
 * /productos/{id}:
 *  get:
 *      summary: Detalles de producto
 *      tags: [Productos]
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID del producto
 *            required: true
 *      responses:
 *          200:
 *              description: Muestra detalles del producto
 *          400:
 *              description: Error al mostrar detalles
 */


app.get('/florerias',(req, res) => {
    bd.query('SELECT * FROM florerias', (err, results) => {
        if(err) {
            console.log("Error al ejecutar la consulta")
            return;
        }
        res.json(results)
    })
})

app.get('/productos',(req, res) => {
    bd.query('SELECT * FROM productos', (err, results) => {
        if(err) {
            console.log("Error al ejecutar la consulta")
            return;
        }
        res.json(results)
    })
})

app.get('/florerias/:id',(req, res) => {
    const idFloreria = parseInt(req.params.id)
    bd.query("SELECT * FROM florerias WHERE idFlorerias=?",[idFloreria],(err,results) => {
        if(err) {
            res.status(400).send("Error al obtener la floreria" + err.stack)
            return
        }
        res.json(results)
    })
})

app.get('/productos/:id',(req, res) => {
    const idProducto = parseInt(req.params.id)
    bd.query("SELECT * FROM productos WHERE id_producto=?",[idProducto],(err,results) => {
        if(err) {
            res.status(400).send("Error al obtener el producto" + err.stack)
            return
        }
        res.json(results)
    })
})

// ------------------------------------------------------ GUARDAR POST -----------------------------------------------------------------------

/**
 * @swagger
 * /guardarFloreria:
 *  post:
 *      summary: Crear florerias
 *      tags: [Florerias]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Floreria'
 *      responses:
 *          200: 
 *              description: Guardar nueva floreria
 *          400:
 *              description: Datos incompletos
 */

/**
 * @swagger
 * /guardarProducto:
 *  post:
 *      summary: Crear producto
 *      tags: [Productos]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Producto'
 *      responses:
 *          200: 
 *              description: Guardar nuevo producto
 *          400:
 *              description: Datos incompletos
 */

app.post('/guardarFloreria', (req, res) => {
    const  {nombre, ubicacion, telefono} = req.body    // desconstrucción. obtiene los datos que se pasan como parametros

    // VALIDAR LOS DATOS
    
    if (!nombre || !ubicacion || !telefono) {
        return res.status(400).json({ error: "Todos los campos son obligatorios"});
    }

    // const datos = req.body;
    // console.log(datos)

    bd.query("INSERT INTO florerias(nombre, ubicacion, telefono) VALUES(?,?,?)",[nombre,ubicacion,telefono],
    (err, result) => {
        if(err) {
            res.status(400).send("Error al crear una floreria")
            return;
        }
        res.status(201).send("Floreria creada")
    })
})

app.post('/guardarProducto', (req, res) => {
    const  {nombre, descripcion, precio, foto, floreria, categoria} = req.body    // desconstrucción. obtiene los datos que se pasan como parametros

    // VALIDAR LOS DATOS
    
    if (!nombre || !descripcion || !precio || !foto || !floreria || !categoria ) {
        return res.status(400).json({ error: "Todos los campos son obligatorios"});
    }

    // const datos = req.body;
    // console.log(datos)

    bd.query("INSERT INTO productos(nombre, descripcion, precio, foto, floreria, categoria) VALUES(?,?,?,?,?,?)",[nombre,descripcion,precio,foto,floreria,categoria],
    (err, result) => {
        if(err) {
            res.status(400).send("Error al crear un producto")
            return;
        }
        res.status(201).send("Producto creado")
    })
})

// ---------------------------------------------------- EDITAR POST ---------------------------------------------------------------

/**
 * @swagger
 * /florerias/{id}:
 *  put:
 *      summary: Editar florerias
 *      tags: [Florerias]
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID de la floreria
 *            required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Floreria'
 *      responses:
 *          200: 
 *              description: Guardar nueva floreria
 *          400:
 *              description: No se edita la floreria
 */

/**
 * @swagger
 * /productos/{id}:
 *  put:
 *      summary: Editar productos
 *      tags: [Productos]
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID del producto
 *            required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Producto'
 *      responses:
 *          200: 
 *              description: Guardar nuevo producto
 *          400:
 *              description: No se edita el producto
 */

app.put('/florerias/:id', (req, res) => {
    const {nombre, ubicacion, telefono} = req.body
    const idFloreria = parseInt(req.params.id)
    bd.query("UPDATE florerias SET nombre = ?, ubicacion = ?, telefono = ? WHERE idFlorerias = ?",
        [nombre, ubicacion, telefono, idFloreria],
        (err, result) => {
            if (err) {
                res.status(400).send("Error al editar una floreria.")
                return;
            }
            res.send('Florerias actualizadas.');
        }
    );
});

app.put('/productos/:id', (req, res) => {
    const {nombre, descripcion, precio, foto, floreria, categoria} = req.body
    const idProducto = parseInt(req.params.id)
    bd.query("UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, foto = ?, floreria = ?, categoria = ? WHERE id_producto = ?",
        [nombre, descripcion, precio, foto, floreria, categoria, idProducto],
        (err, result) => {
            if (err) {
                res.status(400).send("Error al editar un producto.")
                return;
            }
            res.send('Productos actualizados.');
        }
    );
});

// ---------------------------------------------------- ELIMINAR DATOS ----------------------------------------------------------------

/**
 * @swagger
 * /florerias/{id}:
 *  delete:
 *      summary: Eliminacion de Floreria
 *      tags: [Florerias]
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID de la floreria
 *            required: true
 *      responses:
 *          200:
 *              description: Elimina una floreria
 *          400:
 *              description: Error al eliminar floreria
 */

/**
 * @swagger
 * /productos/{id}:
 *  delete:
 *      summary: Eliminacion de producto
 *      tags: [Productos]
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID del producto
 *            required: true
 *      responses:
 *          200:
 *              description: Elimina un producto
 *          400:
 *              description: Error al eliminar producto
 */

app.delete('/florerias/:id', (req, res) => {
    const idFloreria = parseInt(req.params.id)
    bd.query("DELETE FROM florerias WHERE idFlorerias = ?", [idFloreria], (err, result) => {
        if (err) {
            res.status(400).send("Error al eliminar floreria")
            return;
        }
        res.send('Floreria eliminada correctamente')
    })
})

app.delete('/productos/:id', (req, res) => {
    const idProducto = parseInt(req.params.id)
    bd.query("DELETE FROM productos WHERE id_producto = ?", [idProducto], (err, result) => {
        if (err) {
            res.status(400).send("Error al eliminar producto")
            return;
        }
        res.send('Producto eliminado correctamente')
    })
})

// ---------------------------------------------------- SUBIR FOTO --------------------------------------------------------------------
app.post('/procesar-foto', carpeta_archivos.single('file'), (req, res) => {
    if(!req.file) {
        return res.status(400).send("No fue posible encontrar la foto")
    }
    res.send("Foto subida correctamente")
})

// ------------------------------------------- CONFIGURAR SWAGGER PARA LA DOC DE LAS API ----------------------------------------------
const swaggerOptions = {
    swaggerDefinition: {
        openapi:'3.1.0',
        info: {
            title:'API de Dreaming Flowers',
            version:'1.0.0',
            description:'API de florerias'
        },
    },
    apis:['*.js'],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/apis-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// HACER DISPONIBLE EL SERVIDOR
app.listen(port, () => {
    console.log("Servidor iniciado")
})