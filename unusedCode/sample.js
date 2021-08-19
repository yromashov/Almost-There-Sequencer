import classNames from "https://cdn.skypack.dev/classnames/bind";
import * as Tone from "tone";

const makeSynths = (count) => {

  const synths = [];


  for (let i = 0; i < count; i++) {

    let synth = new Tone.Synth({
      oscillator: {
        type: "square8"
      }
    }).toDestination();
   
   
    synths.push(synth);
  }

  return synths;
};

const makeGrid = (notes) => {

  const rows = [];

  for (const note of notes) {

    const row = [];

    for (let i = 0; i < 8; i++) {
      row.push({
        note: note,
        isActive: false
      });
    }
    rows.push(row);
  }

  return rows;
};

const synths = makeSynths(6);


const notes = ["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"];
let grid = makeGrid(notes);
let beat = 0;
let playing = false;
let started = false;

const configLoop = () => {

  const repeat = (time) => {
    grid.forEach((row, index) => {
      let synth = synths[index];
      let note = row[beat];
      if (note.isActive) {
        synth.triggerAttackRelease(note.note, "8n", time);
      }
    });

    beat = (beat + 1) % 8;
  };

  Tone.Transport.bpm.value = 120;
  Tone.Transport.scheduleRepeat(repeat, "8n");
};

const makeSequencer = () => {
  const sequencer = document.getElementById("sequencer");
  grid.forEach((row, rowIndex) => {
    const seqRow = document.createElement("div");
    seqRow.id = `rowIndex`;
    seqRow.className = "sequencer-row";

    row.forEach((note, noteIndex) => {
      const button = document.createElement("button");
      button.className = "note"
      button.addEventListener("click", function(e) {
        handleNoteClick(rowIndex, noteIndex, e);
      });

      seqRow.appendChild(button);
    });

    sequencer.appendChild(seqRow);
  });
};

const handleNoteClick = (clickedRowIndex, clickedNoteIndex, e) => {
  grid.forEach((row, rowIndex) => {
    row.forEach((note, noteIndex) => {
      if (clickedRowIndex === rowIndex && clickedNoteIndex === noteIndex) {
        note.isActive = !note.isActive;
        e.target.className = classNames(
          "note", 
          { "note-is-active": !!note.isActive }, 
          { "note-not-active": !note.isActive }
        );
      }
    });
  });
};

const configPlayButton = () => {
  const button = document.getElementById("play-button");
  button.addEventListener("click", (e) => {
    if (!started) {
      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001)
      configLoop();
      started = true;
    }

    if (playing) {
      e.target.innerText = "Play";
      Tone.Transport.stop();
      playing = false;
    } else {
      e.target.innerText = "Stop";
      Tone.Transport.start();
      playing = true;
    }
  });
};


window.addEventListener("DOMContentLoaded", () => {
  configPlayButton();
	makeSequencer();
});