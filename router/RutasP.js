const express = require('express');
const router = express.Router();

router.get('/', (req, resp) => {
    resp.render('paginainicio');
});

router.get('/home', (req, resp) => {
    resp.render('home');
});
router.get('/test', (req, resp) => {
    resp.render('test');
});
router.get('/sonoterapia', (re,resp) => {
    resp.render('sonoterapia');
});
router.get('/estadisticas', (re,resp) => {
    resp.render('estadisticas');
});
router.get('/consejos', (re,resp) => {
    resp.render('consejos');
});
router.get('/testimonios', (re,resp) => {
    resp.render('testimonios');
});
router.get('/menuP', (re,resp) => {
    resp.render('menuP');
});
router.get('/VentanaUs', (re,resp) => {
    resp.render('VentanaUs');
});
router.get('/InformacionA', (re,resp) => {
    resp.render('InformacionA');
});
router.get('/Controlador', (re,resp) => {
    resp.render('Controlador');
});

module.exports = router;


