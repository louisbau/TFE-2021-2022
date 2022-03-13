module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("Message", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
    return Message;
};