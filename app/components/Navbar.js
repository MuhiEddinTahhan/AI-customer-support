import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserAuth } from "../context/AuthContext";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { resolve } from "styled-jsx/css";

const Navbar = () => {
    const {user, googleSignIn, logOut} = UserAuth()
    const [loading, setLoading] = useState(true)

    const handleSignIn = async () => {
        try{
            await googleSignIn()
        } catch(error) {
            console.log(error)
        }
    }

    const handleSignOut = async () => {
        try{
            await logOut()
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 50))
            setLoading(false)
        }
        checkAuthentication()
    }, [user])

    return (
        <AppBar position="static" color="default" sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <Button component={Link} href="/" sx={{ textTransform: "none", marginRight: 2 }}>
                Home
              </Button>
              <Button component={Link} href="/profile" sx={{ textTransform: "none" }}>
                Profile
              </Button>
            </Box>
    
            {loading ? null : user ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button onClick={handleSignOut} sx={{ textTransform: "none" }}>
                  Log Out
                </Button>
                <Typography variant="body1" sx={{ marginLeft: 2 }}>
                  Welcome, {user.displayName}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button onClick={handleSignIn} sx={{ textTransform: "none" }}>
                  Login
                </Button>
                <Button onClick={handleSignIn} sx={{ textTransform: "none", marginLeft: 2 }}>
                  Signin
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      );
    };

export default Navbar