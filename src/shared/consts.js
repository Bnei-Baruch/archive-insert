// Use these for immutable default values
export const EMPTY_ARRAY  = Object.freeze([]);
export const EMPTY_OBJECT = Object.freeze({});

const API_BACKEND = 'https://upload.kli.one/rest/content_units';
// const API_BACKEND = 'http://app.mdb.bbdomain.org/rest/content_units';

export const toHms = (time) => {
    let totalSec = time ;
    let hours = parseInt( totalSec / 3600 ) % 24;
    let minutes = parseInt( totalSec / 60 ) % 60;
    let seconds = (totalSec % 60).toFixed(2);
    if (seconds < 0) seconds = 0;

    let result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
    return result;
}

export const getName = (metadata) => {
  console.log(metadata)
    switch (metadata.upload_type) {
        case "akladot":
            var language = metadata.language;
            var original = language === metadata.original_language ? "o" : "t";
            var lecturer = metadata.send_name.split("_")[2];
            var date = metadata.film_date;
            var type = metadata.send_name.split("_")[4];
            var desc = metadata.send_name.split("_").slice(5, -1).join("_");
            var ext = mime_list[metadata.mime_type];
            break;
        case "kitei-makor":
            var language = metadata.language;
            var original = language === metadata.original_language ? "o" : "t";
            var lecturer = metadata.send_name.split("_")[2];
            var date = metadata.film_date;
            var type = "kitei-makor";
            var desc = metadata.send_name.split("_").slice(5, -1).join("_");
            var ext = mime_list[metadata.mime_type];
            break;
        case "sirtutim":
            break;
        case "aricha":
            break;
        default:
            var language = metadata.language;
            var original = language === metadata.original_language ? "o" : "t";
            var lecturer = metadata.send_name.split("_")[2];
            var date = metadata.film_date;
            var type = metadata.send_name.split("_")[4];
            var desc = metadata.send_name.split("_").slice(5, -1).join("_");
            var ext = mime_list[metadata.mime_type];
    };

    let filename =
        language + '_' +
        original + '_' +
        lecturer + '_' +
        date + '_' +
        type + '_' +
        desc + '.' +
        ext;
    return filename;
}

export const fetcher = (path, cb) => fetch(`${API_BACKEND}/${path}`)
    .then((response) => {
        if (response.ok) {
            console.log("::FetchDataWithCB::");
            return response.json().then(data => cb(data));
        }
    })
    .catch(ex => console.log(`get ${path}`, ex));

export const fetchUnits = (path,cb) => fetcher(path, cb);

export const fetchCollections = (data,col) => {
    const count = [];
    data.data.forEach((u,i) => {
        let path = u.id+'/collections/';
        fetcher(path,cb => {
                u["number"] = cb[0].collection.properties.number;
                u["part"] = cb[0].name;
                count.push(u);
                if(data.total == count.length) {
                    col(data)
                }
            }
        )
    })
}

export const content_options = [
    { value: 'LESSON_PART', text: ' ‏שיעור', icon: 'student' },
    { value: 'VIDEO_PROGRAM_CHAPTER', text: ' ‏תוכנית', icon: 'record' },
    { value: 'MEAL', text: ' ‏סעודה', icon: 'food' },
];

export const language_options = [
    { key: 'he', value: 'heb', flag: 'il', text: 'Hebrew' },
    { key: 'ru', value: 'rus', flag: 'ru', text: 'Russian' },
    { key: 'en', value: 'eng', flag: 'us', text: 'English' },
];

export const upload_options = [
    { value: 'aricha', text: ' עריכה', icon: 'paint brush' },
    { value: 'sirtutim', text: ' ‏שרטוטים', icon: 'edit' },
    { value: 'kitei-makor', text: 'קיטעי-מקור', icon: 'commenting outline' },
    { value: 'akladot', text: ' ‏הקלדות', icon: 'file word outline' },
];

export const mime_list = {
    "application/msword": "docx",
    "image/jpeg": "jpg",
    "audio/mpeg": "mp3",
    "video/mp4": "mp4",
    "application/zip": "zip"
};

