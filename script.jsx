// Getting necessary functions

const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;
const { createStore } = Redux;
const { Provider, useDispatch, useSelector } = ReactRedux;


// Creating a redux store
const initialState = { volume: 50, isMuted: false, description: ""};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_VOLUME":
            return { ...state, volume: action.payload };
        case "TOGGLE_MUTE":
            return { ...state, isMuted: !state.isMuted };
        case "DESCRIPTION":
            return { ...state, description: action.payload };
        default:
            return state;
    }
}
const store = createStore(reducer);


//main component
function Drum() {

    //sources of audio files
    const sources = ["https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-1.mp3",
    "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-2.mp3",
    "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-3.mp3",
    "http://codeskulptor-demos.commondatastorage.googleapis.com/descent/Crumble%20Sound.mp3",
    "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-6.mp3",
    "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Dsc_Oh.mp3",
    "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Kick_n_Hat.mp3",
    "https://cdn.freecodecamp.org/testable-projects-fcc/audio/RP4_KICK_1.mp3",
    "https://cdn.freecodecamp.org/testable-projects-fcc/audio/Cev_H2.mp3",
];
    // descriptions of the audio clips
    const names = ["Heater 1", "Heater 2", "Heater 3", "Crumble Sound", "Clap", "Open-HH", "Kick-n'-Hat", "Kick", "Closed-HH"];

    // corresponding letters for audio clips
    const letters = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];

    // Once the component mounts
    useEffect(() => {

        // check for keydowns and if there is a match click the appropriate button
        const handleKeyDown = (event) => {
            const letter = event.key.toUpperCase();
            const audio = document.getElementById(letter);
            if (audio) {
                const button = audio.parentElement;
                button.click();

                // show visually which button got clicked
                button.classList.add("active");
                setTimeout(() => {
                    button.classList.remove("active");
                }, 100);
            }
        };

        //attach the listener
        window.addEventListener("keydown", handleKeyDown);

        // detach the listener on unmount
        return (() => {
            window.removeEventListener("keydown", handleKeyDown);
        })
    },[]);
    return (
        <>
        <section id="triggers">
        {
            // create the pads with appropriate attributes and props
            names.map((name, i) => (
                <Drum_pad key={letters[i]} name = {name} letter = {letters[i]} source = {sources[i]} />
            ))
        }
        </section>
        <Controls />
        </>
        );
}

function Drum_pad({name, letter, source }) {
    // get Redux store data
    const isMuted = useSelector((state) => state.isMuted);
    const volume = useSelector((state) => state.volume);

    // call the dispatcher
    const dispatch = useDispatch();

    // get reference to the audio
    const audioRef = useRef(null);

    // based on changes in the volume and isMuted, change the values of the audio
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
            audioRef.current.volume = volume / 100;
        }
    }, [volume, isMuted]);

    const playAudio = () => {

        // find the parent button of the audio and get its id to show as description in the display box and then play the sound
        const audioElement = audioRef.current;
        const parent = audioElement.parentElement;
        dispatch({type: "DESCRIPTION", payload: parent.id });
        audioElement.play();
    }
    return (
        <button onClick={playAudio} className="drum-pad" id={name}>
            {letter}
            <audio ref={audioRef} className="clip"  id={letter} src={source} type="audio/mpeg" />
        </button>
    );
};

function Controls() {
    // getting data  from the storage
    const volume = useSelector((state) => state.volume);
    const description = useSelector((state) => state.description);
    const dispatch = useDispatch();
    const isMuted = useSelector((state) => state.isMuted);

    // changing the state of the volume
    const handleVolume = (event) => {
        dispatch({type: "SET_VOLUME", payload: event.target.value });
    }

    //change the state of the mute
    const handleToggle = () => {
        dispatch({type: "TOGGLE_MUTE"})
    }
    return (
        <section id="controls">
            <label htmlFor="volume">Volume {volume}</label>
            <input id="volume" type="range" min="0" max="100" step="1" value={volume} onChange={handleVolume} />
            <p id="display">{description}</p>
            <button id="mute" onClick={handleToggle}>{isMuted ? "The drum is deactivated" : "The drum is activated"}</button>
        </section>
    )
}


// Attach to the DOM
const root = createRoot(document.getElementById("drum-machine"));
root.render(<Provider store={store}><Drum /></Provider>);