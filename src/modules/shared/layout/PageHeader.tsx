import React from 'react'

interface IProps {
    children: React.ReactNode
}

export const PageHeader = (props: IProps) => (
    <div className="jumbotron-fluid mb-4">
        {props.children}
    </div>
)