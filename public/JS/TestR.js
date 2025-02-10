// Variables globales para almacenar puntuaciones
let scorePart1 = 0;
let scorePart2 = 0;
let scorePart3 = 0;
let imagenRespuestas = [];

//Test de Rorschach
document.getElementById('StarTest').addEventListener('click', function() {
    const token = localStorage.getItem('token');
    fetch('/checkSession', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Asegúrate de que el token se envíe en el formato correcto
        }
    }).then(response => response.json())
    .then(data => {
        if (data.sesionActiva) {
            Swal.fire({
                icon: 'warning',
                title: 'Sesión en curso',
                text: 'Lo sentimos, ya tienes una sesión en curso, si deseas realizar un nuevo test y crear otra cuenta, por favor cierra sesión primero',
                confirmButtonText: 'Esta bien'
            })
        }else{
            Swal.fire({
                title: 'Test - Primera Parte',
                icon: 'info',
                text: 'Vas a responder a una serie de preguntas basadas en el Test de Rorschach. No hay respuestas correctas o incorrectas, solo queremos entender tus percepciones.',
                confirmButtonText: 'Comenzar',
                footer: 'Piensa bien en tus respuestas, ya que no puedes regresar a una pregunta si ya la contestaste'
            }).then((result) => {
                if (result.isConfirmed) {
                    showQuestion(1);
                }
            });
        }
    })
});

function showQuestion(questionNumber) {
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

    const question = questions[questionNumber - 1];

    Swal.fire({
        title: `Imagen número ${questionNumber}`,
        imageUrl: question.image,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Imagen del test',
        text: question.text,
        input: 'radio',
        inputOptions: question.options.reduce((options, option) => {
            options[option.value] = option.label;
            return options;
        }, {}),
        inputValidator: (value) => {
            if (!value && value !== 0) {
                return 'Debes seleccionar una opción';
            }
        },
        showCancelButton: true,
        confirmButtonText: 'Siguiente',
        cancelButtonText: 'Detener test',
        allowOutsideClick: false,
        customClass: {
            input: 'swal2-input-column', // Clase CSS personalizada para las opciones
        }
    }).then((result) => {
        if (result.isDismissed) {
            Swal.fire({
                title: 'Test Detenido',
                icon: 'warning',
                text: 'Has detenido el test.',
                confirmButtonText: 'OK'
            });
        } else if (result.isConfirmed) {
            // Agregar la respuesta a la variable imagenRespuestas
            const respuesta = {
                image: question.image,
                respuesta: parseInt(result.value)
            };
            imagenRespuestas.push(respuesta);
            
            // Mensaje en consola para confirmar que la respuesta se guardó
            //console.log('Respuesta guardada:', respuesta);
            //1609
            //console.log('Respuestas acumuladas:', imagenRespuestas);
             
            // Sumar la puntuación de la respuesta seleccionada a la puntuación total de la primera parte
            scorePart1 += parseInt(result.value);

            if (questionNumber < questions.length) {
                showQuestion(questionNumber + 1);
            } else {
                Swal.fire({
                    title: 'Primera parte completa',
                    icon: 'success',
                    text: '¡Muy bien, ahora solo falta dos partes más!',
                    confirmButtonText: 'Empezar segunda parte'
                }).then(() => {
                    ST();
                    console.log('Primer Parte completa');
                });
            }
        }
    });
}

//Test de Acoso
function ST() {
    Swal.fire({
        title: 'Test - Segunda Parte',
        icon: 'info',
        text: 'Las preguntas que vas a responder buscan entender tus percepciones y experiencias, es por ello que necesitamos que contestes con toda la sinceridad posible. No hay respuestas correctas o incorrectas, solo tu verdad. Comencemos.',
        showCancelButton: true,
        confirmButtonText: 'Comenzar',
        cancelButtonText: 'Detener test',
        allowOutsideClick: false,
        footer: 'Las preguntas se basan hablando especificamente de la(s) persona(s) con las que presentaste una situacion, piensa bien tus respuestas, ya que no puedes regresar a una pregunta previamente contestada'
    }).then((result) => {
        if (result.isConfirmed) {
            startSecondPart(1);
        }else if (result.dismiss === Swal.DismissReason.cancel) {
            stopTest();
        }
    });
}

