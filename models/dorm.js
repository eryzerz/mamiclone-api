'use strict';
module.exports = (sequelize, DataTypes) => {
  const dorm = sequelize.define('dorm', {
    type: DataTypes.STRING,
    city: DataTypes.STRING,
    village: DataTypes.STRING,
    region: DataTypes.STRING,
    province: DataTypes.STRING,
    name: DataTypes.STRING,
    cost: DataTypes.INTEGER,
    room: DataTypes.INTEGER,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    photoURL: DataTypes.STRING,
    area: DataTypes.STRING,
    facility: DataTypes.STRING,
    createdBy: DataTypes.INTEGER
  }, {});
  dorm.associate = function(models) {
    dorm.belongsTo(models.user, {
      foreignKey: 'createdBy'
    })
  };
  return dorm;
};