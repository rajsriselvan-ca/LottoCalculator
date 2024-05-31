function getNextLottoDraw(date) { // This function will return the upcomming draw date.

    const dayOfWeek = date.getDay(); // dayOfWeek = day of the week 0 - 6 (sun - sat)
    const hour = date.getHours(); // hour as per pm/am 
    const minute = date.getMinutes(); // Mins as mins

    let nextDraw = new Date(date);
    if (dayOfWeek === 3) { // On Wednesday
        if (hour < 20 || (hour === 20 && minute === 0)) {
            nextDraw.setHours(20, 0, 0, 0);
        } else {
            nextDraw.setDate(nextDraw.getDate() + 3); // Next draw is Saturday
            nextDraw.setHours(20, 0, 0, 0);
        }
    } else if (dayOfWeek === 6) { // On Saturday
        if (hour < 20 || (hour === 20 && minute === 0)) {
            nextDraw.setHours(20, 0, 0, 0);
        } else {
            nextDraw.setDate(nextDraw.getDate() + 4); // Next draw is Wednesday
            nextDraw.setHours(20, 0, 0, 0);
        }
    } else {
        let daysToAdd;
        if (dayOfWeek < 3) { // Before Wednesday
            daysToAdd = 3 - dayOfWeek;
        } else { // After Wednesday
            daysToAdd = 6 - dayOfWeek;
        }
        nextDraw.setDate(nextDraw.getDate() + daysToAdd);
        nextDraw.setHours(20, 0, 0, 0);
    }
    return nextDraw;
}

function calculateDrawDates() {
    
    const input = document.getElementById('datetime-input').value;
    const inputDate = new Date(input);
    // If no input throw an alert message
    if (isNaN(inputDate)) {
        alert('Please enter a valid date and time.');
        return;
    }
    const resultsTable = document.getElementById('results-table').querySelector('tbody');
    resultsTable.innerHTML = ''; // Clear previous results

    const draws = [];
    let nextDrawDate = getNextLottoDraw(inputDate);
    var counterForFutureWednesday = 0;
    var counterForFutureSaturday = 1;
    var counterForPastWednesday = -1;
    var counterForPastSaturday = -1;
    for (let i = -2; i <= 2; i++) {
        let currentDrawDate = new Date(nextDrawDate); // Using the next draw date to predict future and past dates.
        if (i < 0) {
            // Checking if the next draw date is wednesday or saturday ( 3 = wednesday , else => 6 = saturday )
            if(nextDrawDate.getDay() === 3) { // Condition for Past 2 dates prediction
                currentDrawDate.setDate(nextDrawDate.getDate() + counterForPastWednesday + i  * 3);
            } else {
                currentDrawDate.setDate(nextDrawDate.getDate() + counterForPastSaturday + i  * 3);
                counterForPastSaturday = 0;
            }
        } else if(i > 0) {
            if(nextDrawDate.getDay() === 3) { // Condition for future 3 dates prediction
                currentDrawDate.setDate(nextDrawDate.getDate() + counterForFutureWednesday + i * 3);
                counterForFutureWednesday++;
            } else {
                currentDrawDate.setDate(nextDrawDate.getDate() + counterForFutureSaturday  + i * 3);
            }
        }

        draws.push({
            date: currentDrawDate,
            status: currentDrawDate < inputDate ? 'Past' : 'Future'
        });
    }

    function dateFormater (dateIncoming) {
        const date = new Date(dateIncoming);
        // Extract the day, month, and year
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();

        // Formating the date into DD/MM/YYYY
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    }
    
    // Loop it through the table element
    draws.forEach(draw => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const statusCell = document.createElement('td');
        console.log("p---", draw.date)
        dateCell.textContent = dateFormater(draw.date.toDateString());
        statusCell.textContent = draw.status;

        row.appendChild(dateCell);
        row.appendChild(statusCell);
        row.classList.add('fade-in');
        resultsTable.appendChild(row);
    });
}
