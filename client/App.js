import React, { Component } from "react";
import * as Tone from "tone";

function App() {
  function playNote() {
    const buffer = new Tone.Buffer(
      "https://cdn.mos.musicradar.com/audio/samples/drumnbass-demo-loops/DnBk1BassA170C-01.mp3"
    );
    const bass = new Tone.Player(
      "https://cdn.mos.musicradar.com/audio/samples/drumnbass-demo-loops/DnBk1BassA170C-01.mp3"
    ).toDestination();
    bass.reverse = true;
    const chordEvent2 = new Tone.ToneEvent((bass.start().loop = true));
    // synth.reverse = true;
    // const chordEvent = new Tone.ToneEvent((synth.start().loop = true));

    // start the chord at the beginning of the transport timeline
    // chordEvent.start();
    chordEvent2.start();

    // Tone.Transport.start();
    // const seq = new Tone.Sequence(
    //   (time, note) => {
    //     synth.triggerAttackRelease(note, 0.1, time);
    //     // subdivisions are given as subarrays
    //   },
    //   ["C4", ["E4", "D4", "E4"], "G4", ["A4", "E4"]]
    // ).start(0);
  }

  function stopNote() {
    chordEvent2.stop();
  }
  // startNote() {
  //   Tone.Transport.start();
  // }

  return (
    <div id="app">
      <div className="wrapper">
        <div className="box" onClick={() => playNote()}></div>
        <div className="box" onClick={() => stopNote()}></div>
        {/* <div className="box" onClick={() => this.playNote("C")}></div>
          <div className="box" onClick={() => this.playNote("C")}></div>
          <div className="box" onClick={() => this.playNote("C")}></div>
          <div className="box" onClick={() => this.playNote("C")}></div>  */}
      </div>
    </div>
  );
}

export default App;
