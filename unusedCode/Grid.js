import React, { useState } from "react";
import * as Tone from "tone";
import classNames from "classnames";

// Function which creates a 5x8 grid,
// with our chosen notes on the vertical axis
function GenerateGrid() {
  const grid = [];
  for (let i = 0; i < 4; i++) {
    let column = [
      { note: "A", isActive: false },
      { note: "B", isActive: false },
      { note: "C", isActive: false },
      { note: "E", isActive: false },
      { note: "G", isActive: false },
    ];
    grid.push(column);
  }
  return grid;
}

// Our chosen octave for our five notes. Try changing this for higher or lower notes
const CHOSEN_OCTAVE = "3";

export default function App() {
  // A nested array of objects is not performant, but is easier to understand
  // performance is not an issue at this stage anyway
  const [grid, setGrid] = useState(GenerateGrid());

  // Boolean to handle if music is played or not
  const [isPlaying, setIsPlaying] = useState(false);

  // Used to visualize which column is making sound
  const [currentColumn, setCurrentColumn] = useState(null);

  //Notice the new PolySynth in use here, to support multiple notes at once
  const vol = new Tone.Volume(-12).toDestination();
  const limiter = new Tone.Limiter(-12).toDestination();
  //   const synth = new Tone.PolySynth().connect(vol).connect(limiter);
  const amsynth = new Tone.PolySynth(Tone.AMSynth)
    .connect(vol)
    .connect(limiter);
  const fmsynth = new Tone.PolySynth(Tone.FMSynth)
    .connect(vol)
    .connect(limiter);
  //   const memsynth = new Tone.PolySynth(Tone.MembraneSynth)
  //     .connect(vol)
  //     .connect(limiter);
  const memsynth = new Tone.PolySynth(Tone.DuoSynth)
    .connect(vol)
    .connect(limiter);
  const [type, setType] = useState("amsynth");

  function handleNoteClick(clickedColumn, clickedNote) {
    let updatedGrid = grid.map((column, columnIndex) =>
      column.map((cell, cellIndex) => {
        let cellCopy = cell;

        if (columnIndex === clickedColumn && cellIndex === clickedNote) {
          cellCopy.isActive = !cell.isActive;
        }

        return cellCopy;
      })
    );

    setGrid(updatedGrid);
  }

  function settingState(e) {
    let targetValue = e.target.value;
    setType(targetValue);
  }

  const PlayMusic = async () => {
    let music = [];
    console.log(type);
    grid.map((column) => {
      let columnNotes = [];
      column.map(
        (shouldPlay) =>
          shouldPlay.isActive &&
          columnNotes.push(shouldPlay.note + CHOSEN_OCTAVE)
      );
      music.push(columnNotes);
    });

    await Tone.start();
    const Sequencer = new Tone.Sequence(
      (time, column) => {
        setCurrentColumn(column);
        amsynth.triggerAttackRelease(music[column], "8n", time);
      },
      [0, 1, 2, 3, 4, 5, 6, 7],
      "8n"
    );

    if (isPlaying) {
      setIsPlaying(false);
      setCurrentColumn(null);

      await Tone.Transport.stop();
      await Sequencer.stop();
      await Sequencer.clear();
      await Sequencer.dispose();

      return;
    }
    setIsPlaying(true);
    await Sequencer.start();
    await Tone.Transport.start();
  };

  return (
    <div className="main">
      <div id="type">
        <label>Type Of Sound:</label>
        <select onChange={settingState}>
          <option value={"amsynth"}>AM Synth</option>
          <option value={"fmsynth"}>FM Synth</option>
          <option value={"memsynth"}>Membrane Synth</option>
        </select>
      </div>
      <div className="wrapper">
        {grid.map((column, columnIndex) => (
          <div
            className={classNames("note-column", {
              "note-column--active": currentColumn === columnIndex,
            })}
            key={columnIndex + "column"}
          >
            {column.map(({ note, isActive }, noteIndex) => (
              <NoteButton
                note={note}
                isActive={isActive}
                onClick={() => handleNoteClick(columnIndex, noteIndex)}
                key={note + columnIndex}
              />
            ))}
          </div>
        ))}
      </div>
      <button className="play-button" onClick={() => PlayMusic()}>
        {isPlaying ? "Stop" : "Play"}
      </button>
    </div>
  );
}

const NoteButton = ({ note, isActive, ...rest }) => {
  const classes = isActive ? "box box--active" : "box";
  return (
    <button className={classes} {...rest}>
      {note}
    </button>
  );
};
