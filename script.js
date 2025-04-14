console.log("Hello, World!");
let currentSong = new Audio("");

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/Music/");
    let response = await a.text();
    // console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    console.log(as);
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/Music/")[1])
        }
    }
    return songs;
}

const playMusic = (track)=>{
    currentSong.src = "/Music/" + track;
    currentSong.play();
    play.src = "assets/play.svg";

    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

}

function convertToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0){
        return "Invalid input";
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}   

async function main() {


    let songs = await getSongs();
    // console.log(songs);

    let songul = document.querySelector(".listsongs").getElementsByTagName("ul")[0]

    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>  <img class="ulliimg" width="34" src="assets/pngsong.png" alt="">
                            <div class="songnaam">
                             <div> ${song.replaceAll("%20", " ")}</div>
                             <div>song harshit</div>
                             </div> </li>`;
    }

    Array.from(document.querySelector(".listsongs").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            console.log(e.querySelector("div").firstElementChild.innerHTML);
            playMusic(e.querySelector("div").firstElementChild.innerHTML.trim())
        })
    })

    //attach previous , play ,  next , 

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "assets/play.svg";
        } else {
            currentSong.pause();
            play.src =  "assets/midsongbar.svg";
        }
    })

    //time update

    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime , currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${convertToMinutesSeconds(currentSong.currentTime)}/${convertToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })

    //add event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click",e =>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = ((currentSong.duration)* percent)/100;
        
    })

}
main();


