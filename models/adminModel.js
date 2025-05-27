const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema({
	username: {
		type: String,
		default: "Admin"
	},
	password: {
		type: String,
		default: "Admin"
	},
	no_available_vacine: {
		type: Number,
		default: 0
	},
	hospital_id: {
		type: [{
			no_vac: Number,
			id: String
		}],
		default: []
	}
}, { timestamps: true });



module.exports = mongoose.model('Admin', adminSchema);
