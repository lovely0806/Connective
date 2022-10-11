import * as React from 'react'
import { Button, Grid, InputLabel, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Image from 'next/image'
import coverBG from '../../assets/landing/connectiveCover.png'
import GoogleIcon from '../../components/icons/Google'
import axios from 'axios'
import Link from 'next/link'

const SignIn = () => {

    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();

    const handleClick = async () => {
        try {
            const userInfo = await axios.post("http://localhost:3000/api/simple-auth/signin", {
                email,
                password
            })

            console.log(userInfo)
        } catch (err) {
            console.log(err)
        }
    }
    
    return (
        <Grid container spacing={2}>
            <Grid item md={8}>
                <Image src={coverBG} layout="responsive" alt="image not found" />
            </Grid>
            <Grid item md={4}>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Typography fontSize={30} fontWeight={700} pt={10}>Login</Typography>
                <Typography color="grey.600" mt={2}>Enter your credentials to access your account</Typography>
                <Box display="flex" flexDirection="column" mt={3} style={{width: '100%'}}>
                    <Box mb={5}>
                        <Button variant="outlined" startIcon={<GoogleIcon />} style={{borderColor: "grey", width: '100%'}}>
                            Log In with Google
                        </Button>
                    </Box>
                    <InputLabel>Email</InputLabel>
                    <TextField label="Email" variant="outlined" style={{marginBottom: 10}} value={email} onChange={e => setEmail(e.target.value)}/>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                        <InputLabel>Password</InputLabel>
                        <Link href="/auth/forgot-password">Forgot Password?</Link>
                    </Box>
                    <TextField label="Password" type="password" variant="outlined" style={{marginBottom: 10}} value={password} onChange={e => setPassword(e.target.value)}/>
                    <Box mt={5}>
                        <Button onClick={() => handleClick()} color="primary" fullWidth variant="contained" style={{marginBottom: 3}} size="large">Log In</Button>
                    </Box>
                </Box>          
            </Box>
            </Grid>
        </Grid>
    )
}

export default SignIn