var existingPesels = [],
    data = [],
    sortHistory = [1, 1, 1, 1],
    numberOfPages = 1,
    currentPage = 1;

// Funkcja losująca imię
function randomFirstName() {
    var numberOfLetters = Math.floor((Math.random() * 11) + 3);
    var letters = "ABCDEFGHIJKLMNOPRSTUWYZ";
    var firstName = "";

    for (var i = 0; i < numberOfLetters; i++) {
        if (i != 0) firstName += (letters.charAt(Math.floor(Math.random() * letters.length))).toLocaleLowerCase();
        else firstName += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    return firstName;
}

// Funkcja losująca nazwisko
function randomLastName() {
    var numberOfLetters = Math.floor((Math.random() * 17) + 3);
    var letters = "ABCDEFGHIJKLMNOPRSTUWYZ";
    var lastName = "";

    for (var i = 0; i < numberOfLetters; i++) {
        if (i != 0) lastName += (letters.charAt(Math.floor(Math.random() * letters.length))).toLocaleLowerCase();
        else lastName += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    return lastName;
}

// Funkcja losująca datę urodzenia
function randomBirthDate() {
    var year, month, day, isLeapYear;

    year = Math.floor(Math.random() * 71) + 1930;
    // Czy rok jest przestępny
    isLeapYear = (year % 4 == 0 && year % 100 != 0 || year % 400 == 0);
    month = Math.floor(Math.random() * 12) + 1;

    // Losuję dzień dla miesięcy 31-dniowych    
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        day = Math.floor(Math.random() * 31) + 1;
        // Losuję dzień dla miesięcy 30-dniowych
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
        day = Math.floor(Math.random() * 30) + 1;
        // Losuję dzień dla lutego
    } else {
        if (isLeapYear) day = Math.floor(Math.random() * 29) + 1;
        else day = Math.floor(Math.random() * 28) + 1;
    }
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    return month + "/" + day + "/" + year;
}

// Funkcja generująca PESEL
function setPesel(person) {
    var month = person.birthDate.substring(0, 2);
    var day = person.birthDate.substring(3, 5);
    var year = person.birthDate.substring(8, 10);
    var pesel = "";

    pesel = year + month + day;
    // Generuję 5 losowych liczb i dopisuję je do numeru pesel
    for (var i = 0; i < 5; i++) pesel += Math.floor(Math.random() * 10);

    // Jeżeli pesel już istnieje, generuję nowy
    while (existingPesels.indexOf(pesel) != -1) {
        for (i = 0; i < 5; i++) pesel += Math.floor(Math.random() * 10);
    }

    person.pesel = pesel;
    existingPesels.push(pesel);
    return pesel;
}

// Funkcja generująca rekordy tabeli
function generateData() {
    for (var i = 0; i < 200; i++) {
        data[i] = new Person(randomFirstName(), randomLastName(), randomBirthDate(), "");
        setPesel(data[i]);
        // Zapisuję dane do session storage
        sessionStorage.setItem(currentPage + "p" + i, JSON.stringify(data[i]));
    }
}

// Funkcja wypisująca dane do tabeli
function renderData() {
    var table = document.getElementById("main-table-body");
    var len = table.getElementsByTagName("tr").length;
    //Czyszczę zawartość tabeli przed wyrenderowaniem nowej
    clearTable(len);

    for (var i = 0; i < 200; i++) {
        var row = table.insertRow(i);
        if (i % 2 == 0) row.className = "grey-row";
        else row.className = "white-row";
        var cFirstName = row.insertCell(0),
            cLastName = row.insertCell(1),
            cBirthDate = row.insertCell(2),
            cPesel = row.insertCell(3);

        // Pobieram dane dla danej strony z session storage
        cFirstName.innerHTML = JSON.parse(sessionStorage.getItem(currentPage + "p" + i)).firstName;
        cLastName.innerHTML = JSON.parse(sessionStorage.getItem(currentPage + "p" + i)).lastName;
        cBirthDate.innerHTML = JSON.parse(sessionStorage.getItem(currentPage + "p" + i)).birthDate;
        cPesel.innerHTML = JSON.parse(sessionStorage.getItem(currentPage + "p" + i)).pesel;

        cFirstName.className = "cell-first-name";
        cLastName.className = "cell-last-name";
        cBirthDate.className = "cell-birth-date";
        cPesel.className = "cell-pesel";
        document.getElementById("current-page").innerHTML = currentPage;
    }
}

// Funkcja sortująca
function sortTable(columnId) {
    currentPage = 1;
    renderData();
    var table, rows, flag, i, x, y, shouldSwitch;
    table = document.getElementById("main-table-body");
    flag = true;

    // Sortowanie rosnące
    if (sortHistory[columnId] % 2 != 0) {
        while (flag) {
            flag = false;
            rows = table.getElementsByTagName("tr");
            for (i = 0; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("td")[columnId];
                y = rows[i + 1].getElementsByTagName("td")[columnId];
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                flag = true;
            }
        }
        sortHistory[columnId]++;
        // Sortowanie malejące
    } else {
        while (flag) {
            flag = false;
            rows = table.getElementsByTagName("tr");
            for (i = 0; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("td")[columnId];
                y = rows[i + 1].getElementsByTagName("td")[columnId];
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                flag = true;
            }
        }
        sortHistory[columnId]++;
    }

}

// Funkcja sortująca daty
function sortByDate() {
    currentPage = 1;
    renderData();
    var rows, flag = true,
        i, x, y, shouldSwitch, table = document.getElementById("main-table-body");
    // Sortowanie rosnące
    if (sortHistory[2] % 2 != 0) {
        while (flag) {
            flag = false;
            rows = table.getElementsByTagName("tr");
            for (i = 0; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("td")[2];
                y = rows[i + 1].getElementsByTagName("td")[2];
                if (x.innerHTML.substring(6, 10) > y.innerHTML.substring(6, 10)) {
                    shouldSwitch = true;
                    break;
                }
                if (x.innerHTML.substring(6, 10) == y.innerHTML.substring(6, 10)) {
                    if (x.innerHTML.substring(0, 2) > y.innerHTML.substring(0, 2)) {
                        shouldSwitch = true;
                        break;
                    }
                    if (x.innerHTML.substring(0, 2) == y.innerHTML.substring(0, 2)) {
                        if (x.innerHTML.substring(3, 5) > y.innerHTML.substring(3, 5)) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                flag = true;
            }
        }
        sortHistory[2]++;
        // Sortowanie malejące
    } else {
        while (flag) {
            flag = false;
            rows = table.getElementsByTagName("tr");
            for (i = 0; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("td")[2];
                y = rows[i + 1].getElementsByTagName("td")[2];
                if (x.innerHTML.substring(6, 10) < y.innerHTML.substring(6, 10)) {
                    shouldSwitch = true;
                    break;
                }
                if (x.innerHTML.substring(6, 10) == y.innerHTML.substring(6, 10)) {
                    if (x.innerHTML.substring(0, 2) < y.innerHTML.substring(0, 2)) {
                        shouldSwitch = true;
                        break;
                    }
                    if (x.innerHTML.substring(0, 2) == y.innerHTML.substring(0, 2)) {
                        if (x.innerHTML.substring(3, 5) < y.innerHTML.substring(3, 5)) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                flag = true;
            }
        }
        sortHistory[2]++;
    }
}

// Funkcja filtrująca
function filter() {
    currentPage = 1;
    renderData();
    var td, i, j,
        input = document.getElementById("filter-input").value,
        table = document.getElementById("main-table-body"),
        rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        for (j = 0; j < 4; j++) {
            td = rows[i].getElementsByTagName("td")[j];
            if (td.innerHTML.toLowerCase().indexOf(input.toLowerCase()) > -1) {
                rows[i].style.display = "";
                break;
            } else rows[i].style.display = "none";
        }
    }
}

// Navigation
// Funkcja generująca nowy set danych
function generateNextPage() {
    numberOfPages++;
    generateData();
}

function nextPage() {
    currentPage++;
    document.getElementById("table-container").scrollTop = 0;
    if (currentPage > numberOfPages) {
        generateNextPage();
    }
    document.getElementById("current-page").innerHTML = currentPage;
    document.getElementById("number-of-pages").innerHTML = numberOfPages;
    renderData();
}

function previousPage() {
    if (currentPage > 1) {
        document.getElementById("table-container").scrollTop = 0;
        currentPage--;
        document.getElementById("current-page").innerHTML = currentPage;
        document.getElementById("number-of-pages").innerHTML = numberOfPages;
        renderData();
    }
}

function moveToFirstPage() {
    currentPage = 1;
    renderData();
}

function moveToLastPage() {
    currentPage = numberOfPages;
    renderData();
}

function clearTable(len) {
    var table = document.getElementById("main-table-body");
    for (var i = 0; i < len; i++) {
        table.deleteRow(0);
    }
}

