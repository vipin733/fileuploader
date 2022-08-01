import { DataTypes } from "sequelize";

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    debug: false
});

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uuid : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 
    },
    google_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    given_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    family_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    picture: {
        type: DataTypes.STRING,
        allowNull: false
    },
  }, {
    timestamps: true
});



export const FileModel = sequelize.define('files', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uuid : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 
    },
    name : {
        type: DataTypes.STRING,
        allowNull: false
    },
    mime_type : {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    timestamps: true
});

export const Token = sequelize.define('tokens', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uuid : {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    revoke: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    expire_at: {
        type: DataTypes.TIME,
        allowNull: false
    }
  }, {
    timestamps: true
});

(async () => {
    await sequelize.sync();
})();

export default sequelize

