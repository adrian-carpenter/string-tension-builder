import { TString, TTemplateValues } from "./calculator.models"
import { GAUGE_MASS } from "./constants/gauge_mass"
import { INSTRUMENT_TEMPLATES } from "./constants/instrument_templates"
import { NOTE_OFFSET } from "./constants/note_offset"
import { BOILER_STRING_SET } from "./constants/string_sets"


export function initString(baseString: TString): TString {
    const updatedString = { ...baseString }
    // Needs to be done in this order
    updatedString.offset = calculateOffset(updatedString)
    updatedString.frequency = calculateFrequency(updatedString)
    updatedString.unitWeight = calculateUnitWeight(updatedString)
    updatedString.tension = calculateStringTension(updatedString)
    updatedString.breakingPoint = calculateBreakingPoint(updatedString)
    updatedString.percentTension = calculateBreakingTension(updatedString)
    return updatedString
}

export function calculateOffset(currentString: TString): number {
    return NOTE_OFFSET[currentString.note]
}

export function calculateFrequency(currentString: TString): number {
    // A4_Offset from C5 = 3
    // Base_Octave = 5 (C5)
    // Formula (string.octave - base_octave) * 12 + a4_offset + currentstring.offset
    const halfstep = (currentString.octave - 5) * 12 + 3 + currentString.offset
    const A4Constant = Math.pow(2, 1 / 12)
    const frequency = (440 * Math.pow(A4Constant, halfstep)).toFixed(2)
    return +frequency
}

export function calculateStringTension(currentString: TString): number {
    const { unitWeight, scaleLength, frequency } = currentString
    return parseFloat((unitWeight * Math.pow((2 * +scaleLength * frequency), 2) / 386.4).toFixed(2))
}

export function calculateBreakingPoint(currentString: TString): number {
    return +(currentString.tensile * Math.PI * Math.pow(+currentString.gauge / 2, 2)).toFixed(2)
}

export function calculateBreakingTension(currentString: TString): number {
    const breakingPoint = (currentString.tensile * Math.PI * Math.pow(+currentString.gauge / 2, 2)).toFixed(2)
    return currentString.tension / +breakingPoint
}

export function calculateUnitWeight(currentString: TString): number {
    const { brand, gauge } = currentString
    const brandMass = GAUGE_MASS[brand]
    const gaugeIndex = (+gauge).toFixed(4).replace(/^0+/, '').replace(/0$/, '')
    return brandMass[gaugeIndex] || imaginaryUnitWeight(brand, +gauge)
}

export function imaginaryUnitWeight(brand: string, gauge: number): number {
    const brandMass = { ...GAUGE_MASS[brand] }
    const brandGauges = Object.keys(brandMass).map((val: string) => parseFloat(val)).reverse()
    const brandKeys = Object.keys(brandMass).reverse()
    const brandGaugeLength = brandGauges.length
    let highGauge = 0
    let lowGauge = 0
    let lowBMKey = ''
    let highBMKey = ''
    if (gauge >= brandGauges[brandGaugeLength - 1]) {
        highGauge = brandGauges[brandGaugeLength - 1]
        lowGauge = brandGauges[brandGaugeLength - 2]
        highBMKey = brandKeys[brandGaugeLength - 1]
        lowBMKey = brandKeys[brandGaugeLength - 2]
    } else if (gauge <= brandGauges[0]) {
        highGauge = brandGauges[1]
        lowGauge = brandGauges[0]
        highBMKey = brandKeys[1]
        lowBMKey = brandKeys[0]
    } else {
        for (let k = 0; k < brandGaugeLength; k++) {
            if (gauge < brandGauges[k]) {
                highGauge = brandGauges[k]
                lowGauge = brandGauges[k - 1]
                highBMKey = brandKeys[k]
                lowBMKey = brandKeys[k - 1]
                break
            }
        }
    }
    const lowUnitWeight = brandMass[lowBMKey]
    const highUnitWeight = brandMass[highBMKey]
    return lowUnitWeight + ((highUnitWeight - lowUnitWeight) / (highGauge - lowGauge)) * (gauge - lowGauge)
}


export function breakingColor(percentTension: number): string {
    if (percentTension > 1) {
        return '#C62828'
    } else if (percentTension > .9 && percentTension < 1) {
        return '#F44336'
    } else if (percentTension > .8 && percentTension < .9) {
        return '#EF6C00'
    } else if (percentTension > .7 && percentTension < .8) {
        return '#FF9800'
    } else {
        return '#64dd17'
    }
}

export function newStringToSet(stringCount: number, isRaised: boolean, scaleLength: number) {
    let index = isRaised ? stringCount : stringCount + 1
    if (index > INSTRUMENT_TEMPLATES.guitar.length) index = INSTRUMENT_TEMPLATES.guitar.length - 1
    const template = INSTRUMENT_TEMPLATES.guitar[index]
    const defaultGauge = BOILER_STRING_SET[index]
    const baseString: TString = {
        number: stringCount + 1,
        scaleLength: `${scaleLength}`,
        note: template.note,
        octave: template.octave,
        tensile: 400000,
        brand: defaultGauge > .020 ? 'DANW' : 'DAPL',
        gauge: `${defaultGauge}`,
        offset: 0,
        tension: 0,
        breakingPoint: 0,
        percentTension: 0,
        frequency: 0,
        unitWeight: 0,
    }
    return initString(baseString)
}

export function generateTemplateBase(templateValues: TTemplateValues): TString[] {
    let newSet:TString[] = []
    
    return newSet
}


export function generateScaleLength(strings: TString[], minScaleLength: number, maxScaleLength: number): TString[] {
    if (maxScaleLength !== 0) {
        const scaleStep = (maxScaleLength) ? (maxScaleLength - minScaleLength) / (strings.length - 1) : 0
        const newSet = strings.map((s, i) => {
            return {
                ...s,
                scaleLength: `${minScaleLength + scaleStep * i}`
            }
        })
        return newSet
    } else {
        const newSet = strings.map(s => {
            return {
                ...s,
                scaleLength: `${minScaleLength}`
            }
        })
        return newSet
    }
}