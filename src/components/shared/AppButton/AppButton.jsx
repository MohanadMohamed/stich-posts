import { Button } from '@heroui/react'
import React from 'react'

export default function AppButton({ children, isLoading, isDisabled, ...buttonConfig }) {
    return (
        <Button {...buttonConfig} isLoading={isLoading} isDisabled={isDisabled} >{children}</Button>
    )
}
