// Array of inspirational quotes
const quotes = [
"Small progress is still progress.",
"Stay focused. Stay determined.",
"The expert in anything was once a beginner.",
"Dream big. Study smart.",
"Success starts with consistency.",
"You are capable of amazing things.",
"Today's effort creates tomorrow's success."
];

// Function to display a new random quote
function newQuote(){
    const quote=document.getElementById("quote");
    if(!quote) return;
    quote.textContent=
    quotes[Math.floor(Math.random()*quotes.length)];
}

newQuote(); // Display a random quote on page load

const quote = document.getElementById("quote"); // Get the quote element

// If the quote element exists, set its text content to a random quote
if (quote) {
    quote.textContent =
    quotes[Math.floor(Math.random()*quotes.length)];
}

// Set the progress value, this is dynamically set based on the user's progress in the application. For demonstration, it's hardcoded to 70%.
let progress=70;

const progressBar = document.getElementById("progressBar"); // Get the progress bar element

// If the progress bar element exists, update its width and text content based on the progress value
if (progressBar) {
    progressBar.style.width = progress + "%";
    progressBar.textContent = progress + "%";
}

// Set the number of tasks, hours, and exams. These values are dynamically set based on the user's data. For demonstration, they are hardcoded.
const tasks = document.getElementById("tasks");
if (tasks) tasks.textContent = 6;

const hours = document.getElementById("hours");
if (hours) hours.textContent = 4;

const exams = document.getElementById("exams");
if (exams) exams.textContent = 2;

let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

displaySubjects();

function addSubject(){
    let subject = document.getElementById("subject").value;
    let examDate = document.getElementById("examDate").value;
    let difficulty = document.getElementById("difficulty").value;

    if(subject=="" || examDate==""){
        alert("Please fill everything.");
        return;
    }

    subjects.push({
        subject,
        examDate,
        difficulty
    });

    saveSubjects();

}

function saveSubjects(){
    localStorage.setItem("subjects", JSON.stringify(subjects));
    displaySubjects();
}

function deleteSubject(index){
    subjects.splice(index,1);
    saveSubjects();
}

function displaySubjects(){
    let table = document.getElementById("tableBody");
    if(!table) return;
    table.innerHTML="";

    subjects.forEach((item,index)=>{
        table.innerHTML +=`
        <tr>

        <td>${item.subject}</td>
        <td>${item.examDate}</td>
        <td>${item.difficulty}</td>

        <td>
            <button onclick="editSubject(${index})">
            ✏️
            </button>
        </td>

        <td>
            <button onclick="deleteSubject(${index})">
            ❌
            </button>
        </td>

        </tr>
        `;
    });
}


function generatePlan(){
    let table = document.getElementById("aiTable");
    if(!table) return;


    table.innerHTML="";

    if(subjects.length === 0){
        alert("Add subjects first!");
        return;
    }


    let schedule=[];


    subjects.forEach(subject=>{
        let sessions = 1;

        if(subject.difficulty === "Medium"){
            sessions = 2;
        }

        if(subject.difficulty === "Hard"){
            sessions = 3;
        }

        for(let i=0;i<sessions;i++){
            schedule.push(subject.subject);
        }

    });

    const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
    ];

    function generatePlan(){
        subjects = JSON.parse(localStorage.getItem("subjects")) || [];
        let table = document.getElementById("aiTable");
        if(!table) return;
        table.innerHTML="";
    }

    schedule.forEach((subject,index)=>{
        let day = days[index % days.length];

        let focus = "Review notes";

        if(index % 3 === 0){
            focus="Practice questions";
        }

        else if(index % 3 === 1){
            focus="Learn concepts";
        }

        table.innerHTML +=`
        <tr>
        <td>${day}</td>
        <td>${subject}</td>
        <td>${focus}</td>
        </tr>
        `;

    });

}

function loadProgress() {
    const chartCanvas = document.getElementById("studyChart");
    if (!chartCanvas) return;
    document.getElementById("subjectCount").textContent = subjects.length;

    let totalSessions = 0;
    const labels = [];
    const data = [];

    subjects.forEach(subject => {
        let sessions = 1;
        if (subject.difficulty === "Medium")
            sessions = 2;
        if (subject.difficulty === "Hard")
            sessions = 3;

        totalSessions += sessions;

        labels.push(subject.subject);
        data.push(sessions);

    });

    document.getElementById("sessionCount").textContent = totalSessions;

    new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Recommended Study Sessions",
                data: data
            }]

        },

        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false

                }

            }

        }

    });

}

loadProgress();

let timeLeft = 1500;
let timerInterval;

function updateTimer(){
    const timer = document.getElementById("timer");
    if(!timer) return;

    const minutes = Math.floor(timeLeft/60);
    const seconds = timeLeft%60;

    timer.textContent =
        `${minutes}:${seconds.toString().padStart(2,"0")}`;

}

