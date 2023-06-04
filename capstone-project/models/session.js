"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      session.belongsTo(models.user, {
        foreignKey: "userId",
      });
    }
    static async addPlayer(id, player) {
      const getSession = await this.findByPk(id);
      let playernames = getSession.playersName;
      playernames.push(player);
      console.log(playernames);
      return this.update(
        {
          playersName: playernames,
        },
        {
          where: {
            id: id,
          }, });
    }

    static addSession({
      nameOfSport,
      dateTime,
      sessionsPlace,
      players,
      noOfplayers,
      sessioncreated,
      userId,
    }) {
      return this.create({
        nameOfSport: nameOfSport,
        time: dateTime,
        userId: userId,
        sessionsPlace: sessionsPlace,
        playersName: players,
        noOfplayers: noOfplayers,
        sessioncreated: sessioncreated,
      });
    }

    static deleteSession(name, userId) {
      return this.destroy({
        where: {
          nameOfSport: name,
          userId: userId,
        },
      });
    }

    static getSessions({ nameOfSport, userId }) {
      return this.findAll({
        where: {
          nameOfSport: nameOfSport,
          sessioncreated: true,
          userId,
          time: {
            // eslint-disable-next-line no-undef
            [Op.gt]: new Date(),
          },
        },
      });
    }
    static getAllSessions({ nameOfSport }) {
      return this.findAll({
        where: {
          nameOfSport: nameOfSport,
          sessioncreated: true,
          time: {
            // eslint-disable-next-line no-undef
            [Op.gt]: new Date(),
          },
        },
      });
    }

    static getAllSessionsTest({ nameOfSport }) {
      return this.findAll({
        where: {
          nameOfSport: nameOfSport,
          sessioncreated: true,
        },
      });
    }

    static async getPreviousSessions(nameOfSport) {
      return this.findAll({
        where: {
          nameOfSport: nameOfSport,
          sessioncreated: false,
          time: {
            // eslint-disable-next-line no-undef
            [Op.lt]: new Date(),
          },
        },
      });
    }

    static async cancelSession(id) {
      //console.log(player,sessions.playername)
      return this.update(
        {
          sessioncreated: false,
        },
        {
          where: {
            userId: id,
          },
        }
      );
    }
    static getSessionById(id) {
      return this.findByPk(id);
    }

    static getPlayedSessions(userId) {
      return this.findAll({
        where: {
          userId: userId,
          sessioncreated: true,
          dateTime: {
            [Op.lt]: new Date(),
          },
        },
      });
    }

    static async removePlayer(playersName, id) {
      const sessions = await session.findByPk(id);
      var index = sessions.playername.indexOf(playersName);
      sessions.playersName.splice(index, 1);
      //console.log(player,sessions.playername)
      return this.update(
        {
          playersName: sessions.playersName,
        },
        {
          where: {
            id: id,
          },
        }
      );
    }
  }
  session.init(
    {
      nameOfSport: DataTypes.INTEGER,
      time: DataTypes.DATE,
      sessionsPlace: DataTypes.STRING,
      playersName: DataTypes.ARRAY(DataTypes.STRING),
      noOfplayers: DataTypes.INTEGER,
      sessioncreated: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "session",
    }
  );
  return session;
};