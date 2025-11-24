const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    dateTime: { type: Date, default: Date.now },
    // allow either an ObjectId ref to Team or an embedded team object 
    homeTeam: { type: mongoose.Schema.Types.Mixed, required: true },
    awayTeam: { type: mongoose.Schema.Types.Mixed, required: true },
    homeScore: { type: Number, default: 0 },
    awayScore: { type: Number, default: 0 },
    status: { type: String, enum: ["upcoming", "completed"], default: "upcoming" },
    location: { type: String, default: "" },
    field: { type: String, default: "" },
    typeOfMatch: { type: String, default: "Season" },
    inning: { type: Number, default: 0 },
    season: { type: String, default: "2025" },
    rating: { type: Number, default: 0 }
});

const EventModel = mongoose.model("Event", EventSchema);


module.exports = {
    createEvent: async (data) => {
        const event = new EventModel(data);
        return await event.save();
    },

    getAllEvents: async () => {
        return await EventModel.find()
            // populate only attempts will be ignored if homeTeam/awayTeam are embedded objects
            .populate("homeTeam")
            .populate("awayTeam")
            .sort({ dateTime: 1 });
    },

    readOneEvent: async (id) => {
        return await EventModel.findById(id)
            .populate("homeTeam")
            .populate("awayTeam");
    },

    getByMonth: async (month, year) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);

        return await EventModel.find({
            dateTime: { $gte: start, $lt: end }
        })
        .populate("homeTeam")
        .populate("awayTeam")
        .sort({ dateTime: 1 });
    },

    updateEvent: async (id, data) => {
        return await EventModel.findByIdAndUpdate(id, data, {
            new: true
        });
    },

    deleteEvent: async (id) => {
        return await EventModel.findByIdAndDelete(id);
    },

    deleteAll: async () => {
        return await EventModel.deleteMany();
    },

    getNextEvent: async () => {
        return await EventModel.findOne({
            dateTime: { $gte: new Date() }
        })
        .populate("homeTeam")
        .populate("awayTeam")
        .sort({ dateTime: 1 });
    }
};
