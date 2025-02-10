const express = require('express');
const router = express.Router();

// Ruta para estados
router.get('/Sonora', (req, res) => {
    res.render('regiones/Sonora');
  });
router.get('/BajaCalifornia', (req, res) => {
    res.render('regiones/BajaCalifornia');
});
router.get('/BajaCaliforniaSur', (req, res) => {
  res.render('regiones/BajaCaliforniaSur');
});
router.get('/Chihuahua', (req, res) => {
  res.render('regiones/Chihuahua');
});
router.get('/Coahuila', (req, res) => {
  res.render('regiones/Coahuila');
});
router.get('/NuevoLeon', (req, res) => {
  res.render('regiones/NuevoLeon');
});
router.get('/Tamaulipas', (req, res) => {
  res.render('regiones/Tamaulipas');
});
router.get('/Sinaloa', (req, res) => {
  res.render('regiones/Sinaloa');
});
router.get('/Durango', (req, res) => {
  res.render('regiones/Durango');
});
router.get('/Zacatecas', (req, res) => {
  res.render('regiones/Zacatecas');
});
router.get('/SanLuis', (req, res) => {
  res.render('regiones/SanLuis');
});
router.get('/Nayarit', (req, res) => {
  res.render('regiones/Nayarit');
});
router.get('/Aguascalientes', (req, res) => {
  res.render('regiones/Aguascalientes');
});
router.get('/Jalisco', (req, res) => {
  res.render('regiones/Jalisco');
});
router.get('/Guanajuato', (req, res) => {
  res.render('regiones/Guanajuato');
});
router.get('/Queretaro', (req, res) => {
  res.render('regiones/Queretaro');
});
router.get('/Hidalgo', (req, res) => {
  res.render('regiones/Hidalgo');
});
router.get('/Michoacan', (req, res) => {
  res.render('regiones/Michoacan');
});
router.get('/EdoMex', (req, res) => {
  res.render('regiones/EdoMex');
});
router.get('/CDMX', (req, res) => {
  res.render('regiones/CDMX');
});
router.get('/Puebla', (req, res) => {
  res.render('regiones/Puebla');
});
router.get('/Veracruz', (req, res) => {
  res.render('regiones/Veracruz');
});
router.get('/Guerrero', (req, res) => {
  res.render('regiones/Guerrero');
});
router.get('/Oaxaca', (req, res) => {
  res.render('regiones/Oaxaca');
});
router.get('/Tabasco', (req, res) => {
  res.render('regiones/Tabasco');
});
router.get('/Chiapas', (req, res) => {
  res.render('regiones/Chiapas');
});
router.get('/Campeche', (req, res) => {
  res.render('regiones/Campeche');
});
router.get('/Yucatan', (req, res) => {
  res.render('regiones/Yucatan');
});
router.get('/QuintanaRoo', (req, res) => {
  res.render('regiones/QuintanaRoo');
});
router.get('/Colima', (req, res) => {
  res.render('regiones/Colima');
});
router.get('/Tlaxcala', (req, res) => {
  res.render('regiones/Tlaxcala');
});
router.get('/Morelos', (req, res) => {
  res.render('regiones/Morelos');
});

module.exports = router;