module.exports = (sequelize, Sequelize) => {
    const ChatRoom = sequelize.define("ChatRoom", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      newMessages: {
        type: Sequelize.INTEGER,
        allowNull: true,
      }, 
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      imageUri: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });

    ChatRoom.associate = (models) => {
      
      ChatRoom.hasMany(models.Message);
      ChatRoom.belongsTo(models.Message, { as : 'lastMessage', constraints: false, allowNull:true, defaultValue:null })
      ChatRoom.hasMany(models.ChatRoomUser);
      
    };
    return ChatRoom;
};