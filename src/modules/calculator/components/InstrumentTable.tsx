import React, { useMemo } from 'react'
import { useStoreState, useStoreActions } from "../store/calculator.store";
import { Column } from "react-table";
import { TString } from "../calculator.models";
import { BaseTable } from "../../shared/components/BaseTable";
import { ScaleLengthCell } from './cells/ScaleLengthCell';
import { NoteCell } from './cells/NoteCell';
import { OctaveCell } from './cells/OctaveCell';
import { GaugeCell } from './cells/GaugeCell';
import { BreakingPointCell } from './cells/BreakingPointCell';
import { Button, Card, CardBody } from 'reactstrap';


export const InstrumentTable = () => {
    const strings = useStoreState(state => state.instrument.strings)
    const removeString = useStoreActions(actions => actions.instrument.removeString)
    const addString = useStoreActions(actions => actions.instrument.addString)
    const columns = useMemo((): Column<TString>[] => [
        {
            id: 'number',
            Header: 'No.',
            accessor: 'number',
        },
        {
            id: "scaleLength",
            Header: 'Scale Length (Inch)',
            accessor: "scaleLength",
            Cell: ScaleLengthCell
        },
        {
            id: "note",
            Header: 'Note',
            accessor: 'note',
            Cell: NoteCell
        },
        {
            id: "octave",
            Header: 'Octave',
            accessor: 'octave',
            Cell: OctaveCell
        },
        {
            id: "gauge",
            Header: 'Gauge',
            accessor: 'gauge',
            Cell: GaugeCell
        },
        {
            id: "brand",
            Header: 'Brand',
            accessor: 'brand',
        },
        {
            id: "tension",
            Header: 'Tension (lbs)',
            accessor: 'tension',
        },
        {
            id: "breakingPoint",
            Header: 'Breaking Point (lbs)',
            accessor: "breakingPoint",
            Cell: BreakingPointCell
        },
        {
            id: "frequency",
            Header: 'Frequency (hz)',
            accessor: row => row.frequency.toFixed(2),
        },
    ], [])
    return (
        <Card>
            <CardBody>
                <BaseTable columns={columns} data={strings} />
                <Button onClick={() => removeString()} color="danger" className="float-left ml-2 mt-2" disabled={strings.length === 0}>
                    Remove String
                </Button>
                <Button onClick={() => addString()} color="success" className="float-left ml-2 mt-2">
                    Add String
                </Button>
            </CardBody>
        </Card>
    )
}