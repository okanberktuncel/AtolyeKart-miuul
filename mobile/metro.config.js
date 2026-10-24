// Ürün verisi repo kökündeki src/data/products.json'da duruyor; Metro'nun mobile/ dışını
// izleyebilmesi için repo kökünü watchFolders'a ekliyoruz.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.watchFolders = [path.resolve(__dirname, '..')];

module.exports = config;
