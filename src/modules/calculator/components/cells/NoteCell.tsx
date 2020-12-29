import React from 'react'
import { Row } from 'react-table'
import { Input } from 'reactstrap'
import { TString } from '../../calculator.models'
import { initString } from '../../calculator.utils'
import { NOTE_OFFSET } from '../../constants/note_offset'
import { useStoreActions } from '../../store/calculator.store'

interface IProps {
    row: Row<TString>
}

export const NoteCell = (props: IProps) => {
    const updateString = useStoreActions(actions => actions.instrument.updateString)
    const updateStringNote = (note: string) => {
        const newStateString = initString({ ...props.row.original, note})
        updateString(newStateString)
    }
    const notes = Object.keys(NOTE_OFFSET)
    return (
        <Input type="select" onChange={e => updateStringNote(e.target.value)} value={props.row.original.note}>
            {notes.map((note) => (
                <option key={note} value={note}>
                    {note}
                </option>
            ))}
        </Input>
    )
}