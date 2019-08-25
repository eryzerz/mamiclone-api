'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    user.hasMany(models.dorm, {
      foreignKey: 'createdBy'
    })
  };
  return user;
};