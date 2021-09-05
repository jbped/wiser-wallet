let db;

// Open connection with IndexedDb Budget database version 1
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    // Create new table called new_transaction
    db.createObjectStore("new_transaction", { autoIncrement: true });
}

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        uploadTransaction();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode)
}

function saveRecord(record) {
    // open new transaction with db with read and write perms
    const transaction = db.transaction(["new_transaction"], "readwrite");

    // access object store
    const transactionObjStore = transaction.objectStore("new_transaction");

    // Add new record to transaction Obj Store
    transactionObjStore.add(record)
}


function uploadTransaction() {
    const transaction = db.transaction(["new_transaction"], "readwrite");

    const transactionObjStore = transaction.objectStore("new_transaction");

    const getAll = transactionObjStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // open one more transaction
                    const transaction = db.transaction(["new_transaction"], "readwrite");
                    // access the new_transaction object store
                    const transactionObjStore = transaction.objectStore("new_transaction");
                    // clear all items in store
                    transactionObjStore.clear();

                    console.log("All saved transactions has been submitted!");
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}

window.addEventListener("online", uploadTransaction);