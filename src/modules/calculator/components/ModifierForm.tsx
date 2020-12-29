import React from 'react'
import { Button, Card, CardBody, Input, Table } from 'reactstrap'
import { BRANDS } from '../constants/brands'
import { useStoreActions, useStoreState } from '../store/calculator.store'

const woundThirdOptions = [
    {
        name: 'Wound at .017',
        value: 'w3@17'
    },
    {
        name: 'Wound starts .021',
        value: 'w3@21'
    },
    {
        name: 'Wound till .026',
        value: 'w3@26'
    },
]

const tensileOptions = [350000, 400000, 450000]

export const ModifiedForm = () => {
    const modifyInstrument = useStoreActions(actions => actions.instrument.modifyInstrument)
    const modifiers = useStoreState(state => state.instrument.modifiers)

    const clearModifiers = () => {
        modifyInstrument({
            minScaleLength: 0,
            maxScaleLength: 0,
            minTension: 0,
            maxTension: 0,
            brand: 'DANW',
            woundThird: 'w3@21',
            tensile: 400000
        })
    }

    return (
        <Card>
            <CardBody>
            <h4 className="float-left">Modifiers</h4>
                <Table dark>
                    <tbody>
                        <tr>
                            <th>Min Scale</th>
                            <th>Max Scale</th>
                            <th>Min Tension (lbs)</th>
                            <th>Max Tension (lbs)</th>
                            <th>Brand</th>
                            <th>Wound 3rd</th>
                            <th>Tensile Strength</th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>
                                <Input pattern="[0-9]+([\.,][0-9]+)?" type="number" value={`${modifiers.minScaleLength}`} onChange={e => {
                                    modifyInstrument({
                                        ...modifiers,
                                        minScaleLength: +e.target.value
                                    })
                                }} />
                            </td>
                            <td>
                                <Input pattern="[0-9]+([\.,][0-9]+)?" type="number" value={`${modifiers.maxScaleLength}`} onChange={e => {
                                    modifyInstrument({
                                        ...modifiers,
                                        maxScaleLength: +e.target.value
                                    })
                                }} />
                            </td>
                            <td>
                                <Input pattern="[0-9]+([\.,][0-9]+)?" type="number" value={`${modifiers.minTension}`} onChange={e => {
                                   modifyInstrument({
                                    ...modifiers,
                                    minTension: +e.target.value
                                })
                                }} />
                            </td>
                            <td>
                                <Input pattern="[0-9]+([\.,][0-9]+)?" type="number" value={`${modifiers.maxTension}`} onChange={e => {
                                    modifyInstrument({
                                        ...modifiers,
                                        maxTension: +e.target.value
                                    })
                                }} />
                            </td>
                            <td>
                                <Input type="select" value={modifiers.brand} onChange={e => {
                                    modifyInstrument({
                                        ...modifiers,
                                        brand: e.target.value
                                    })
                                }}>
                                    {Object.keys(BRANDS).map(key => (
                                        <optgroup key={key} label={key}>
                                            {BRANDS[key].map(b => (
                                                <option key={b.value} value={b.value}>
                                                    {b.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )
                                    )}
                                </Input>
                            </td>
                            <td>
                                <Input type="select" value={modifiers.woundThird} onChange={e => {
                                    modifyInstrument({
                                        ...modifiers,
                                        woundThird: e.target.value
                                    })
                                }}>
                                    {woundThirdOptions.map(o => (
                                        <option value={o.value} key={o.value}>
                                            {o.name}
                                        </option>
                                    ))}
                                </Input>
                            </td>
                            <td>
                                <Input type="select" value={`${modifiers.tensile}`} onChange={e => {
                                    modifyInstrument({
                                        ...modifiers,
                                        tensile: +e.target.value
                                    })
                                }}>
                                    {tensileOptions.map(t => (
                                        <option value={t} key={t}>
                                            {t}
                                        </option>
                                    ))}
                                </Input>
                            </td>
                        <td>
                            <Button onClick={clearModifiers} color="info">
                                Clear
                            </Button>
                        </td>
                        </tr>
                    </tbody>
                </Table>
            </CardBody>
        </Card >
    )
}