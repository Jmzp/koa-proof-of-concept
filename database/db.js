const Sequelize = require('sequelize');
const sequelize = new Sequelize('koatasks', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false
});

module.exports = sequelize;
