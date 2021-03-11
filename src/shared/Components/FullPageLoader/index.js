import React from 'react';
import {CircularLoader, CenteredContent} from '@dhis2/ui'
export default function FullPageLoader({text}){

    return(
       <CenteredContent>
           <div style={{textAlign:'center'}}>
               <CircularLoader/>
               <h4 style={{color: '#6E7A8A'}}>{text}</h4>
           </div>
       </CenteredContent>
    )
}
