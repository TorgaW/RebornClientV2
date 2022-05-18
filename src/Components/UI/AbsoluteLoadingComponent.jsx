import React from 'react'

export default function AbsoluteLoadingComponent() {
  return (
    <div className="fixed top-[120px] w-full h-full flex flex-col items-center bg-dark-purple-500 bg-opacity-100 z-50">
        <div className='h-20'></div>
        <div className='loader'></div>
        <div className='flex justify-center items-center text-teal-200 text-lg font-semibold'>
          <span>Please, wait...</span>
        </div>
    </div>
  )
}
