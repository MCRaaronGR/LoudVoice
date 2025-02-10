const express = require('express');
const aplicacion = express();
const mongoosee = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User'); // Importa el modelo de usuario desde User.js
const Video = require('./models/Videos'); //Importa el modelo de videos desde Videos.js
const TestResult = require('./models/TestResults'); //Importar el modelo de resultados desde TestResults.js
const Experiencia = require('./models/Experiencia'); //Importar el modelo de experiencia desde Experiencia.js
const Envio = require('./models/EnvioC');
const bcrypt = require('bcrypt');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
require('dotenv').config();

const puerto = 3003;

// Configuración de Express
aplicacion.use(bodyParser.json());
aplicacion.set('view engine', 'ejs');
aplicacion.set('views', path.join(__dirname, 'views'));
aplicacion.use(express.static(path.join(__dirname, 'public')));

// Servir archivos de video desde la carpeta "videos"
aplicacion.use('/videos', express.static(path.join(__dirname, 'videos')));

// Rutas
aplicacion.use('/', require('./router/RutasP'));
aplicacion.use('/regions', require('./router/regions'));

// Elemento del puerto
aplicacion.listen(puerto, () => {
    console.log(`Servidor en línea, puerto ${puerto}`);
});

// Conexión a DB
mongoosee.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a la DB'))
    .catch((error) => console.log('Error de conexión:', error));

// Middleware para verificar el token JWT
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ success: false, message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1]; // Extrae el token del formato "Bearer token"
    if (!token) {
        return res.status(403).json({ success: false, message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token inválido' });
        }
        req.userId = decoded.id;
        next();
    });
}

// Configuración de Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'videos'); // Carpeta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Usar el nombre original del archivo
    }
});

// Ruta para registrar usuarios
aplicacion.post('/register', async (req, res) => {
    const { username, age, password, userTypes } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El nombre de usuario ya está en uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            age,
            password: hashedPassword,
            userTypes
        });

        await newUser.save();
        console.log('Usuario registrado');

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error('Error al guardar el usuario:', error);
        res.status(500).json({ success: false, message: 'Error al guardar el usuario' });
    }
});

// Ruta para iniciar sesión
aplicacion.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.status(200).json({ success: true, token });
            console.log('Sesión iniciada', username);
        } else {
            res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        res.status(500).json({ success: false, message: 'Error en inicio de sesión' });
    }
});

// Ruta para cerrar sesión
aplicacion.post('/logout', verifyToken, (req, res) => {
    // Aquí puedes invalidar el token si tienes una lista de tokens válidos
    console.log('Sesión cerrada con éxito');
    res.json({ loggedOut: true });
});

// Ruta para checar estado de la sesión
aplicacion.get('/checkSession', verifyToken, (req, res) => {
    res.json({ sesionActiva: true });
});

// Ruta para obtener videos según el tipo de usuario
aplicacion.get('/videos', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        const userTypes = user.userTypes;

        const videos = await Video.aggregate([
            { $match: { userTypes: { $in: userTypes } } },
            { $sample: { size: 2 } } // Cambia 10 por el número de videos que quieres obtener
        ]);
        res.status(200).json({ success: true, videos });
    } catch (error) {
        console.error('Error al obtener videos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener videos' });
    }
});

const upload = multer({ storage: storage });

// Ruta para subir el archivo de video
aplicacion.post('/upload-video', upload.single('videoFile'), (req, res) => {
    if (req.file) {
        res.status(200).json({ success: true, fileName: req.file.filename });
    } else {
        res.status(400).json({ success: false, message: 'No se recibió ningún archivo.' });
    }
});

// Ruta para agregar video con userTypes del usuario activo
aplicacion.post('/add-video', verifyToken, async (req, res) => {
    const { title, fileName } = req.body;

    try {
        // Busca el usuario activo en la base de datos
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Obtén los userTypes del usuario activo
        const userTypes = user.userTypes;

        // Crea un nuevo video con el título, nombre de archivo y userTypes del usuario
        const newVideo = new Video({
            title,
            localPath: fileName,
            userTypes: userTypes
        });

        await newVideo.save();
        console.log('Video guardado:', title);
        res.status(201).json({ success: true, video: newVideo });
    } catch (error) {
        console.error('Error al guardar el video:', error);
        res.status(500).json({ success: false, message: 'Error al guardar el video' });
    }
});

// Ruta para obtener el nombre del usuario
aplicacion.get('/username', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.status(200).json({ success: true, username: user.username });
    } catch (error) {
        console.error('Error al obtener el nombre del usuario:', error);
        res.status(500).json({ success: false, message: 'Error al obtener el nombre del usuario' });
    }
});