function startSecondPart(questionNumber2) {
    const questions = [
        //Acoso verval ----
        { 
            text: 'Te amenazan(aron) verbalmente.', 
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Ninguna vez' } 
            ] 
        },
        { 
            text: 'Hizo(eron) burlas de tu aspecto fisico y/o psicologico.', 
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Ninguna vez' }  
            ] 
        },
        { 
            text: 'Recibes escritos, notas, e-mail, SMS o llamadas amenazadores.', 
            options: [ 
                { value: 6, label: 'Si, muchas veces' }, 
                { value: 4, label: 'Si, algunas veces' }, 
                { value: 2, label: 'Si, pocas veces' }, 
                { value: 0, label: 'Ninguna vez' } 
            ] 
        },
        { 
            text: 'Limitan(aron) las oportunidades de expresarte o de decir lo que tienes que decir.', 
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Ninguna vez' }  
            ] 
        },
        {
            text: 'Te hacen(n) avances, insinuaciones o gestos sexuales',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Ninguna vez' }  
            ] 
        },
        //-------
        //Acoso Social
        { 
            text: 'En general se te ignora y se te trata como si fueras invisible.', 
            options: [ 
                { value: 6, label: 'Siempre' }, 
                { value: 4, label: 'Casi Siempre' }, 
                { value: 2, label: 'Algunas veces' }, 
                { value: 1, label: 'Pocas veces' }, 
                { value: 0, label: 'Nunca' } 
            ] 
        },
        { 
            text: 'Difundio(eron) rumores falsos o infundados sobre ti.', 
            options: [ 
                { value: 4, label: 'Si' }, 
                { value: 0, label: 'No' } 
            ] 
        },
        { 
            text: 'Imita(n) tu forma de andar, tu voz o tus gestos para ponerte en ridículo.', 
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Ninguna vez' }  
            ] 
        },
        {
            text: 'Ridiculiza(n) o se burla(n) de tu vida privada.',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Ninguna vez' }  
            ] 
        },
        {
            text: 'Trato(aron) que la gente ha dejará de relacionarse contigo.',
            options: [ 
                { value: 4, label: 'Si' }, 
                { value: 0, label: 'No' }  
            ] 
        },
        //-----
        //Acoso fisico
        {
            text: 'Las personas que te apoyan son o fueron amenazadas.',
            options: [ 
                { value: 6, label: 'Si' }, 
                { value: 0, label: 'No' }  
            ] 
        },
        {
            text: 'Te sustrae(n) algunas de tus pertenencias.',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Ninguna vez' }  
            ] 
        },
        {
            text: 'Recibes o recibiste ataques físicos leves como advertencia y/o amenaza.',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Ninguna vez' }  
            ] 
        },
        {
            text: 'Recibes agresiones físicas (golpes o agreciones sexuales) directas y sin consideración.',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Ninguna vez' }  
            ] 
        },
        {
            text: 'se dirige(n) a ti con insultos o comentarios obscenos o degradantes.',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Ninguna vez' }  
            ] 
        }
        // Agrega más preguntas según sea necesario
    ];

    const question = questions[questionNumber2 - 1];

    Swal.fire({
        title: `Pregunta ${questionNumber2}`,
        text: question.text,
        input: 'radio',
        inputOptions: question.options.reduce((options, option) => {
            options[option.value] = option.label;
            return options;
        }, {}),
        inputValidator: (value) => {
            if (!value && value !== 0) {
                return 'Debes seleccionar una opción';
            }
        },
        showCancelButton: true,
        confirmButtonText: 'Siguiente',
        cancelButtonText: 'Detener test',
        allowOutsideClick: false,
        customClass: {
            input: 'swal2-input-column', // Clase CSS personalizada para las opciones
        }
    }).then((result) => {
        if (result.isDismissed) {
            Swal.fire({
                title: 'Test Detenido',
                icon: 'warning',
                text: 'Has detenido el test.',
                confirmButtonText: 'OK'
            });
        } else if (result.isConfirmed) {
            // Sumar la puntuación de la respuesta seleccionada a la puntuación total de la segunda parte
            scorePart2 += parseInt(result.value);

            if (questionNumber2 < questions.length) {
                startSecondPart(questionNumber2 + 1);
            } else {
                Swal.fire({
                    title: 'Segunda parte completa',
                    icon: 'success',
                    text: '¡Muy bien, ahora solo falta una parte!',
                    confirmButtonText: 'Empezar tercera parte'
                }).then(() => {
                    ST2();
                    console.log('Segunda Parte completa');
                });
            }
        }
    });
}

