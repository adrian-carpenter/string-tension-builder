export type TTemplate = {
    note: string
    octave: number
}

export const INSTRUMENT_TEMPLATES: {
  [key: string] : TTemplate[]
} = {
    guitar: [
      {
        note: 'A',
        octave: 4
      }, {
        note: 'E',
        octave: 4
      }, {
        note: 'B',
        octave: 3
      }, {
        note: 'G',
        octave: 3
      }, {
        note: 'D',
        octave: 3
      }, {
        note: 'A',
        octave: 2
      }, {
        note: 'E',
        octave: 2
      }, {
        note: 'B',
        octave: 1
      }, {
        note: 'F#/Gb',
        octave: 1
      }, {
        note: 'C#/Db',
        octave: 1
      }, {
        note: 'G#/Ab',
        octave: 0
      }, {
        note: 'D#/Eb',
        octave: 0
      }, {
        note: 'A#/Bb',
        octave: -1
      }, {
        note: 'F',
        octave: -1
      }, {
        note: 'C',
        octave: -1
      }
    ],
    bass: [
      {
        note: 'D#/Eb',
        octave: 4
      }, {
        note: 'A#/Bb',
        octave: 3
      }, {
        note: 'F',
        octave: 3
      }, {
        note: 'C',
        octave: 3
      }, {
        note: 'G',
        octave: 2
      }, {
        note: 'D',
        octave: 2
      }, {
        note: 'A',
        octave: 1
      }, {
        note: 'E',
        octave: 1
      }, {
        note: 'B',
        octave: 0
      }, {
        note: 'F#/Gb',
        octave: 0
      }, {
        note: 'C#/Db',
        octave: 0
      }, {
        note: 'G#/Ab',
        octave: -1
      }, {
        note: 'D#/Eb',
        octave: -1
      }, {
        note: 'A#/Bb',
        octave: -2
      }, {
        note: 'F',
        octave: -2
      }, {
        note: 'C',
        octave: -2
      }
    ]
  }
  