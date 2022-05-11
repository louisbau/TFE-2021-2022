module.exports = (sequelize, Sequelize) => {
    const Friend = sequelize.define("Friend", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      }, 
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });
    Friend.associate = (models) => {
        Friend.hasMany(models.FriendShip);
    };
    
    return Friend;
};