'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User)
    }
    age() {
      let check = new Date()
      let age = check - this.dateOfBirth
      age = age / (1000 * 60 * 60 * 24 * 365.25)
      age = Math.floor(age)
      return age
    }

    get convertDate() {
      return this.dateOfBirth.toISOString().split('T')[0]
    }
  }

  Profile.init({
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'first name cannot be empty' }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'last name cannot be empty' }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: { msg: 'Date cannot be empty' },
        validateAge(dateOfBirth) {
          let check = new Date()
          let age = check - dateOfBirth
          age = age / (1000 * 60 * 60 * 24 * 365.25)
          age = Math.floor(age)
          if (age < 17) {
            throw new Error('umur harus 17 tahun ke atas')
          }
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};