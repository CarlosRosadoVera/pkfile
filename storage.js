
const SAV_OBJECT_STORE_NAME = 'sav';

function connectSavStorageDb() {
    return new Promise( (resolve, reject) => {
        const request = window.indexedDB.open('SAV_STORE', 1);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => console.log('open request is blocked...');
        request.onupgradeneeded = e => {
            const db = request.result;
            if (e.oldVersion < 1) {
                const store = db.createObjectStore(SAV_OBJECT_STORE_NAME, {autoIncrement: true});
                const labelVersion = store.createIndex("by_label", ["label"], {unique: true});
            }
        };
    });
}

function readAll(conn, objStoreName) {
    return new Promise( (resolve, reject) =>{
        const tx = conn.transaction(objStoreName);
        const objectStore = tx.objectStore(objStoreName);
        let request = objectStore.getAll();
        request.onsuccess = ev => resolve(request.result);
        request.onerror =  ev => reject(request.error);
    });
}

function add(conn, objStoreName, entry) {
    return new Promise((resolve, reject) => {
        const tx = conn.transaction(objStoreName, 'readwrite');
        const objectStore = tx.objectStore(objStoreName);
        const request = objectStore.add(entry);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

class SavStorage {

    getAllFiles() {
        return connectSavStorageDb().then(conn => readAll(conn, SAV_OBJECT_STORE_NAME));
        // return [
        //     {id:1, label: 'test', type: 'grey', country: 'US', generation: 1, modified: true},
        //     {id:2, label: 'other', type: 'yellow', country: 'US', generation: 1, modified: false}
        // ];
    }

    addFile(file) {
        if (file.label === undefined ||
            file.version === undefined  ||
            file.country === undefined ||
            file.trainerName === undefined ||
            file.trainerId === undefined ||
            file.data === undefined ||
            file.generation === undefined) {
            Promise.reject("missing field, one of " +
                "label/type/country/generation/data/trainerName/trainerId" +
                " is missing from entry. " + file);
        } else {
            return connectSavStorageDb().then(conn => add(conn, SAV_OBJECT_STORE_NAME, {
                label: file.label,
                trainerName: file.trainerName,
                trainerId:  file.trainerId,
                version: file.version,
                country: file.country,
                generation: file.generation,
                modified: false,
                data: file.data
            }));
        }
    }

    removeFile(id) {
    }
}