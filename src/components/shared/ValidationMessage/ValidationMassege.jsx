import React from 'react'

export default function ValidationMassege({ field, isTouched }) {
    return (
        <>
            {field && isTouched && <span className='text-red-700 text-xs'>{field.message}</span>}

        </>)
}
