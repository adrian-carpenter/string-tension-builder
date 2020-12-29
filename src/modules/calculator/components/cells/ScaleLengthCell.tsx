import React from 'react'
import { Row } from 'react-table'
import { Input } from 'reactstrap'
import { TString } from '../../calculator.models'
import { initString } from '../../calculator.utils'
import { useStoreActions } from '../../store/calculator.store'

interface IProps {
    row: Row<TString>
}

export const ScaleLengthCell = (props: IProps) => {
    const updateString = useStoreActions(actions => actions.instrument.updateString)
    const updateScaleLength = (scaleLengthString = "0") => {
        const newStateString = initString({ ...props.row.original, scaleLength: scaleLengthString })
        updateString(newStateString)
    }
    return (
        <Input pattern="[0-9]+([\.,][0-9]+)?" type="text" onChange={e => updateScaleLength(e.target.value)} value={props.row.original.scaleLength.toString()|| ''} />
    )
}