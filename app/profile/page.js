'use client'
import { UserAuth } from "../context/AuthContext";
import { AppBar, Toolbar, Button, Typography, Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";

const Page = () => {
    const { user } = UserAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setLoading(false);
        };
        checkAuthentication();
    }, [user])

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={4}
            minHeight="100vh"
            bgcolor="background.default"
        >
            {loading ? (<Box display={'flex'} justifyContent={'center'} height={'100vh'}>
                <CircularProgress></CircularProgress>
            </Box>) : user ? (<Typography variant="h6" color="textPrimary" gutterBottom>
                Welcom {user.displayName} to your profile page
            </Typography>) : (
                            <Typography variant="h6" color="textPrimary" gutterBottom>
                            You must be logged in to view this page
                        </Typography>
            )}

        </Box>
    )
}

export default Page