//Guardar resultados de test
aplicacion.post('/save-test-results', verifyToken, async (req, res) => {
    const { nombreUsuario, puntacion1, puntuacion2, puntuacion3 } = req.body;

    // Obtén la fecha actual para el nombre del archivo
    const fechaActual = new Date().toISOString().replace(/:/g, '-'); // Formato: YYYY-MM-DDTHH-MM-SS
    const nombreArchivo = `resultados_test_${nombreUsuario}.txt`;
    const rutaArchivo = path.join(__dirname, 'test-results', nombreArchivo);

    // Contenido del archivo
    const contenido = `
Resultados del Test:
Fecha: ${fechaActual}

Imagen Respuestas:
${JSON.stringify(puntacion1, null, 2)}

Puntuaciones Parte 2:
${JSON.stringify(puntuacion2, null, 2)}

Puntuaciones Parte 3:
${JSON.stringify(puntuacion3, null, 2)}
`;

    try {
        // Escribir el archivo
        await fs.promises.writeFile(rutaArchivo, contenido);

        // Leer el contenido del archivo
        const archivoContenido = await fs.promises.readFile(rutaArchivo, 'utf8');

        // Parsear el contenido del archivo
        const [header, ...sections] = archivoContenido.split('\n\n');
        const imagenRespuestas = JSON.parse(sections[0].replace('Imagen Respuestas:\n', ''));
        const puntuacionesParte2 = JSON.parse(sections[1].replace('Puntuaciones Parte 2:\n', ''));
        const puntuacionesParte3 = JSON.parse(sections[2].replace('Puntuaciones Parte 3:\n', ''));

        // Encontrar el ID del usuario basado en el nombre de usuario
        const user = await User.findOne({ username: nombreUsuario });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Guardar los resultados del test en la base de datos
        const testResults = {
            userId: user._id, // Referencia al ID del usuario
            imagenRespuestas,
            puntuacionesParte2,
            puntuacionesParte3
        };

        const newTestResult = new TestResult(testResults);
        await newTestResult.save();

        // Eliminar el archivo de texto después de subirlo a la base de datos
        await fs.promises.unlink(rutaArchivo);

        res.status(200).json({ success: true, message: 'Resultados del test guardados en la base de datos y archivo eliminado' });
    } catch (error) {
        console.error('Error al procesar los resultados del test:', error);
        res.status(500).json({ success: false, message: 'Error al procesar los resultados del test' });
    }
});


// Define las preguntas del test con sus opciones
const questions = [
    { 
        image: '/Img/imgR1.jpg', 
        text: '¿Qué ves aquí?', 
        options: [ 
            { value: 1, label: 'Una mariposa' },
            { value: 4, label: 'Un lobo' }, 
            { value: 2, label: 'Un murciélago' } 
        ] 
    },
    { 
        image: '/Img/imgR2.jpg', 
        text: '¿Qué ves aquí?', 
        options: [ 
            { value: 1, label: 'Dos personas' }, 
            { value: 2, label: 'Payasos' }, 
            { value: 3, label: 'Pintura' } 
        ] 
    },
    { 
        image: '/Img/imgR3.jpg', 
        text: '¿Qué ves aquí?', 
        options: [ 
            { value: 1, label: 'Dos caramelos' }, 
            { value: 4, label: 'Alas' }, 
            { value: 2, label: 'Dos hombres' } 
        ] 
    },
    { 
        image: '/Img/imgR4.jpg', 
        text: '¿Qué ves aquí?', 
        options: [ 
            { value: 4, label: 'Un monstruo' }, 
            { value: 3, label: 'Un oso' }, 
            { value: 1, label: 'Un hombre' } 
        ] 
    },
    { 
        image: '/Img/imgR5.jpg', 
        text: '¿Qué ves aquí?', 
        options: [ 
            { value: 2, label: 'Un camaleón' }, 
            { value: 1, label: 'Un gato' }, 
            { value: 3, label: 'La espalda de una persona' } 
        ] 
    },
    { 
        image: '/Img/imgR6.jpg', 
        text: '¿Qué ves aquí?', 
        options: [ 
            { value: 1, label: 'Fuego' }, 
            { value: 3, label: 'La torre Eiffel' }, 
            { value: 4, label: 'Una vagina' } 
        ] 
    }
    // Agrega más preguntas según sea necesario
];

// Función para obtener la interpretación de la respuesta
const obtenerInterpretacion = (imagen, puntuacion) => {
    const pregunta = questions.find(q => q.image === imagen);
    if (pregunta) {
        const opcion = pregunta.options.find(o => o.value === puntuacion);
        return opcion ? opcion.label : 'Interpretación desconocida';
    }
    return 'Pregunta no encontrada';
};

