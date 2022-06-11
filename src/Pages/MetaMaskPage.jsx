import { useStoreState } from 'pullstate'
import React from 'react'
import { MetaMaskStorage } from '../Storages/MetaMaskStorage'

export default function MetaMaskPage() {
    
    const metamask = useStoreState(MetaMaskStorage);

    function disconnectMetaMask() {
        MetaMaskStorage.update((s)=>{
            s.isConnected = false;
            s.wallet = '';
        })
    }

    function connectToMetaMask() {
        if(!metamask.isConnected)
            metamask.connectToMetaMask();
    }

  return (
    <div className='w-full flex justify-center items-start p-4'>
        <div className='w-full md:min-w-[472px] md:w-auto flex flex-col p-8 bg-dark-purple-100 rounded-lg text-white gap-4 mt-10'>
            <span className='text-xl font-semibold'>{metamask.isConnected ? 'Connected with MetaMask':'Not connected'}</span>
            <div className='flex flex-col break-all'>
                <span>Wallet:</span>
                <span className='p-3 rounded-md bg-black bg-opacity-50'>{metamask.isConnected ? metamask.wallet:'Not connected'}</span>
            </div>
            {metamask.isConnected ? <button onClick={()=>{disconnectMetaMask()}} className='p-2 bg-red-900 bg-opacity-70 rounded-md hover:bg-opacity-100 font-semibold animated-100'>Disconnect</button>:<></>}
            {!metamask.isConnected ? <button onClick={()=>{connectToMetaMask()}} className='p-2 bg-green-900 bg-opacity-70 rounded-md hover:bg-opacity-100 font-semibold animated-100'>Connect</button>:<></>}
        </div>
    </div>
  )
}