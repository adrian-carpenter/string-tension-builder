import React from 'react'
import { Row } from 'react-table'
import { TString } from '../../calculator.models'
import { breakingColor } from '../../calculator.utils'

interface IProps {
    row: Row<TString>
}

export const BreakingPointCell = (props: IProps) => (
    <span style={{ color: breakingColor(props.row.original.percentTension)}}>
        {props.row.original.breakingPoint} {'('}{props.row.original.percentTension.toFixed(2)}{')'}
    </span>
)