module.exports = (sequelize, Sequelize) => {
    const ChatRoomUser = sequelize.define("ChatRoomUser", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      }
    });
    return ChatRoomUser;
};