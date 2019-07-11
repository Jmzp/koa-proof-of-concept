const Sequelize = require('sequelize');
const sequelize = require('../database/db');

module.exports = sequelize.define(
    'tasks',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        task_name: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false
    }
);