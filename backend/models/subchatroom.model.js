module.exports = (sequelize, Sequelize) => {
    const SubChatRoom = sequelize.define("SubChatRoom", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      newMessages: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      }, 
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      creator: {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    });

    SubChatRoom.associate = (models) => {
        SubChatRoom.hasMany(models.Message);
        SubChatRoom.belongsTo(models.Message, { as : 'lastMessage', constraints: false, allowNull:true, defaultValue:null })
        SubChatRoom.hasMany(models.ChatRoomUser);
    };
    return SubChatRoom;
};