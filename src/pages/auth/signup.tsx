import * as React from 'react'
import { Button, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Image from 'next/image'
import coverBG from '../../assets/landing/connectiveCover.png'
import GoogleIcon from '../../components/icons/Google'
import axios from 'axios'

const SignUp = () => {

    const [name, setName] = React.useState();
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();

    const handleClick = () => {
        axios.post("http://localhost:3000/api/simple-auth/signup", {
            name,
            email,
            password
        })
    }
    
    return (
        <Grid container spacing={2}>
            <Grid item md={8}>
                <Image src={coverBG} layout="responsive" alt="image not found" />
            </Grid>
            <Grid item md={4}>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Typography fontSize={30} fontWeight={700} pt={10}>Create an account</Typography>
                <Typography color="grey.600" mt={2}>Let's get started with your 30 day free trial.</Typography>
                <Box display="flex" flexDirection="column" mt={3} style={{width: '100%'}}>
                    <TextField label="Name" variant="standard" style={{marginBottom: 10}} value={name} onChange={e => setName(e.target.value)}/>
                    <TextField label="Email" variant="standard" style={{marginBottom: 10}} value={email} onChange={e => setEmail(e.target.value)}/>
                    <TextField label="Password" type="password" variant="standard" style={{marginBottom: 10}} value={password} onChange={e => setPassword(e.target.value)}/>
                    <Box mt={5}>
                        <Button onClick={() => handleClick()} fullWidth variant="contained" style={{background: 'black', marginBottom: 3}} size="medium">Create an account</Button>
                        <Button variant="outlined" startIcon={<GoogleIcon />} style={{borderColor: "grey", width: '100%'}}>
                            Sign Up with Google
                        </Button>
                    </Box>
                </Box>          
            </Box>
            </Grid>
        </Grid>
    )
}

export default SignUp