function startTimer(){

        playMusic();

    if(timerInterval) return;
    timerInterval = setInterval(()=>{

        if(timeLeft>0){
            timeLeft--;
            updateTimer();
        }else{

            clearInterval(timerInterval);
            timerInterval = null;
            alert("🎉 Study session complete!");
        }
    },1000);

}

function resetTimer(){
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 1500;
    updateTimer();
}

updateTimer();

// =========================
// DARK MODE
// =========================

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
}

function updateThemeButton(){
    const btn=document.getElementById("themeBtn");
    if(!btn) return;

    if(document.body.classList.contains("dark")){
        btn.textContent="🌙";
    }

    else{
        btn.textContent="☀️";
    }

}

if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark");
}

updateThemeButton();
function toggleTheme(){
    document.body.classList.toggle("dark");
    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
    }

    else{
        localStorage.setItem("theme","light");
    }
    updateThemeButton();
}

function loadBadges(){
    const badgeBox=document.getElementById("badges");
    if(!badgeBox) return;

    badgeBox.innerHTML="";

    if(subjects.length>=1){
        badgeBox.innerHTML+=`
        <div class="badge">
        🎓 First Subject Added
        </div>`;
    }

    if(subjects.length>=5){
        badgeBox.innerHTML+=`
        <div class="badge">
        📚 Study Master
        </div>`;
    }

    let hardCount=subjects.filter(s=>s.difficulty==="Hard").length;

    if(hardCount>=3){
        badgeBox.innerHTML+=`
        <div class="badge">
        💪 Challenge Accepted
        </div>`;
    }

}
loadBadges();

function updateLevel(){
    const levelBar=document.getElementById("levelBar");
    if(!levelBar) return;

    let xp=subjects.length*20;

    if(xp>100) xp=100;
    levelBar.style.width=xp+"%";
    levelBar.textContent=xp+"%";
}

updateLevel();
const challenges=[
"Study for 30 minutes",
"Complete one maths exercise",
"Revise one chapter",
"Take one practice test",
"Review your weakest subject",
"Teach someone something you learned today"
];

function dailyChallenge(){
    const challenge=document.getElementById("challenge");
    if(!challenge) return;

    const day=new Date().getDate();
    challenge.textContent=challenges[day%challenges.length];
}
dailyChallenge();

function searchSubjects(){
    let search=document.getElementById("search").value.toLowerCase();
    let rows=document.querySelectorAll("#tableBody tr");
    rows.forEach(row=>{
        let text=row.innerText.toLowerCase();
        row.style.display=text.includes(search)
        ?""
        :"none";
    });

}

function editSubject(index){
    const newName=prompt(
        "Edit subject:",
        subjects[index].subject
    );

    if(newName){
        subjects[index].subject=newName;
        saveSubjects();
    }
}

async function downloadPDF(){
const { jsPDF }=window.jspdf;

const doc=new jsPDF();

doc.text("StudyPilot AI Timetable",20,20);

let y=40;

subjects.forEach(subject=>{
doc.text(
`${subject.subject} - ${subject.examDate}`,
20,
y
);
y+=10;
});

doc.save("StudySchedule.pdf");

}


// =========================
// LOFI MUSIC PLAYER
// =========================


const songs = [
    {
        name:"Rainy Lofi",
        file:"music/lofi1.mp3"
    },

    {
        name:"Chill Study Beats",
        file:"music/lofi2.mp3"
    },

    {
        name:"Night Coding Lofi",
        file:"music/lofi3.mp3"
    }
];


let currentSong = 0;

const audio = new Audio();


function playMusic(){
    audio.src = songs[currentSong].file;
    audio.play();
    document.getElementById("songName").textContent =
    songs[currentSong].name;
}


function pauseMusic(){
    audio.pause();
}


function nextSong(){
    currentSong++;
    if(currentSong >= songs.length){
        currentSong = 0;
    }

    playMusic();

}


audio.addEventListener("ended",()=>{
    nextSong();
});

function loadDashboardCards(){
    const streak = document.getElementById("streakCount");
    const badge = document.getElementById("badgeCount");
    const exams = document.getElementById("examCount");


    if(streak){
        let days = localStorage.getItem("streak") || 0;

        streak.textContent =
        days + " Days";
    }


    if(badge){
        let badges = 0;
        if(subjects.length >= 1){
            badges++;
        }


        if(subjects.length >= 5){
            badges++;
        }


        badge.textContent =
        badges + " Earned";
    }


    if(exams){
        exams.textContent =
        subjects.length;
    }

}
loadDashboardCards();

function updateStreak(){
    let streak = localStorage.getItem("streak");
    if(!streak){

        streak = 1;
        localStorage.setItem("streak", streak);
    }
}
updateStreak();
