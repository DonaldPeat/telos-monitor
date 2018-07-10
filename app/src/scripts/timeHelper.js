function getHummanTime(sec) {
    var HM = humanTimingAPI(sec);

    var humanTiming = "";
    for (var k in HM) {
        humanTiming = humanTiming + HM[k].time + HM[k].label;
    }

    if (!humanTiming) humanTiming = '0 sec';
    humanTiming += "";

    return humanTiming;
}

function humanTimingAPI(sec) {

    var LANGS_JS = {};
    var sec_ = sec;

    LANGS_JS.TIMING_SHORT = {};
    LANGS_JS.TIMING_SHORT = { y: "y", mth: "m", w: "w", d: "d", h: "h", m: "min", s: "sec" };


    var timeUnits = [];
    timeUnits['31536000'] = LANGS_JS.TIMING_SHORT.y; //'y';
    timeUnits['2592000'] = LANGS_JS.TIMING_SHORT.mth; //'m';
    timeUnits['604800'] = LANGS_JS.TIMING_SHORT.w; //'w';
    timeUnits['86400'] = LANGS_JS.TIMING_SHORT.d; //'d';
    timeUnits['3600'] = LANGS_JS.TIMING_SHORT.h; //'h';
    timeUnits['60'] = LANGS_JS.TIMING_SHORT.m; //'min';
    timeUnits['1'] = LANGS_JS.TIMING_SHORT.s; //'sec';

    var humanTimings = [];
    var unit = 31536000;

    var let_ = timeUnits[unit]; //"y";
    var numberOfUnits;
    if (sec > unit) {
        numberOfUnits = Math.floor(sec / unit);
        sec -= unit * numberOfUnits;
        humanTimings['y'] = { time: numberOfUnits, label: let_ };
    }

    unit = 2592000; let_ = timeUnits[unit]; //"m";
    if (sec > unit) {
        numberOfUnits = Math.floor(sec / unit);
        sec -= unit * numberOfUnits;
        humanTimings['m'] = { time: numberOfUnits, label: let_ };
    }

    unit = 86400; let_ = timeUnits[unit]; //"d";
    if (sec > unit) {
        numberOfUnits = Math.floor(sec / unit);
        sec -= unit * numberOfUnits;
        humanTimings['d'] = { time: numberOfUnits, label: let_ };
    }
    unit = 3600; let_ = timeUnits[unit]; //"h";
    if (sec > unit) {
        numberOfUnits = Math.floor(sec / unit);
        sec -= unit * numberOfUnits;
        humanTimings['h'] = { time: numberOfUnits, label: let_ };
    }
    unit = 60; let_ = timeUnits[unit]; //"min";
    if (sec > unit) {
        numberOfUnits = Math.floor(sec / unit);
        sec -= unit * numberOfUnits;
        humanTimings['min'] = { time: numberOfUnits, label: let_ };
    }
    unit = 1; let_ = timeUnits[unit]; //"sec";
    if (sec_ > unit) {
        numberOfUnits = Math.floor(sec / unit);
        sec -= unit * numberOfUnits;
        humanTimings['sec'] = { time: numberOfUnits, label: let_ };
    }


    return humanTimings;

}

export default getHummanTime;