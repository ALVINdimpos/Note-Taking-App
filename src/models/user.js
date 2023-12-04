'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'role',
        onDelete: 'CASCADE',
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpires: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
