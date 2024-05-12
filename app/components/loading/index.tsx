import React from 'react'

export const Loading = () => {
    return (
        <button type="button" disabled>
            <svg className="animate-spin h-5 w-5 mr-3 " viewBox="0 0 24 24">
                ..
            </svg>
            Processing...
        </button>
    )
}
