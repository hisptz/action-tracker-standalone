import React from 'react'
import {Container, Grid} from "@material-ui/core";
import './App.css'
import MainPage from "./modules/main";


const MyApp = () => {

    return (
            <div style={{background: '#F8F9FA', margin: 0, padding: 0, minHeight:'100%', overflow: 'none'}}>
               <Grid container>
                   <MainPage/>
               </Grid>
            </div>
    )
}
export default MyApp
