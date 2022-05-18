module.exports = (sequelize, Sequelize) => {
    const UserChatRoom = sequelize.define("UserChatRoom", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      pseudo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Default'
      }
    });
    UserChatRoom.associate = (models) => {
      UserChatRoom.hasMany(models.ChatRoomUser);
      UserChatRoom.hasMany(models.Message)
    }
    return UserChatRoom;
}