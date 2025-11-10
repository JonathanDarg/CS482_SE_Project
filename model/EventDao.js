const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    location: String,
    dateTime: {type: Date, default: Date.now},
    rating: Number,
    typeOfMatch: String,
    inning: Number
});

const EventModel = mongoose.model('Event', EventSchema);

exports.createEvent = async function(EventData){
    let Event = new EventModel(EventData);
    await Event.save();
    return Event;
}

exports.getAllEvents = async function(){
    let lstEvents = await EventModel.find();
    return lstEvents;
}

exports.readOneEvent = async function(id){
    let Event = await EventModel.findById(id);
    return Event;
}

exports.getByMonth = async function(month, year){
    let startDate = new Date(year, month - 1, 1);
    let endDate = new Date(year, month, 1);

    let Events = await EventModel.find({
        dateTime: {
            $gte: startDate,
            $lt: endDate
        }
    });
    
    return Events;
}

exports.updateEvent = async function(id, EventData){
    let Event = await EventModel.findById(id);
    if(!Event) return null;
    Event.location = EventData.location;
    Event.dateTime = EventData.dateTime;
    Event.rating = EventData.rating;
    Event.typeOfMatch = EventData.typeOfMatch;
    await Event.save();
    return Event;
}

exports.deleteEvent = async function(id){
    await EventModel.findByIdAndDelete(id);
}

exports.deleteAll = async function name(){
    await EventModel.deleteMany();
}