export const LANGUAGES = [
  { text: 'עברית', value: 'heb' },
  { text: 'אנגלית', value: 'eng' },
  { text: 'רוסית', value: 'rus' },
  { text: 'ספרדית', value: 'spa' },
  { text: 'אוקראינית', value: 'ukr' },
  { text: 'איטלקית', value: 'ita' },
  { text: 'גרמנית', value: 'ger' },
  { text: 'הולנדית', value: 'dut' },
  { text: 'צרפתית', value: 'fre' },
  { text: 'פורטוגזית', value: 'por' },
  { text: 'טורקית', value: 'trk' },
  { text: 'פולנית', value: 'pol' },
  { text: 'ערבית', value: 'arb' },
  { text: 'הונגרית', value: 'hun' },
  { text: 'פינית', value: 'fin' },
  { text: 'ליטאית', value: 'lit' },
  { text: 'יפנית', value: 'jpn' },
  { text: 'בולגרית', value: 'bul' },
  { text: 'גאורגית', value: 'geo' },
  { text: 'נורבגית', value: 'nor' },
  { text: 'שבדית', value: 'swe' },
  { text: 'קרואטית', value: 'hrv' },
  { text: 'סינית', value: 'chn' },
  { text: 'פרסית', value: 'far' },
  { text: 'רומנית', value: 'ron' },
  { text: 'הינדי', value: 'hin' },
  { text: 'מקדונית', value: 'mkd' },
  { text: 'סלובנית', value: 'slv' },
  { text: 'לטבית', value: 'lav' },
  { text: 'סלובקית', value: 'slk' },
  { text: 'צ\'כית', value: 'cze' },
];

export const MDB_LANGUAGES = {
  en: 'eng',
  he: 'heb',
  ru: 'rus',
  es: 'spa',
  it: 'ita',
  de: 'ger',
  nl: 'dut',
  fr: 'fre',
  pt: 'por',
  tr: 'trk',
  pl: 'pol',
  ar: 'arb',
  hu: 'hun',
  fi: 'fin',
  lt: 'lit',
  ja: 'jpn',
  bg: 'bul',
  ka: 'geo',
  no: 'nor',
  sv: 'swe',
  hr: 'hrv',
  zh: 'chn',
  fa: 'far',
  ro: 'ron',
  hi: 'hin',
  mk: 'mkd',
  sl: 'slv',
  lv: 'lav',
  sk: 'slk',
  cs: 'cze',
  ua: 'ukr',
  zz: 'mlt',
  xx: 'unk',
};

export const LECTURERS = [
  { text: 'רב', value: 'rav' },
  { text: 'בלי רב', value: 'norav' },
];

// Collection Types
export const CT_DAILY_LESSON       = 'DAILY_LESSON';
export const CT_SPECIAL_LESSON     = 'SPECIAL_LESSON';
export const CT_FRIENDS_GATHERINGS = 'FRIENDS_GATHERINGS';
export const CT_CONGRESS           = 'CONGRESS';
export const CT_VIDEO_PROGRAM      = 'VIDEO_PROGRAM';
export const CT_LECTURE_SERIES     = 'LECTURE_SERIES';
export const CT_MEALS              = 'MEALS';
export const CT_HOLIDAY            = 'HOLIDAY';
export const CT_PICNIC             = 'PICNIC';
export const CT_UNITY_DAY          = 'UNITY_DAY';

// Content Unit Types
export const CT_LESSON_PART           = 'LESSON_PART';
export const CT_LECTURE               = 'LECTURE';
export const CT_CHILDREN_LESSON_PART  = 'CHILDREN_LESSON_PART';
export const CT_WOMEN_LESSON_PART     = 'WOMEN_LESSON_PART';
export const CT_VIRTUAL_LESSON        = 'VIRTUAL_LESSON';
export const CT_FRIENDS_GATHERING     = 'FRIENDS_GATHERING';
export const CT_MEAL                  = 'MEAL';
export const CT_VIDEO_PROGRAM_CHAPTER = 'VIDEO_PROGRAM_CHAPTER';
export const CT_FULL_LESSON           = 'FULL_LESSON';
export const CT_TEXT                  = 'TEXT';
export const CT_UNKNOWN               = 'UNKNOWN';
export const CT_EVENT_PART            = 'EVENT_PART';
export const CT_CLIP                  = 'CLIP';
export const CT_TRAINING              = 'TRAINING';
export const CT_KITEI_MAKOR           = 'KITEI_MAKOR';

