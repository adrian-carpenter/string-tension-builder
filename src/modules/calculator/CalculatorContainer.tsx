import React from 'react'
import {PageLayout} from "../shared/layout/PageLayout";
import {PageHeader} from "../shared/layout/PageHeader";
import {PageBody} from "../shared/layout/PageBody";
import {InstrumentTable} from "./components/InstrumentTable";
import { TemplateForm } from './components/TemplateForm';
import { ModifiedForm } from './components/ModifierForm';

export const CalculatorContainer = () => (
    <PageLayout>
        <PageHeader>
            <h1>String Tension Set Builder</h1>
        </PageHeader>
        <PageBody>
            <TemplateForm />
            <ModifiedForm />
            <InstrumentTable />
        </PageBody>
    </PageLayout>
)