module.exports = (sequelize, Sequelize) => {
    const Friend = sequelize.define("Friend", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      }, 
      isClasse: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      nameClasse: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });
    Friend.associate = (models) => {
        Friend.hasMany(models.FriendShip);
    };
    
    return Friend;
};