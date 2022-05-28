module.exports = (sequelize, Sequelize) => {
    const FriendShip = sequelize.define("FriendShip", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Waiting'
      }
    });
    return FriendShip;
};