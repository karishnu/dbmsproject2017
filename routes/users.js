var express = require('express');
var router = express.Router();
var Auth = require('vitauth');
var unirest = require('unirest');
var tabletojson = require('tabletojson');
var User = require('../models/User').User;

const hostel_link = 'https://vtop.vit.ac.in/student/hostel_info.asp';
const personal_details = 'https://vtop.vit.ac.in/student/profile_personal_view.asp';
var cookieJar;
var block_name, room_no, dob, gender, programme, name, regno;

/* GET users listing. */
router.post('/login', function (req, res, next) {
    Auth.auth(req.body.username, req.body.password, function (name_stud, regno_stud, cookieJ, auth_err) {

        name = name_stud;
        regno = regno_stud;

        cookieJar = cookieJ;

        unirest.get(hostel_link)
            .jar(cookieJar)
            .timeout(28000)
            .end(onSubmitHostel);
    });

    function onSubmitHostel(response) {

        console.log("Scraping hostel details!");

        var HostelJsonTable = tabletojson.convert(response.body);

        block_name = HostelJsonTable[0][0]['8'];
        room_no = HostelJsonTable[0][0]['10'];

        unirest.get(personal_details)
            .jar(cookieJar)
            .timeout(28000)
            .end(onPersonalDetails);
    }

    function onPersonalDetails(response) {
        var PersonalJsonTable = tabletojson.convert(response.body);

        dob = PersonalJsonTable[3][2]['1'];
        gender = PersonalJsonTable[3][3]['1'];
        programme = PersonalJsonTable[3][17]['1'];

        var userObject = {
            name: name,
            regno: regno,
            block: block_name,
            room: room_no,
            dob: dob,
            gender: gender,
            programme: programme
        };

        var query = {'regno': regno};

        User.findOneAndUpdate(query, userObject, {upsert: true, new: true}, function (err, doc) {
            res.json(doc);
        });
    }
});

router.post('/marks', function (req, res, next) {
    var query = {'regno': req.body.regno};
    var userObject = {
        dsa_marks: req.body.dsa_marks,
        cao_marks: req.body.cao_marks,
        toc_marks: req.body.toc_marks
    };
    User.findOneAndUpdate(query, userObject, {upsert: true, new: true}, function (err, doc) {
        res.json(doc);
    });
});

router.get('/', function (req, res, next) {
   User.find(function (err, result) {
       res.json(result);
   })
});

module.exports = router;