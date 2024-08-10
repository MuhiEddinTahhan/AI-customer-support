'use client'
import { Box, Stack, TextField, Button, Typography, CircularProgress  } from "@mui/material";
import { getFirestore, collection, getDocs, QuerySnapshot, query, onSnapshot, deleteDoc, doc, where, addDoc } from 'firebase/firestore';
import {db} from "./firebase"
import Image from "next/image";
import { useEffect, useState } from 'react';
import { UserAuth } from "./context/AuthContext";
import { resolve } from "styled-jsx/css";

export default function Home() {
  const {user} = UserAuth()
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hi! I\'m your assitant for your cybersecurity certification preparation, how can I assist you today?'
  }])

  const [message, setMessage] = useState('')

  const sendMassage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      {role: "user", content: message},
      {role: "assistant", content: ''},
    ])
    const response = fetch("/api/chat", {
      method:"POST",
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}])
    }).then (async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({done, value}){
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Int8Array(), {stream:true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length -1)
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text
            }
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
      setLoading(false)
    }
    checkAuthentication()
  }, [user])

  //add chat to database
  const addChat = async (e) => {
    await addDoc(collection(db, 'chat')), {
      message, messages
    }
  }

  // useEffect(() => {
  //   const q = query (collection(db, 'chat'))
  //   const unsubscribe = onSnapshot (q, (querySnapshot) => {
  //     let history = []

  //     querySnapshot.forEach((doc) => {
  //       history.push({...doc.data, id: doc.id})
  //     })
  //     setMessages(history)
  //     return () => unsubscribe() 
  //   })
  // }, [user])

  return (
    <Box
      width='100vw'
      height='100vh'
      display='flex'
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      bgcolor={'#f5f5f5'}
    >
      <Box
        width={'100%'}
        maxWidth={'600px'}
        height={'700px'}
        boxShadow={3}
        borderRadius={4}
        overflow="hidden"
        bgcolor={'background.paper'}
      >{loading ? (<Box display={'flex'} justifyContent={'center'} height={'100vh'}>
        <CircularProgress></CircularProgress>
    </Box>) :
        user ? (<Stack
          direction={'column'}
          height={'100%'}
          p={2}
          spacing={3}
        >
          <Stack
            direction={"column"}
            spacing={2}
            flexGrow={1}
            overflow={"auto"}
            sx={{
              '&::-webkit-scrollbar': {
                width: '0.4em',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,.1)',
                borderRadius: '8px',
              },
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display={"flex"}
                justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
              >
                <Box
                  bgcolor={message.role === "assistant" ? "primary.main" : "secondary.main"}
                  color="white"
                  borderRadius={16}
                  p={2}
                  maxWidth={'75%'}
                  boxShadow={2}
                >
                  <Typography variant="body1">
                    {message.content}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction={"row"} spacing={2}>
            <TextField
              label="Type your message..."
              fullWidth
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={sendMassage}
              sx={{ borderRadius: 2 }}
            >
              Send
            </Button>
          </Stack>
        </Stack>) : (
          <Typography variant="h6" color="textPrimary" gutterBottom>
            You must be logged in to view this page
          </Typography>
        )}
      </Box>
    </Box>
  );
}
