import React from 'react'

interface IProps {
    children: React.ReactNode
}

export const PageLayout = (props: IProps) => (
    <div className="container-fluid">
        {props.children}
    </div>
)