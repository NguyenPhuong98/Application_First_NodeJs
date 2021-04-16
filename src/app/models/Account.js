const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Account = new Schema(
    {
        id_account: { type: Number },
        fullname: { type: String, default: '' },
        email: { type: String, default: '' },
        password: { type: String, default: '' },
    },
    {
        _id: false,
        timestamps: true,
    },
);

// Add plugin
Account.plugin(AutoIncrement, { id: 'id_account' });
Account.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});
module.exports = mongoose.model('accounts', Account);
