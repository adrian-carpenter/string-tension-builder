import React, { useState } from 'react'
import { Alert, Button, Card, CardBody, Input, Table } from 'reactstrap'
import { TUNING_TEMPLATES } from '../constants/tuning_templates'
import { useStoreActions } from '../store/calculator.store'


const tuningTypeOptions = [
    {
        name: 'Standard',
        value: 'STD'
    }, {
        name: 'Drop',
        value: 'DRP'
    }, {
        name: 'Double Drop',
        value: 'DDRP'
    }, {
        name: 'Drop + P4',
        value: 'DRPP4'
    }
]

const stringCountOptions = [4, 5, 6, 7, 8, 9, 10]


export const TemplateForm = () => {
    const generateTemplate = useStoreActions(actions => actions.instrument.generateTemplate)
    const [instrumentType, setInstrumentType] = useState('guitar')
    const [stringCount, setStringCount] = useState(6)
    const [tuningType, setTuningType] = useState(tuningTypeOptions[0].value)
    const [tuning, setTuning] = useState('')
    const [hasError, setHasError] = useState(false)
    const filteredStringCountOptions = instrumentType === 'guitar' ? stringCountOptions.slice(2) : [...stringCountOptions]
    const tuningOptions = TUNING_TEMPLATES[instrumentType][stringCount]

    const clear = () => {
        setInstrumentType('guitar')
        setStringCount(6)
        setTuningType(tuningTypeOptions[0].value)
        setTuning('')
    }

    const handleSubmit = () => {
        setHasError(false)
        const option = tuningOptions.find(o => o.id === tuning)
        if (option) {
            generateTemplate({
                instrumentType,
                stringCount,
                tuningType,
                tuningOffset: option?.offset || 0,
                isRaised: option?.raised || false
            })
        } else {
            setHasError(true)
        }
        clear()
    
    }
    return (
        <Card>
            <CardBody className="p-3">
            <h4 className="float-left">Template Form</h4>
            {hasError && (
                <Alert color="warning">
                    An error occurred generating template
                </Alert>
            )}
                <Table dark>
                    <tbody>
                        <tr>
                            <th>Instrument Type</th>
                            <th>String Count</th>
                            <th>Tuning Variation</th>
                            <th>Tuning</th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>
                                <Input value={instrumentType} type="select" onChange={(e) => setInstrumentType(e.target.value)}>
                                    <option value="guitar">
                                        Guitar
                                    </option>
                                    <option value="bass">
                                        Bass
                                    </option>
                                </Input>
                            </td>
                            <td>
                                <Input value={stringCount} type="select" onChange={e => setStringCount(+e.target.value)}>
                                    {filteredStringCountOptions.map(num => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </Input>
                            </td>
                            <td>
                                <Input value={tuningType} type="select" onChange={e => setTuningType(e.target.value)}>
                                    {tuningTypeOptions.map(t => (
                                        <option key={t.value} value={t.value}>
                                            {t.name}
                                        </option>
                                    ))}
                                </Input>
                            </td>
                            <td>
                                <Input value={tuning} type="select" onChange={e => setTuning(e.target.value)}>
                                    <option hidden value=""></option>
                                    {tuningOptions.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} {t.raised && `(Raised)`} {t.offset > 12 && `(Contrabass)`}
                                        </option>
                                    ))}
                                </Input>
                            </td>
                            <td>
                                <Button color="success" onClick={handleSubmit}>
                                    Generate
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    )
}