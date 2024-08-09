'use client'
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from 'react';

export default function Home() {
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
      >
        <Stack
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
              // onKeyPress={(e) => {
              //   if (e.key === 'Enter') sendMessage();
              // }}
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
        </Stack>
      </Box>
    </Box>
  );
}
