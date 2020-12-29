import { action, Action } from "easy-peasy";
import { TString } from "../calculator.models";
import { initString, newStringToSet } from "../calculator.utils";
import { INSTRUMENT_TEMPLATES, TTemplate } from "../constants/instrument_templates";
import { BOILER_STRING_SET } from "../constants/string_sets";
import { TModifierValues, TTemplateValues } from './../calculator.models';
import { NOTE_OFFSET } from './../constants/note_offset';

function createStringsFromTemplateAndGauges(template: TTemplate[], gauges: number[]): TString[] {
    const strings: TString[] = []
    template.forEach((string, index) => {
        const baseString: TString = {
            number: index + 1,
            scaleLength: "25.5",
            note: string.note,
            octave: string.octave,
            tensile: 400000,
            brand: (gauges[index] > .020 ? 'DANW' : 'DAPL'),
            gauge: `${gauges[index]}`,
            offset: 0,
            tension: 0,
            breakingPoint: 0,
            percentTension: 0,
            frequency: 0,
            unitWeight: 0,
        }
        strings.push(initString(baseString))
    })
    return strings
}

function initInstrumentModel(): TString[] {
    const template = INSTRUMENT_TEMPLATES.guitar.slice(1, 7)
    const defaultGauges = BOILER_STRING_SET.slice(1, 7)
    return createStringsFromTemplateAndGauges(template, defaultGauges)
}

function setNote(s: TString, offSet: number): TString {
    const updatedString = { ...s }

    // Sets the index to be aligned with C as the octave
    const offsetArray = Object.keys(NOTE_OFFSET).reverse()
    const curNoteOffset = offsetArray.indexOf(s.note)
    let offsetIndex = (curNoteOffset + offSet) % 12
    if (offsetIndex < 0) { offsetIndex += 12 }
    const offsetOctave = Math.floor((curNoteOffset + offSet) / 12)
    updatedString.note = offsetArray[offsetIndex]
    updatedString.octave -= offsetOctave
    return updatedString
}

function tuneStringsFromTemplate(strings: TString[], tv: TTemplateValues): TString[] {
    const newSet: TString[] = []
    const offSet = (tv.tuningType === 'STD') ? tv.tuningOffset : (tv.tuningType === 'DDRP') ? tv.tuningOffset - 4 : tv.tuningOffset - 2
    strings.forEach((string, index) => {
        if (index === strings.length - 3 && tv.tuningType === 'DDRP') {
            newSet.push(setNote(string, offSet + 2))
        } else if (index === strings.length - 2 && (tv.tuningType === 'DDRP' || tv.tuningType === 'DRPP4')) {
            newSet.push(setNote(string, offSet + 2))
        } else if (index === strings.length - 1 && (tv.tuningType !== 'STD')) {
            const optionalOffset = (tv.tuningType === 'DDRP') ? 4 : 2
            newSet.push(setNote(string, offSet + optionalOffset))
        } else {
            newSet.push(setNote(string, offSet))
        }
    })
    return newSet
}

function initTemplate(tv: TTemplateValues) {
    // For drop tunings when the lowest string gets lower and all others are raised
    const dropRaised = (!tv.isRaised && tv.tuningOffset < 2 && tv.instrumentType === 'guitar' && tv.tuningType !== 'STD')
    const gauges = (tv.isRaised || dropRaised) ? BOILER_STRING_SET.slice(0, tv.stringCount) : BOILER_STRING_SET.slice(1, tv.stringCount + 1)
    const baseTemplate = (tv.isRaised) ?
        INSTRUMENT_TEMPLATES[tv.instrumentType].slice(0, tv.stringCount)
        : INSTRUMENT_TEMPLATES[tv.instrumentType].slice(1, tv.stringCount + 1)
    const strings = createStringsFromTemplateAndGauges(baseTemplate, gauges)
    const tunedSet = tuneStringsFromTemplate(strings, tv)
    return tunedSet.map(s => initString(s))

}