// Función para generar el PDF
const generarPDF = async (resultadoTest, filePath, username, experiencia) => {
    const doc = new PDFDocument({
        size: 'A4',           // Establece el tamaño de la página a A4
        margins: {            // Define los márgenes
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }
    });

    //Crear el flujo de escritura del PDF
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Portada del documento
    const portadaImagePath = path.join(__dirname, 'public', 'Img', 'imagen1.png');
    if (fs.existsSync(portadaImagePath)) {
        doc.image(portadaImagePath, {
            fit: [150, 150],   // Ajusta el tamaño de la imagen según sea necesario
            x: 50,             // Posición horizontal (izquierda)
            y: 50              // Posición vertical (arriba)
        });
    }
    // Inserta el texto "LOUDVOICE" a la derecha de la imagen
    doc.font('Times-Bold').fontSize(24).text('LOUDVOICE ', 210, 75); // Ajusta las coordenadas 'x' e 'y' para posicionar el texto justo a la derecha de la imagen
    doc.font('Times-Italic').fontSize(20).text('Resultados del Test de deteccion de acoso y violencia de género', 210, 95);
    doc.font('Times-Roman').fontSize(16).text(`Nombre de usuario: ${username}`, 210, 140, { underline: true });
    doc.font('Times-Bold').fontSize(12).text(`Fecha de generación del expediente: ${new Date().toLocaleDateString()}`, 210, 160);

    // Construye la ruta absoluta de la imagen
    const imagesDir = path.join(__dirname, 'public', 'Img'); // Carpeta de imágenes
    //Informión relevante
    doc.font('Times-Bold').fontSize(18).text('A quien corresponda ...', 50, 200);
    doc.font('Times-Roman').fontSize(15).text(`Este documento contiene los resultados detallados del test que ha realizado el usuario  ${username}. A través de un análisis exhaustivo de las opciones contestadas, hemos podido identificar y clasificar aspectos clave  que determinan el resultado aquí escrito. La información aquí presentada ha sido organizada en secciones para facilitar su lectura y comprensión. `, { align: 'justify' });
    doc.moveDown(0.7);
    doc.font('Times-Roman').fontSize(15).text(`El propósito de este documento es proporcionar una visión clara y estructurada de los resultados del usuario, y que de esta manera, dichos resultados puedan ser utilizados como una herramienta para tratar de una mejor manera su situación promoviendo una toma de decisiones que promuevan el bienestar y seguridad del usuario.`, { align: 'justify' });
    doc.moveDown(0.7);
    doc.font('Times-Roman').fontSize(15).text('A continuación, encontrarás las secciones detalladas:', 50);
    doc.font('Times-Roman').fontSize(15).text('     1.- TEST DE RORSCHACH: Una revisión de las imágenes presentadas durante el test (correspondientes al test de Rorschach), junto con tus respuestas y la puntuacion estimada correspondiente.', { align: 'justify' });
    doc.font('Times-Roman').fontSize(15).text('     2.- PUNTUACIONES: Un desglose de las puntuaciones obtenidas en las dos partes restantes del test, con explicaciones que ayudan a entender el significado de estos resultados.', { align: 'justify' });
    doc.font('Times-Roman').fontSize(15).text('     3.- EXPERIENCIA DEL USUARIO: Si el usuario ha tomado la decidión de relatar algunos elementos o su experiencia completa, esta estará en esta parte del expediente.', { align: 'justify' });
    doc.moveDown(0.7);
    doc.font('Times-Roman').fontSize(15).text('Se recomienda un analizis de esta información además de discreción para manejar la misma. Todo lo anterior puede significar un parteaguas para continuar con el proceso de autoconocimiento y desarrollo personal de la víctima. LOUDVOICE está aquí para apoyar el camino de cada víctima que desee usar nuestra plataforma.', { align: 'justify' });
    doc.addPage(); // Añade una nueva página 
    // Primera parte: Imágenes y respuestas
    doc.font('Times-Bold').fontSize(18).text('Parte 1: Imágenes y Respuestas del test de Rorschach');
    doc.font('Times-Roman').fontSize(15).text('Se seleccionarón 6 de las 10 manchas de tinta que conforman la técnica y método proyectivo de psicodiagnóstico "prueba de Rorschach", cómo respuestas se utilizarón las 3 respuestas más contestadas por los usuarios de todo el mundo que han realizado esta prueba, cada respuesta con un punto a especificar y una puntuación adjunta con la cual se determina el funcionamiento psíquico de la persona', { align: 'justify' });

    const contentHeight = 250;
    for (const item of resultadoTest.imagenRespuestas) {
        const imgPath = path.join(imagesDir, path.basename(item.image)); // Usa el nombre del archivo de imagen
        if (fs.existsSync(imgPath)) { // Verifica si el archivo existe
            doc.moveDown(1);
            doc.image(imgPath, { fit: [460, 250], align: 'center', valign: 'center' });
            doc.y += 250;  // Altura de la imagen (ajusta según sea necesario)
            doc.moveDown(0.5);
        } else {
            doc.text(`Imagen no encontrada: ${item.image}`);
        }
        doc.fontSize(11).text(`Interpretación dada por el usuario: ${obtenerInterpretacion(item.image, item.respuesta)}`);
        doc.fontSize(11).text(`Puntuación asignada: ${item.respuesta}`);
        doc.moveDown(1);
        if (doc.y + contentHeight > doc.page.height - 50) {
            doc.addPage(); // Añade una nueva página si no hay suficiente espacio
        }

    }
    // Segunda parte: Puntuaciones y explicaciones
    doc.font('Times-Roman').fontSize(18).text('Parte 2: Puntuaciones', { underline: true });
    doc.moveDown();
    doc.font('Times-Bold').fontSize(16).text(`Puntuación Parte 2: ${resultadoTest.puntuacionesParte2}`);
    doc.font('Times-Roman').fontSize(15).text('El nivel de acoso se determina con base en la puntuación obtenida en una parte del test, y los resultados se agrupan en tres categorías:', 50);
    doc.font('Times-Bold').fontSize(15).text('1.- Puntuación de 0 a 25: No presentas signos de acoso', 50);
    doc.font('Times-Roman').fontSize(15).text('Si tu puntuación está en este rango, significa que no se detectan signos de haber sufrido acoso, ya sea de tipo verbal, social o físico. Esto sugiere que no has estado expuesto a situaciones significativas de acoso', 50);
    doc.font('Times-Bold').fontSize(15).text('2.- Puntuación de 26 a 56: Presentas signos de acoso leve a moderado', 50);
    doc.font('Times-Roman').fontSize(15).text('En este rango, los resultados indican que podrías haber experimentado algunas formas de acoso, que van desde incidentes leves hasta situaciones de acoso moderado. Es posible que hayas estado expuesto a conductas de acoso, pero no en un nivel grave o prolongado.', 50);
    doc.font('Times-Bold').fontSize(15).text('3.- Puntuación de 57 en adelante: Has sido víctima de acoso moderado a grave', 50);
    doc.font('Times-Roman').fontSize(15).text('Si tu puntuación es mayor a 56, el test sugiere que has sido víctima de acoso de manera moderada o grave. Esto indica que podrías haber enfrentado situaciones continuas y serias de acoso en tu entorno.', 50);
    doc.moveDown();

    // Tercera parte: Puntuaciones y explicaciones
    doc.addPage();
    doc.font('Times-Roman').fontSize(18).text('Parte 3: Puntuaciones', { underline: true });
    doc.moveDown();
    doc.font('Times-Bold').fontSize(16).text(`Puntuación Parte 3: ${resultadoTest.puntuacionesParte3}`);
    doc.font('Times-Roman').fontSize(15).text('El nivel de violencia de género también se clasifica en tres categorías, según la puntuación obtenida:', 50);
    doc.font('Times-Bold').fontSize(15).text('1.- Puntuación de 0 a 20: No presentas signos de violencia de género', 50);
    doc.font('Times-Roman').fontSize(15).text('Si te encuentras en este rango, no se identifican signos de violencia de género en tu experiencia. Esto sugiere que no has enfrentado situaciones de abuso o violencia relacionados con tu género.', 50);
    doc.font('Times-Bold').fontSize(15).text('2.- Puntuación de 21 a 40: Tu experiencia presenta algunos signos de violencia de género', 50);
    doc.font('Times-Roman').fontSize(15).text('Un puntaje en este rango indica que podrías haber experimentado situaciones que presentan características de violencia de género, aunque de forma menos severa. Es posible que haya habido indicios o episodios esporádicos de este tipo de violencia.', 50);
    doc.font('Times-Bold').fontSize(15).text('3.- Puntuación de 41 en adelante: Has sido víctima de violencia de género', 50);
    doc.font('Times-Roman').fontSize(15).text('Si tu puntuación supera los 40 puntos, los resultados indican que has sido víctima de violencia de género, ya sea emocional, física, o de otro tipo. Este puntaje refleja que tu experiencia está claramente marcada por abusos relacionados con tu identidad de género.', 50);

    // Parte 4: Experiencia del Usuario
    doc.addPage();
    doc.fontSize(16).text('Parte 4: Experiencia del Usuario', { underline: true });
    doc.moveDown();
    
    if (experiencia) {
        doc.fontSize(14).text(`El usuario dice: ${experiencia}`);
    } else {
        doc.fontSize(14).text('Actualmente el usuario no tiene ninguna experiencia guardada');
    }

    // Finalizar el documento
    doc.end();

    // Esperar a que el archivo sea completamente escrito
    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
            console.log('Archivo PDF generado correctamente.');
            resolve();
        });

        writeStream.on('error', (error) => {
            console.error('Error al escribir el archivo PDF:', error);
            reject(error);
        });
    });
};

