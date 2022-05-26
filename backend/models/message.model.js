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
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      audio: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reference: {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    });
  
    return Message;
};