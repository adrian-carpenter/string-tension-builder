import { createStore, createTypedHooks } from 'easy-peasy'
import { instrumentModel, TInstrumentModel } from "./instrument.store";

export type TStoreModel = {
    instrument: TInstrumentModel
}

const { useStoreState, useStoreDispatch, useStoreActions } = createTypedHooks<TStoreModel>()

const storeModel = {
    instrument: instrumentModel,
}

export { useStoreState, useStoreDispatch, useStoreActions };

export const store = createStore(storeModel)