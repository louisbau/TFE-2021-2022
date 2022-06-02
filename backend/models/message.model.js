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
      },
      forUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isCrypted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
    Message.associate = (models) => {
      Message.hasMany(models.ReportMessage);
    };
  
    return Message;
};