function modifyStringSet(mv: TModifierValues, strings: TString[]): TString[] {
    const newSet = [...strings]

    //Scale Modify
    if (mv.minScaleLength !== 0) {
        const scaleStep = (mv.maxScaleLength) ? (mv.maxScaleLength - mv.minScaleLength) / (strings.length - 1) : 0
        newSet.forEach((string, index) => {
            string.scaleLength = `${mv.minScaleLength + scaleStep * index}`
        })
    }

    //Brand Modify
    if (mv.brand) {
        if (mv.brand.match(/^K/)) {
            newSet.forEach(s => {
                s.brand = +s.gauge < 0.021 ? 'KPLG' : 'KWNG'
            })
        } else {
            newSet.forEach(s => {
                s.brand = +s.gauge < 0.021 ? 'DAPL' : mv.brand
            })
        }
    }

    //Wound 3rd Modify
    if (mv.woundThird) {
        if (mv.woundThird === 'w3@17') {
            const brand = strings[strings.length - 1].brand
            newSet.forEach(s => {
                s.brand = +s.gauge > 0.016 ? brand : s.brand
            })
        } else if (mv.woundThird === 'w3@26') {
            const brand = strings[0].brand
            newSet.forEach(s => {
                s.brand = +s.gauge < 0.026 ? brand : s.brand
            })
        } else {
            const brand = strings[0].brand
            newSet.forEach(s => {
                s.brand = +s.gauge < 0.021 ? brand : s.brand
            })
        }
    }

    //Tensile Modify
    if (mv.tensile) {
        newSet.forEach((string => {
            string.tensile = mv.tensile
        })
        )
    }

    //Tension Modify
    if (mv.minTension) {
        //Offset increase by string
        const isKalium = (mv.brand) ? mv.brand.match(/^K/) : false
        const woundBrand = (isKalium) ? 'KWNG' : mv.brand || 'DANW'
        const plainBrand = (isKalium) ? 'KPLG' : 'DAPL'
        const threshold = (mv.woundThird === 'w3@17') ? .017 : (mv.woundThird === 'w3@26') ? .026 : .020
        const tensionOffset = (mv.maxTension) ? (mv.maxTension - mv.minTension) / (strings.length - 1) : 0
        return newSet.map((string, index) => {
            let newString = { ...string }
            newString.tension = 0
            let incrementGauge = .004
            let stringTension = 0
            while (stringTension < mv.minTension + tensionOffset * index) {
                const currentThreshold = mv.minTension + tensionOffset * index
                let lowTensionCompareString = { ...newString }
                lowTensionCompareString.gauge = `${incrementGauge}`
                lowTensionCompareString.brand = (incrementGauge >= threshold) ? woundBrand : plainBrand
                lowTensionCompareString = initString(lowTensionCompareString)

                if (lowTensionCompareString.tension > currentThreshold) {
                    newString = { ...lowTensionCompareString }
                    stringTension = lowTensionCompareString.tension
                }

                incrementGauge += (+incrementGauge.toFixed(4) > .0135) ? .001 : .0005
                let highTensionCompareString = { ...newString }
                highTensionCompareString.gauge = `${incrementGauge}`
                highTensionCompareString.brand = (incrementGauge >= threshold) ? woundBrand : plainBrand
                highTensionCompareString = initString(highTensionCompareString)

                if (highTensionCompareString.tension > mv.minTension + tensionOffset * index) {
                    // Compare which one is closest to tension
                    const lowTensionAbs = Math.abs(lowTensionCompareString.tension - threshold)
                    const highTensionAbs = Math.abs(highTensionCompareString.tension - threshold)
                    newString = (lowTensionAbs < highTensionAbs) ? { ...lowTensionCompareString } : { ...highTensionCompareString }
                    stringTension = highTensionCompareString.tension
                }

                stringTension = highTensionCompareString.tension
            }
            return newString
        })
    }
    return newSet.map(s => initString(s))
}

function initModifiers(): TModifierValues {
    return {
        minScaleLength: 0,
        maxScaleLength: 0,
        minTension: 0,
        maxTension: 0,
        brand: 'DANW',
        woundThird: 'w3@21',
        tensile: 400000
    }
}

export type TInstrumentModel = {
    strings: TString[]
    modifiers: TModifierValues
    isRaised: boolean,
    updateString: Action<TInstrumentModel, TString>
    removeString: Action<TInstrumentModel>
    addString: Action<TInstrumentModel>
    generateTemplate: Action<TInstrumentModel, TTemplateValues>
    modifyInstrument: Action<TInstrumentModel, TModifierValues>
}

export const instrumentModel: TInstrumentModel = {
    strings: initInstrumentModel(),
    modifiers: initModifiers(),
    isRaised: false,
    updateString: action((state, payload) => {
        const filteredStrings = state.strings.filter(s => s.number !== payload.number)
        filteredStrings.push(payload)
        filteredStrings.sort((a, b) => a.number > b.number ? 1 : -1)
        state.strings = [...filteredStrings]
    }),
    removeString: action((state, payload) => {
        const length = state.strings.length
        const newSet = state.strings.filter(s => s.number !== length)
        state.strings = [...newSet]
    }),
    addString: action((state, payload) => {
        const stringCount = state.strings.length
        const newSet = [...state.strings, newStringToSet(stringCount, false, 25.5)]
        state.strings = [...newSet]
    }),
    generateTemplate: action((state, payload) => {
        state.strings = modifyStringSet(state.modifiers, initTemplate(payload))
    }),
    modifyInstrument: action((state, payload) => {
        state.modifiers = { ...payload }
        const newSet = modifyStringSet(payload, state.strings)
        state.strings = [...newSet]
    })
}