//Test de Víolencia de género
function ST2(){
    Swal.fire({
        title: 'Test - Tercera Parte',
        icon: 'info',
        text: 'Esta es la última parte. Sabemos que responder preguntas sobre tus vivencias no es fácil, pero es un paso valiente hacia tu bienestar. Al completar este test, estás avanzando hacia la comprensión y la sanación. No estás solo/a; estamos aquí para apoyarte. Gracias por tu coraje y confianza.',
        showCancelButton: true,
        confirmButtonText: 'Comenzar',
        cancelButtonText: 'Detener test',
        allowOutsideClick: false,
        footer: 'Las preguntas se basan hablando especificamente de la(s) persona(s) con las que presentaste una situacion, piensa bien tus respuestas, ya que no puedes regresar a una pregunta previamente contestada'
    }).then((result) => {
        if (result.isConfirmed) {
            startThirdPart(1);
        }else if (result.dismiss === Swal.DismissReason.cancel) {
            stopTest();
        }
    });
}

function startThirdPart(questionNumber3){
    const questions2 = [
        { 
            text: '¿Alguna vez te han hecho sentir miedo o inseguridad debido a tu género?',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Nunca' } 
            ]
        },
        { 
            text: '¿Alguna vez has recibido avances, insinuaciones o gestos sexuales no deseados?', 
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Nunca' } 
            ] 
        },
        {
            text: '¿Alguna vez dieron por hecho que no podias realizar alguna tarea debido a tu género?',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Nunca' } 
            ] 
        },
        {
            text:'¿Alguna vez han limitado tu opinión acerca de un tema debido a tu género?',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Nunca' } 
            ]
        },
        {
            text: '¿Alguna vez han usado esteretipos de género denigrantes cuando realizas algo',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Nunca' } 
            ]
        },
        {
            text: '¿Alguna vez te han hecho sentir que no tienes valor o que no eres importante debido a tu género?',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Nunca' } 
            ]
        },
        {
            text: '¿Alguna vez te han forzado a hacer algo ya que "tu debes saber eso por ser ..." ?',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Nunca' } 
            ]
        },
        {
            text: '¿Alguna vez te han amenazado con violencia física debido a tu género?',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Nunca' } 
            ]
        },
        {
            text: '¿Alguna vez te han tratado injustamente en el trabajo o en la escuela debido a tu género?',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Nunca' } 
            ]
        },
        {
            text: '¿Alguna vez alguien con un rango de autoridad más alto te han excluido o ignorado debido a tu género?',
            options: [ 
                { value: 6, label: 'Muchas veces' }, 
                { value: 4, label: 'Algunas veces' }, 
                { value: 2, label: 'Pocas veces' }, 
                { value: 0, label: 'Nunca' } 
            ]
        }
        // Agrega más preguntas según sea necesario
    ];

    const question = questions2[questionNumber3 - 1];

    Swal.fire({
        title: `Pregunta ${questionNumber3}`,
        text: question.text,
        input: 'radio',
        inputOptions: question.options.reduce((options, option) => {
            options[option.value] = option.label;
            return options;
        }, {}),
        inputValidator: (value) => {
            if (!value && value !== 0) {
                return 'Debes seleccionar una opción';
            }
        },
        showCancelButton: true,
        confirmButtonText: 'Siguiente',
        cancelButtonText: 'Detener test',
        allowOutsideClick: false,
        customClass: {
            input: 'swal2-input-column', // Clase CSS personalizada para las opciones
        }
    }).then((result) => {
        if (result.isDismissed) {
            Swal.fire({
                title: 'Test Detenido',
                icon: 'warning',
                text: 'Has detenido el test.',
                confirmButtonText: 'OK'
            });
        } else if (result.isConfirmed) {
            // Sumar la puntuación de la respuesta seleccionada a la puntuación total de la tercera parte
            scorePart3 += parseInt(result.value);
    
            if (questionNumber3 < questions2.length) {
                startThirdPart(questionNumber3 + 1);
            } else {
                // Aquí calculamos el total de las tres partes
                const totalScore = scorePart1 + scorePart2 + scorePart3;
                
                // Obtener la leyenda de distorsión basada en la puntuación de la primera parte
                const distortionLevel = getDistortionLevel(scorePart1);
                // Obtener la leyenda de acoso basada en la puntuación de la segunda parte
                const harassmentLevel = getHarassmentLevel(scorePart2);
                // Obtener la leyenda de violencia de género basada en la puntuación de la tercera parte
                const genderViolenceLevel = getGenderViolenceLevel(scorePart3);

                // Determinar tipos de usuario
                let userTypes = [];
                if (scorePart2 >= 26 && scorePart2 <= 56) {
                    userTypes.push('1');
                } else if (scorePart2 >= 57) {
                    userTypes.push('2');
                }
                if (scorePart3 >= 21 && scorePart3 <= 40) {
                    userTypes.push('3');
                } else if (scorePart3 >= 41) {
                    userTypes.push('4');
                }
                let message = `¡Lo has logrado! Has completado nuestro test. Según tus resultados:
                            hemos determinado que ${distortionLevel}, además 
                            se estableció que ${harassmentLevel} y por ultimo se llego a la conclución de que ${genderViolenceLevel}`;
                // Verificar si scorePart2 >= 26 o scorePart3 >= 21
                if (scorePart2 >= 26 || scorePart3 >= 21) {
                    Swal.fire({
                        title: 'Test Completo',
                        icon: 'success',
                        text: message,
                        confirmButtonText: 'Para obtener ayuda regístrate'
                    }).then((result) => {
                        showRegisterForm('', userTypes); // Mostrar formulario de registro
                        console.log('Tercer Parte completa');
                    });
                } else {
                    Swal.fire({
                        title: 'Test Completo',
                        icon: 'success',
                        text: message,
                        confirmButtonText: 'OK'
                    });
                }
            }
        }
    });
}    
function showRegisterForm(errorMessage = '', userTypes = []) {
    Swal.fire({
        title: 'Registro',
        html: `
            <input type="text" id="username" class="swal2-input" placeholder="Nombre de usuario" required>
            <input type="number" id="age" class="swal2-input" placeholder="Edad (opcional)" min="12" max="100" value="18">

            <div class="password-container">
                <input type="password" id="password" class="swal2-input" placeholder="Contraseña" required>
                <i id="togglePassword" class="fa fa-eye"></i>
            </div>
            <div id="passwordRequirements" style="text-align: left; font-size: 0.9em; color: gray;">
                La contraseña debe tener mínimo 8 caracteres, al menos una letra mayúscula y un número.
            </div>
            <div id="errorMessage" style="text-align: left; font-size: 0.9em; color: red;">
                ${errorMessage}
            </div>
        `,
        confirmButtonText: 'Registrarse',
        focusConfirm: false,
        didOpen: () => {
            const togglePassword = document.querySelector('#togglePassword');
            const password = document.querySelector('#password');
            togglePassword.addEventListener('click', () => {
                const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);
                togglePassword.classList.toggle('fa-eye-slash');
            });
        },
        preConfirm: () => {
            const username = Swal.getPopup().querySelector('#username').value;
            let age = Swal.getPopup().querySelector('#age').value;
            const password = Swal.getPopup().querySelector('#password').value;

            age = parseInt(age);

            if (age < 12 || age > 100) {
                Swal.showValidationMessage('La edad debe estar entre 12 y 100 años');
                return false;
            }

            if (!username || !password) {
                Swal.showValidationMessage('Debes llenar los campos requeridos');
                return false;
            } else if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d .;:_\-]{8,}$/.test(password)) {
                Swal.showValidationMessage('La contraseña no cumple con los requisitos');
                return false;
            }

            return { username, age, password, userTypes };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { username, age, password, userTypes } = result.value;

            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, age, password, userTypes })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    Swal.fire({
                        title: 'Registro Exitoso',
                        icon: 'success',
                        text: 'Tu cuenta ha sido creada exitosamente',
                        confirmButtonText: 'Ver contenido multimedia'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log("Vamos a empezar con subir resultados")
                            subirResultadosTest().then(() => {
                                window.location.href = '/menuP';
                            }).catch(error => {
                                console.error('Error al subir los resultados del test:', error);
                                // Manejar el error si es necesario
                            });
                        }
                    });
                } else if (data.message === 'El nombre de usuario ya está en uso') {
                    showRegisterForm('El nombre de usuario ya está en uso. Por favor, elige otro.', userTypes);
                } else {
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: 'Hubo un error al registrar la cuenta. Intenta de nuevo.',
                        confirmButtonText: 'OK'
                    });
                }
            })
            .catch(error => {
                console.error('Error al registrar:', error);
                Swal.fire({
                    title: 'Error de Red',
                    icon: 'error',
                    text: 'Hubo un problema con la conexión. Intenta de nuevo más tarde.',
                    confirmButtonText: 'OK'
                });
            });
        }
    });
}

