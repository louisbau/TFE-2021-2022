module.exports = (sequelize, Sequelize) => {
    const ChatRoom = sequelize.define("ChatRoom", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      }
    });

    ChatRoom.associate = (models) => {
      ChatRoom.hasMany(models.Message);
      ChatRoom.hasMany(models.ChatRoomUser);
    };
    return ChatRoom;
};