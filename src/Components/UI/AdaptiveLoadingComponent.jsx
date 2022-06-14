import React from 'react'

export default function AdaptiveLoadingComponent({rounded}) {
  return (
    <div className={"w-full h-full flex justify-center items-center bg-dark-purple-500 bg-opacity-100 z-10 " + rounded}>
        {/* <div className='h-20'></div> */}
        <div className='lds-dual-ring'></div>
        {/* <div className='flex justify-center items-center text-teal-200 text-lg font-semibold'>
          <span>Please, wait...</span>
        </div> */}
    </div>
  )
}