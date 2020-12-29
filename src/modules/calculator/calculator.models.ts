export type TString = {
    number: number,
    scaleLength: string,
    note: string
    octave: number
    offset: number
    gauge: string
    brand: string
    tension: number
    breakingPoint: number
    percentTension: number
    frequency: number
    unitWeight: number
    tensile: number
}

export type TInstrument = {
    strings: TString[]
}

export type TTemplateValues = {
    instrumentType: string
    stringCount: number,
    tuningType: string,
    isRaised: boolean,
    tuningOffset: number
}

export type TModifierValues = {
    minScaleLength: number,
    maxScaleLength: number,
    minTension: number,
    maxTension: number,
    brand: string,
    woundThird: string,
    tensile: number
}