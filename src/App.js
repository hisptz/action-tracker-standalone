import React from 'react'
import {Container, Grid} from "@material-ui/core";
import './App.css'
import MainPage from "./modules/main";


const MyApp = () => {

    return (
            <Container maxWidth='xl' style={{background: '#F8F9FA', margin: 0, padding: 0, minHeight:'100%'}}>
               <Grid container>
                   <MainPage/>
               </Grid>
            </Container>
    )
}
export default MyApp
