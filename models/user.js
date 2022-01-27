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
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: { msg: 'username cannot be empty' }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      isEmail: true,
      validate: {
        notEmpty: { msg: 'email cannot be empty' }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'password cannot be empty' }
      }
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'role cannot be empty' }
      }
    }
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