export const EVENT_CONTENT_TYPES = [CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY];

export const ARTIFACT_TYPES = [
  { text: 'תוכן מרכזי', value: 'main' },
  { text: 'קטעי מקור', value: CT_KITEI_MAKOR },
];

export const CONTENT_TYPE_BY_ID = {
  1: CT_DAILY_LESSON,
  2: CT_SPECIAL_LESSON,
  3: CT_FRIENDS_GATHERINGS,
  4: CT_CONGRESS,
  5: CT_VIDEO_PROGRAM,
  6: CT_LECTURE_SERIES,
  7: CT_MEALS,
  8: CT_HOLIDAY,
  9: CT_PICNIC,
  10: CT_UNITY_DAY,
  11: CT_LESSON_PART,
  12: CT_LECTURE,
  13: CT_CHILDREN_LESSON_PART,
  14: CT_WOMEN_LESSON_PART,
  16: CT_VIRTUAL_LESSON,
  18: CT_FRIENDS_GATHERING,
  19: CT_MEAL,
  20: CT_VIDEO_PROGRAM_CHAPTER,
  21: CT_FULL_LESSON,
  22: CT_TEXT,
  27: CT_UNKNOWN,
  28: CT_EVENT_PART,
  29: CT_CLIP,
  30: CT_TRAINING,
  31: CT_KITEI_MAKOR,
};

export const CONTENT_TYPES_MAPPINGS = {
  [CT_LESSON_PART]: { collection_type: CT_DAILY_LESSON, pattern: 'lesson' },
  [CT_FULL_LESSON]: { collection_type: CT_DAILY_LESSON, pattern: 'lesson' },
  [CT_KITEI_MAKOR]: { collection_type: null, pattern: 'kitei-makor' },
  [CT_VIDEO_PROGRAM_CHAPTER]: { collection_type: CT_VIDEO_PROGRAM, pattern: 'program' },
  [CT_FRIENDS_GATHERING]: { collection_type: CT_FRIENDS_GATHERINGS, pattern: 'yeshivat-haverim' },
  [CT_MEAL]: { collection_type: CT_MEALS, pattern: 'seuda' },
  [CT_LECTURE]: { collection_type: CT_LECTURE_SERIES, pattern: 'lecture' },
  [CT_TRAINING]: { collection_type: null, pattern: 'training' },
  [CT_CLIP]: { collection_type: null, pattern: 'clip' },
  [CT_CHILDREN_LESSON_PART]: { collection_type: CT_LECTURE_SERIES, pattern: 'children-lesson' },
  [CT_WOMEN_LESSON_PART]: { collection_type: CT_LECTURE_SERIES, pattern: 'women-lesson' },
  [CT_VIRTUAL_LESSON]: { collection_type: null, pattern: 'vl' },
};

export const EVENT_PART_TYPES = [
  { text: 'שיעור', content_type: CT_FULL_LESSON, pattern: 'lesson' },
  { text: 'ישיבת חברים', content_type: CT_FRIENDS_GATHERING, pattern: 'yeshivat-haverim' },
  { text: 'סעודה', content_type: CT_MEAL, pattern: 'seuda' },
  { text: 'טקס פתיחה', content_type: CT_EVENT_PART, pattern: 'tekes-ptiha' },
  { text: 'טקס סיום', content_type: CT_EVENT_PART, pattern: 'tekes-siyum' },
  { text: 'ערב פתוח', content_type: CT_EVENT_PART, pattern: 'erev-patuah' },
  { text: 'ערב תרבות', content_type: CT_EVENT_PART, pattern: 'erev-tarbut' },
  { text: 'הצגת פרויקט', content_type: CT_EVENT_PART, pattern: 'atzagat-proekt' },
  { text: 'הענקת תעודות', content_type: CT_EVENT_PART, pattern: 'haanakat-teudot' },
  { text: 'חתימת ספרים', content_type: CT_EVENT_PART, pattern: 'hatimat-sfarim' },
  { text: 'אחר', content_type: CT_EVENT_PART, pattern: 'event' },
];