// Función para crear archivo de texto
function subirResultadosTest() {
    return new Promise((resolve, reject) => {
        // Obtener el nombre de usuario desde el Backend
        fetch('/username', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Asegúrate de que esto esté bien definido
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const nombreUsuario = data.username; // Aquí tienes el nombre del usuario
                
                // Una vez que tienes el nombre de usuario, puedes enviar los resultados del test
                let puntacion1 = imagenRespuestas; // Asegúrate de que `imagenRespuestas` esté definida correctamente
                const puntuacion2 = scorePart2; 
                const puntuacion3 = scorePart3; 

                // Enviar los datos al Backend junto con el nombre del usuario
                fetch('/save-test-results', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Asegúrate de que el token esté almacenado en localStorage o donde lo estés guardando
                    },
                    body: JSON.stringify({
                        nombreUsuario, 
                        puntacion1, 
                        puntuacion2, 
                        puntuacion3
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Resultados del test guardados con éxito');
                        resolve(); // Resuelve la promesa cuando los resultados se guardan correctamente
                    } else {
                        console.error('Error al guardar los resultados del test:', data.message);
                        reject(new Error(data.message)); // Rechaza la promesa con el mensaje de error
                    }
                })
                .catch(error => {
                    console.error('Error en la solicitud:', error);
                    reject(error); // Rechaza la promesa en caso de error de red
                });

            } else {
                console.error('Error al obtener el nombre de usuario:', data.message);
                reject(new Error(data.message)); // Rechaza la promesa si hay un error al obtener el nombre del usuario
            }
        })
        .catch(error => {
            console.error('Error al obtener el nombre de usuario:', error);
            reject(error); // Rechaza la promesa en caso de error de red
        });
    });
}


