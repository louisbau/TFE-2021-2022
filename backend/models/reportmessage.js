module.exports = (sequelize, Sequelize) => {
    const ReportMessage = sequelize.define("ReportMessage", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      }, 
      reason: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    });
    
    return ReportMessage;
};