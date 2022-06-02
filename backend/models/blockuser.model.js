module.exports = (sequelize, Sequelize) => {
    const BlockUser = sequelize.define("BlockUser", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      }, 
      userIdBlock: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
    
    return BlockUser;
};