// Ruta para generar el PDF
aplicacion.post('/api/generar-pdf', async (req, res) => {
    try {
        const { username } = req.body;

        // Buscar el usuario por nombre de usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Buscar los resultados del test usando el ID del usuario
        const resultadoTest = await TestResult.findOne({ userId: user._id });
        if (!resultadoTest) {
            return res.status(404).json({ success: false, message: 'Resultados del test no encontrados' });
        }
        // Buscar la experiencia del usuario
        const experiencia = await Experiencia.findOne({ userId: user._id });

        const fileName = `resultado_test_${username}.pdf`;
        const filePath = path.join(__dirname, 'pdfs', fileName);

        // Generar el PDF
        await generarPDF(resultadoTest, filePath, username, experiencia ? experiencia.experiencia : null);

        // Enviar el PDF por correo
        const envioRecord = await Envio.findOne({ userId: user._id });
        if (!envioRecord || !envioRecord.correoEnviado) {
            await enviarPDFPorCorreo(username, filePath);
            if(!envioRecord) {
                await new Envio({ userId: user._id, correoEnviado: true }).save(); 
            } else{
                envioRecord.correoEnviado = true;
                await envioRecord.save();
            }
        }
       

        // Enviar el archivo PDF como respuesta
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error al enviar el archivo PDF:', err);
                res.status(500).json({ success: false, message: 'Error al enviar el archivo PDF' });
            } else {
                // Eliminar el archivo después de enviarlo
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error al eliminar el archivo PDF:', err);
                });
            }
        });
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).json({ success: false, message: 'Error al generar el PDF' });
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail', // Se puede cambiar el servicio que se use 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Función para enviar el PDF por correo
const enviarPDFPorCorreo = async (username, filePath) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.DESTINATARIO, // Email fijo del destinatario
        subject: `Resultados del Test para ${username}`,
        text: `Hola,\n\nAdjunto encontrarás el archivo PDF con los resultados del test de ${username}.\n\nSaludos,\nEquipo de LOUDVOICES`,
        attachments: [
            {
                filename: path.basename(filePath),
                path: filePath,
            },
        ],
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
};

