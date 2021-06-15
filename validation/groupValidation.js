const yup = require("yup");

const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);

const groupValidation = yup.object().shape({
    groupTitle: yup.string().max(40).required(),
    groupDescription: yup.string().max(500),
    groupPurpose: yup.string().required(),
    institution: yup.string(),
    groupSize: yup.number().integer().min(2).max(100).required(),
    date: yup.date().min(todayDate).required(),
    startHour: yup.date().required(),
    endHour: yup.date().min(yup.ref('startHour')).required(),
    meetingType: yup.string().oneOf(['וירטואלית', 'פרונטלית']),
    city: yup.string().when('meetingType', {is: 'פרונטלית', then: yup.string().required()}),
    place: yup.string().when('meetingType', {is: 'פרונטלית', then: yup.string().required()}),
    link: yup.string().when('meetingType', {is: 'וירטואלית', then: yup.string().required()}),
});

module.exports = { groupValidation };
