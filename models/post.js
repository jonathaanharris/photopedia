'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User)
      Post.hasMany(models.Comment)
    }
  }
  Post.init({
    UserId: DataTypes.INTEGER,
    image: {
      type: DataTypes.STRING,
      validate : {
        notEmpty : {msg: 'image cannot be empty'}
      }
    },
    title: {
      type: DataTypes.STRING,
      validate : {
        notEmpty : {msg: 'title cannot be empty'}
      }
    },
    description: {
      type: DataTypes.STRING,
      validate : {
        notEmpty : {msg: 'description cannot be empty'}
      }
    },
    like: DataTypes.INTEGER
  },
    {
      hooks: {
        beforeCreate: (Post) => {
          Post.like = 0
        }
      },
      sequelize,
      modelName: 'Post',
    });
  return Post;
};