import { useStoreState } from 'pullstate'
import React, { useEffect, useState } from 'react'
import { TempLinkStorage } from '../../Storages/Stuff/TempLinkStorage';

export default function TemporaryLinkComponent() {

  // const tempLink = useStoreState(TempLinkStorage);


  function setLink(link, seconds) {
    
    TempLinkStorage.update(s=>{
      s.link = link;
      s.eAt = (new Date()).getTime() + seconds*1000;
    })

    return link;

  }

  function deleteLink() {
    
    TempLinkStorage.update(s=>{
      s.link = '';
      s.eAt = 0;
    })

  }


  useEffect(()=>{
    TempLinkStorage.update(s=>{
      s.setLinkFor = setLink;
      s.removeLink = deleteLink;
    })
  },[])



  return (
    <></>
  )
}
