import React from 'react'
import { Row } from 'react-table'
import { TString } from '../../calculator.models'
import { Input } from 'reactstrap'
import { useStoreActions } from '../../store/calculator.store'
import { initString } from '../../calculator.utils'

interface IProps {
    row: Row<TString>
}

const octaves = [8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2]

export const OctaveCell = (props: IProps) => {
    const updateString = useStoreActions(actions => actions.instrument.updateString)
    const updateStringNoteOctave = (octave: number) => {
        const newStateString = initString({ ...props.row.original, octave})
        updateString(newStateString)
    }
    return (
        <Input type="select" onChange={e => updateStringNoteOctave(+e.target.value)} value={props.row.original.octave}>
            {octaves.map((octave) => (
                <option key={octave} value={octave}>
                    {octave}
                </option>
            ))}
        </Input>
    )
}