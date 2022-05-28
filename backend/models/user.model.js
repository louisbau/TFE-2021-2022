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
        allowNull: false,
        defaultValue: 'Absent'
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'User'
      },
      publicKey: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });

    User.associate = (models) => {
      User.hasMany(models.UserChatRoom);
      User.hasMany(models.Friend);
      User.hasMany(models.FriendShip);
    };
    return User;
};