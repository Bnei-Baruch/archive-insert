import { mime_list, CONTENT_TYPES_MAPPINGS, MDB_LANGUAGES, DCT_OPTS} from './consts';

const MDB_BACKEND = 'https://kabbalahmedia.info/mdb-api';
const WF_BACKEND = 'https://insert.kbb1.com';
const SRV_BACKEND = 'https://insert.kbb1.com/workflow';
const AUTH_URL = 'https://accounts.kbb1.com/auth/realms/main';

export const toHms = (totalSec) => {
    let hours = parseInt( totalSec / 3600, 10 ) % 24;
    let minutes = parseInt( totalSec / 60, 10 ) % 60;
    let seconds = totalSec % 60;
    if (seconds < 0) seconds = 0;
    return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
};

export const getLang = (lang) => {
    return Object.keys(MDB_LANGUAGES).find(key => MDB_LANGUAGES[key] === lang);
};

export const getDCT = (val) => {
    return Object.entries(DCT_OPTS).find(i => i[1].filter(p => p === val)[0])[0];
};

export const getName = (metadata) => {
    //console.log(":: GetName - got metadata: ",metadata);
    let name = [];
    const {line,language,upload_type} = metadata;

    // Language
    name[0] = language;
    // Original
    name[1] = name[0] === line.original_language ? "o" : "t";
    // Lecturer
    name[2] = line.lecturer;
    // Date
    name[3] = line.capture_date && line.capture_date !== "0001-01-01" ? line.capture_date : line.film_date;
    // Type
    name[4] = CONTENT_TYPES_MAPPINGS[line.content_type].pattern;
    // Description
    name[5] = line.send_name.split("_").slice(5).join("_").replace(/([^-_a-zA-Z0-9]+)/g, '').toLowerCase();

    if(upload_type === "akladot") {
        name[4] = "akladot";
    } else if(upload_type === "tamlil") {
        name[4] = line.send_name.split("_").slice(4).join("_").replace(/([^-_a-zA-Z0-9]+)/g, '').toLowerCase();
        name.splice(-1,1);
    } else if(upload_type === "kitei-makor") {
        name[4] = "kitei-makor";
    } else if(upload_type === "research-material") {
        name[4] = "research-material";
    } else if(upload_type === "article") {
        //Validate file name
        if(line.upload_filename.split("_").length < 6) {
            return null
        }
        name[2] = "rav";
        name[4] = "art";
        name[5] = line.upload_filename.split(".")[0].split("_").pop().replace(/([^-a-zA-Z0-9]+)/g, '').toLowerCase();
    } else if(upload_type === "publication") {
        //Validate file name
        if(line.upload_filename.split("_").length < 6) {
            return null
        }
        name[2] = "rav";
        name[4] = "pub";
        name[5] =  line.upload_filename.split("_").slice(5)[0].replace(/([^-a-zA-Z0-9]+)/g, '').toLowerCase() + "_" + line.publisher;
    } else if(upload_type === "declamation") {
        name[1] = "o";
        name[2] = "rav";
        name[4] = "declamation";
        name[5] =  "blog-rav_full";
    }

    return name.join("_") + '.' + mime_list[line.mime_type];
};

const getToken = () => {
    let jwt = sessionStorage.getItem(`oidc.user:${AUTH_URL}:workflow-insert`);
    let json = JSON.parse(jwt);
    return json.access_token;
};

export const Fetcher = (path, cb) => fetch(`${MDB_BACKEND}/${path}`, {
    headers: {
        'Authorization': 'bearer ' + getToken(),
        'Content-Type': 'application/json'
    }
})
    .then((response) => {
        if (response.ok) {
            return response.json().then(data => cb(data));
        }
        throw new Error('Network response was not ok.');
    })
    .catch(ex => console.log(`get ${path}`, ex));

export const fetchSources = cb => Fetcher('sources/', cb);

export const fetchTags = cb => Fetcher('tags/', cb);

export const fetchPublishers = cb => Fetcher('publishers/', cb);

export const fetchUnits = (path, cb) => fetch(`${MDB_BACKEND}/content_units/${path}`, {
    headers: {
        'Authorization': 'bearer ' + getToken(),
        'Content-Type': 'application/json'
    }
})
    .then((response) => {
        if (response.ok) {
            //console.log("--FetchDataWithCB--");
            return response.json().then(data => cb(data));
        }
    })
    .catch(ex => console.log(`get ${path}`, ex));

export const fetchPersons = (id, cb) => fetch(`${MDB_BACKEND}/content_units/${id}/persons/`, {
    headers: {
        'Authorization': 'bearer ' + getToken(),
        'Content-Type': 'application/json'
    }
})
    .then((response) => {
        if (response.ok) {
            //console.log("--FetchPersonsName--");
            return response.json().then(data => cb(data));
        }
    })
    .catch(ex => console.log(`get ${id}`, ex));

export const insertName = (filename, key, cb) => fetch(`${WF_BACKEND}/insert/find?key=${key}&value=${filename}`)
    .then((response) => {
        if (response.ok) {
            return response.json().then(data => cb(data));
        }
    })
    .catch(ex => console.log(`get ${filename}`, ex));

export const insertData = (value, key, cb) => fetch(`${WF_BACKEND}/insert/line?key=${key}&value=${value}`)
    .then((response) => {
        if (response.ok) {
            return response.json().then(data => cb(data));
        }
    })
    .catch(ex => console.log(`get ${value}`, ex));

export const getData = (id, cb) =>  {
    fetch(`${WF_BACKEND}/${getEndpoint(id)}/${id}`)
    .then((response) => {
        if (response.ok) {
            return response.json().then(data => cb(data));
        } else {
            return response.json().then(cb(null));
        }
    })
    .catch(ex => console.log(`get ${id}`, ex));
};

export const putData = (path, data, cb) => fetch(`${SRV_BACKEND}/${path}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body:  JSON.stringify(data)
})
    .then((response) => {
        if (response.ok) {
            return response.json().then(respond => cb(respond));
        }
    })
    .catch(ex => console.log("Put Data error:", ex));


const getEndpoint = (id) => {
    if(id.match(/^t[\d]{10}$/)) return "trimmer";
    if(id.match(/^a[\d]{10}$/)) return "aricha";
    if(id.match(/^d[\d]{10}$/)) return "dgima";
    if(id.match(/^i[\d]{10}$/)) return "insert";
};

export const insertSha = (sha, cb) => fetch(`${MDB_BACKEND}/files/?sha1=${sha}`, {
    headers: {
        'Authorization': 'bearer ' + getToken(),
        'Content-Type': 'application/json'
    }
})
    .then((response) => {
        if (response.ok) {
            //console.log("--FetchInsertSha--");
            return response.json().then(data => cb(data));
        }
    })
    .catch(ex => console.log(`get ${sha}`, ex));

//export const fetchUnits = (path,cb) => fetcher(path, cb);

export const fetchCollections = (data,col) => {
    console.log("--FetchCollection--");
    data.data.forEach((u,i) => {
        let path = `${u.id}/collections/`;
        fetchUnits(path,cb => {
                if(cb.length === 0)
                    return;
                u["number"] = cb[0].collection.properties.number || "?";
                u["part"] = cb[0].name || "?";
                col(data)
            }
        )
    })
}


