const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Expense = sequelize.define('expense',{
  id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true

    },
    exp_amt: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    disc:{
        type: Sequelize.STRING,
        allowNull: false
    },
    ctg:{
        type: Sequelize.STRING,
        allowNull: false
    },
  note:{
     type: Sequelize.STRING,
        allowNull: true
  }
})

module.exports = Expense