// Función para obtener el nivel de distorsión basado en la puntuación del test de Rorschach
function getDistortionLevel(score) {
    if (score >= 6 && score <= 11) {
        return 'no presentas transtornos en tu personalidad';
    } else if (score >= 12 && score <= 17) {
        return 'podrías presentar algunos transtornos en tu personalidad';
    } else if (score >= 18) {
        return 'presentas transtornos graves en tu personalidad';
    } else {
        return 'Puntuación fuera de rango'; // En caso de que haya un error en la puntuación
    }
}
// Función para obtener el nivel de acoso basado en la puntuación de la segunda parte
function getHarassmentLevel(score2) {
    if (score2 >= 0 && score2 <= 25) {
        return ' no presentas signos de acoso (ya sea verbal, social o fisico) ';
    } else if (score2 >= 26 && score2 <= 56) {
        return ' presentas signos de sufrir acoso (de leve a moderado) ';
    } else if (score2 >= 57) {
        return ' has sido víctima de acoso (de moderado a grave) ';
    } else {
        return 'Puntuación fuera de rango'; // En caso de que haya un error en la puntuación
    }
}
// Función para obtener el nivel de violencia de género basado en la puntuación de la tercera parte
function getGenderViolenceLevel(score3) {
    if (score3 >= 0 && score3 <= 20) {
        return ' no presentas signos de violencia de género ';
    } else if (score3 >= 21 && score3 <= 40) {
        return ' tu experiencia presenta algunos signos de violencia de género ';
    } else if (score3 >= 41) {
        return ' fuiste victima de violencia de género ';
    } else {
        return 'Puntuación fuera de rango'; // En caso de que haya un error en la puntuación
    }
}

function stopTest() {
    Swal.fire({
        title: 'Test Detenido',
        icon: 'warning',
        text: 'Recuerda que para obtener acceso a nuestro contenido debes de completar el test al 100%, sin embargo si aun no te sientes preparad@ esta bien, seguiremos aqui hasta que estes list@',
        confirmButtonText: 'Regresar'
    });
}

