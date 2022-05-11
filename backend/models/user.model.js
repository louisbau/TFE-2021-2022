const bcrypt = require("bcrypt");
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imageUri: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'User'
      }
    });

    User.associate = (models) => {
      User.hasMany(models.Message);
      User.hasMany(models.ChatRoomUser);
      User.hasMany(models.Friend);
      User.hasOne(models.FriendShip);
    };
    return User;
};