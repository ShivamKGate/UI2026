console.log("Hello!  This is your javascript file."); 

const today = "2026-08-31";

// array of journal entries
const journalEntries = [
    {
        date: "2026-08-28",
        sleepHours: 6,
        moods: ["anxious","tired"],
        notes: "tough day today since I was tired most of the time."
    },
    {
        date: "2026-08-29",
        sleepHours: 8,
        moods: ["energetic","motivated"],
        notes: "great day today, I was able to complete my work properly!"
    },
    {
        date: "2026-08-30",
        sleepHours: 7,
        moods: ["calm","tired"],
        notes: "felt kinda tired today, but I was able to complete my tasks on time."
    },
    { 
        date: today,
        sleepHours: 0,
        moods: [],
        notes: ""
    }
];

// logging the journal entries and the number of entries
console.log("Journal entries:", journalEntries);
console.log("Number of entries:", journalEntries.length);

// getting the elements from the DOM to update the summary
const avgSleepElement = document.getElementById("avg-sleep");
const moodCountsElement = document.getElementById("mood-counts");
const sleepInput = document.getElementById("sleep-hours");
const moodCheckboxes = document.querySelectorAll('input[name="mood"]');
const notesInput = document.getElementById("journal-notes");
const saveButton = document.getElementById("save-button");
const clearButton = document.getElementById("clear-button");

// function to get the today's journal entry
function getTodayEntry() {
    for (let i = 0; i < journalEntries.length; i++) {
        if (journalEntries[i].date === today) {
            return journalEntries[i];
        }
    }
    return null;
}    

// function to update the summary of the journal entries
function updateSummary() {
    // computing total sleep and count entries with sleep > 0
    let totalSleep = 0;
    let sleepCount = 0;

    // looping through the journal entries
    for (let i = 0; i < journalEntries.length; i++) {
        if (journalEntries[i].sleepHours > 0) {
            totalSleep += journalEntries[i].sleepHours;
            sleepCount++;
        }
    }

    // calculating average sleep
    const avgSleep = sleepCount > 0 ? totalSleep / sleepCount : 0;

    // counting mood days
    const moodCounts = {
        energetic: 0,
        anxious: 0,
        motivated: 0,
        tired: 0,
        calm: 0
    };

    // looping through the journal entries to count the number of days for each mood
    for (let i = 0; i < journalEntries.length; i++) {
        const moods = journalEntries[i].moods;
        for (let j = 0; j < moods.length; j++) {
            const mood = moods[j];
            if (moodCounts[mood] !== undefined) {
                moodCounts[mood]++;
            }
        }
    }

    // updating the page
    avgSleepElement.textContent = `Average sleep: ${avgSleep.toFixed(1)} hours`;

    moodCountsElement.textContent =
        `Mood counts: Energetic: ${moodCounts.energetic}, Anxious: ${moodCounts.anxious}, ` +
        `Motivated: ${moodCounts.motivated}, Tired: ${moodCounts.tired}, Calm: ${moodCounts.calm}`;
}

// event listener to update the sleep hours
sleepInput.addEventListener("input", function() {
    const todayEntry = getTodayEntry();
    todayEntry.sleepHours = parseFloat(sleepInput.value);
    updateSummary();
});

// event listener to update the moods
moodCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", function() {
        const todayEntry = getTodayEntry();
        const mood = checkbox.value;

        if (checkbox.checked) {
            // adding mood if not already in array
            if (!todayEntry.moods.includes(mood)) {
                todayEntry.moods.push(mood);
            }
        } else {
            // removing mood when unchecked
            todayEntry.moods = todayEntry.moods.filter(function(m) {
                return m !== mood;
            });
        }
        updateSummary();
    });
});

// event listener to save the journal entry
saveButton.addEventListener("click", function() {
    const todayEntry = getTodayEntry();
    todayEntry.notes = notesInput.value;
    console.log("Saved today's entry:", todayEntry);
});

// event listener to clear the journal entry
clearButton.addEventListener("click", function() {
    const todayEntry = getTodayEntry();

    // resetting today's data in the array
    todayEntry.sleepHours = 0;
    todayEntry.moods = [];
    todayEntry.notes = "";

    // resetting the form on the page
    sleepInput.value = "";
    notesInput.value = "";
    moodCheckboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });

    // refreshing the summary
    updateSummary();
});


updateSummary();