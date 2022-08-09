import React, { useEffect, useState } from 'react';
import HomeInfiniteCarousel from '../../Components/HomePageExternal/HomeInfiniteCarousel';



export default function TestHomePage() {
    
  return (
    <div className='w-full flex justify-center bg-slate-900'>
        <div className='w-full flex justify-center p-2 max-w-[1400px] text-white'>
            <div className='w-full flex max-w-[1000px]'>
                <HomeInfiniteCarousel />
            </div>
        </div>
    </div>
  )
}
