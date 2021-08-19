import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

export default function App2() {
  const [sound, setSound] = useState(
    new Tone.MonoSynth({
      oscillator: {
        type: 'square',
      },
      envelope: {
        attack: 2,
      },
    })
  );
  const [reset, toggleReset] = useState(false);
  const reverb = new Tone.Reverb(11);
  const effect = new Tone.PingPongDelay('2n').toDestination();
  const makeSynths = (count) => {
    const synths = [];
    let synth = sound.connect(effect).connect(reverb).toDestination();
    for (let i = 0; i < count; i++) {
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
          isActive: false,
        });
      }
      rows.push(row);
    }

    return rows;
  };

  const synths = makeSynths(6);
  const notes = ['A4', 'G4', 'F4', 'D4', 'Bb3', 'G2'];
  let grid = makeGrid(notes);
  let beat = 0;
  let playing = false;
  let started = false;
  const [grid1, setGrid] = useState(grid);

  // useEffect(() => {
  //   toggleReset(false)
  // }, [grid]);

  const configLoop = () => {
    const repeat = (time) => {
      grid.forEach((row, index) => {
        let synth = synths[index];
        let note = row[beat];

        if (note.isActive) {
          synth.triggerAttackRelease(note.note, '8n', time);
        }
      });

      beat = (beat + 1) % 8;
    };

    Tone.Transport.bpm.value = 200;
    Tone.Transport.scheduleRepeat(repeat, '8n');
  };

  const handleNoteClick = (clickedRowIndex, clickedNoteIndex, e) => {
    grid.forEach((row, rowIndex) => {
      row.forEach((note, noteIndex) => {
        if (clickedRowIndex === rowIndex && clickedNoteIndex === noteIndex) {
          note.isActive = !note.isActive;
          e.target.className = note.isActive
            ? 'note-is-active'
            : 'note-not-active';
        }
      });
    });
  };

  // const resetGrid = () => {
  //   setGrid([...grid]);
  //   grid.forEach((row) => {
  //     row.forEach((note) => {
  //       if (note.isActive) {
  //         note.isActive = false;
  //       }
  //     });
  //   });
  //   return grid;
  // };

  const settingState = (e) => {
    const targetValue = e.target.value;
    if (targetValue === 'FM') {
      setSound(
        new Tone.FMSynth({
          envelope: {
            attack: 0.5,
          },
        })
      );
    }
    if (targetValue === 'PolySynth') {
      setSound(new Tone.PolySynth());
    }
    if (targetValue === 'Mono') {
      setSound(
        new Tone.MonoSynth({
          oscillator: {
            type: 'sine',
          },
          envelope: {
            attack: 0.1,
          },
        })
      );
    }
    if (targetValue === 'Casio') {
      setSound(
        new Tone.Sampler({
          urls: {
            A2: 'A1.mp3',
            A3: 'A2.mp3',
          },
          baseUrl: 'https://tonejs.github.io/audio/casio/',
        })
      );
    }
  };

  return (
    <div id='app2'>
      <div id='title'>Almost There Sequencer</div>
      <div className='sequencer'>
        {grid.map((row, rowIndex) => {
          if (reset === true) {
            return (
              <div id='rowIndex' className='sequencer-row'>
                {row.map((note, noteIndex) => {
                  note.isActive = false;
                  return (
                    <button
                      className='note-not-active'
                      onClick={(e) => handleNoteClick(rowIndex, noteIndex, e)}
                    ></button>
                  );
                })}
              </div>
            );
          } else {
            return (
              <div id='rowIndex' className='sequencer-row'>
                {row.map((note, noteIndex) => {
                  return (
                    <button
                      className='note'
                      onClick={(e) => handleNoteClick(rowIndex, noteIndex, e)}
                    ></button>
                  );
                })}
              </div>
            );
          }
        })}
      </div>

      <button
        id='play-button'
        onClick={(e) => {
          if (!started) {
            Tone.start();
            Tone.getDestination().volume.rampTo(-10, 0.001);
            configLoop();
            started = true;
          }

          if (playing) {
            e.target.innerText = 'Play';
            Tone.Transport.stop();
            playing = false;
          } else {
            e.target.innerText = 'Stop';
            Tone.Transport.start();
            playing = true;
          }
        }}
      >
        Play
      </button>
      <button
        id='reset'
        onClick={() => {
          toggleReset(true);
        }}
      >
        Reset
      </button>
      <div id='selecting'>
        <label>Synth:</label>
        <select onChange={(e) => settingState(e)}>
          <option value='Mono'>Mono</option>
          <option value='FM'>FM</option>
          <option value='Casio'>Casio</option>
          <option value='PolySynth'>PolySynth</option>
        </select>
      </div>
    </div>
  );
}
