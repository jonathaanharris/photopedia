'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Comment)
      User.hasMany(models.Post)
      User.hasOne(models.Profile)
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (User) => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(User.password, salt);
        User.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};