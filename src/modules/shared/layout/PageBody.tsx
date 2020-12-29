import React from 'react'

interface IProps {
    children: React.ReactNode
}

export const PageBody = (props: IProps) => (
    <div>
        {props.children}
    </div>
)