// Guardar la experiencia de la victima en la DB
aplicacion.post('/guardar-experiencia', async (req, res) => {
    try {
        // Verificar el token JWT
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(401).json({ mensaje: 'Token de autenticación no proporcionado.' });

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        const { experiencia } = req.body;

        // Buscar si ya existe una experiencia para el usuario
        const experienciaGuardada = await Experiencia.findOne({ userId });

        if (experienciaGuardada) {
            // Si ya existe, actualiza el registro con la nueva experiencia
            experienciaGuardada.experiencia = experiencia;
            experienciaGuardada.fecha = new Date(); // Actualiza la fecha
            await experienciaGuardada.save();
            res.status(200).json({ mensaje: 'Experiencia actualizada con éxito.' });
        } else {
            // Si no existe, crea un nuevo registro
            const nuevaExperiencia = new Experiencia({
                userId,
                experiencia,
                fecha: new Date() // Guarda la fecha actual
            });
            await nuevaExperiencia.save();
            res.status(201).json({ mensaje: 'Experiencia guardada con éxito.' });
        }
    } catch (error) {
        console.log('Parece que hubo un error al guardar la experiencia, o esta estaba vacia');
        res.status(500).json({ mensaje: 'Hubo un error al guardar la experiencia.' });
    }
});

//Consultar si ya hay una experiencia previa guardada
aplicacion.get('/mis-experiencias', verifyToken, async (req, res) => {
    try {
        const userId = req.userId; // Obtenido desde el token JWT
        const experiencias = await Experiencia.find({ userId });

        res.status(200).json(experiencias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las experiencias.' });
    }
});