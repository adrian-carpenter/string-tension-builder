import React from 'react'
import { Row } from 'react-table'
import { Input } from 'reactstrap'
import { TString } from '../../calculator.models'
import { initString } from '../../calculator.utils'
import { useStoreActions } from '../../store/calculator.store'

interface IProps {
    row: Row<TString>
}

export const GaugeCell = (props: IProps) => {
    const updateString = useStoreActions(actions => actions.instrument.updateString)
    const { gauge } = props.row.original
    const updateStringGauge = (gauge = "0") => {
        const newStateString = initString({ ...props.row.original, gauge })
        updateString(newStateString)
    }

    console.log(gauge, gauge.toString())
    // if longer than x.xxxx
    const uiValue = gauge.toString().length > 6 ? parseFloat(gauge).toFixed(4).replace(/0$/, '') :  gauge.toString()
    return (
        <Input pattern="[0-9]+([\.,][0-9]+)?"type="text" onChange={e => updateStringGauge(e.target.value)} value={uiValue} />
    )
}