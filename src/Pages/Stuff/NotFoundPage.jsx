import React from 'react'

export default function NotFoundPage() {
  return (
    <div className='w-full h-full flex justify-center'>
        <div className='h-1/2 w-full flex flex-col items-center py-20 gap-4'>
            <h1 className='text-5xl font-semibold text-white text-center'>Whoops!</h1>
            <h3 className='text-3xl font-semibold text-red-100 text-center'>404 Page Not Found</h3>
            <h3 className='text-2xl font-semibold text-green-100 text-center'>Don't worry though, everything is still awesome!</h3>
        </div>
    </div>
  )
}
