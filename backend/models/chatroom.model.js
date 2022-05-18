module.exports = (sequelize, Sequelize) => {
    const ChatRoom = sequelize.define("ChatRoom", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      imageUri: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isGroupe: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      creator: {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    });

    ChatRoom.associate = (models) => {
      ChatRoom.hasMany(models.SubChatRoom);
      ChatRoom.hasMany(models.UserChatRoom);
    };
    return ChatRoom;
};