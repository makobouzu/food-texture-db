import Head from 'next/head'
import { db } from '@/lib/firebase'
import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { Box, Button, Input, InputGroup, InputLeftElement, Spacer, Stack } from '@chakra-ui/react';
import { FaPenNib } from "react-icons/fa";
import { getEmbeddings } from '@/lib/openai-embeddings';
import DbCard from '@/components/dbCard';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [id, setId] = useState([]);
  const [chat, setChat] = useState([]);

  // Firebaseからコメント抽出
  useEffect(() => {
    const collectionRef = collection(db, "vector");
    const q = query(collectionRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const m = [];
      const n = [];
      snapshot.forEach((doc) => {
        m.push({
          ...doc.data()
        });
        n.push({
          text: doc.data().text,
          id: doc.id
        });
      })
      setMessages(m);
      setId(n);
    });
    return (() => unsubscribe());
  }, []);

  // timesplit
  const timeSplit = (time) => {
    const timestamp = String(time).split(' ')[4];
    return timestamp;
  }

  return (
    <>
      <Head prefix="og: https://ogp.me/ns#">
        <title>db-upload</title>
        <meta name="description" content="db-upload" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:url" content="https://dp-rimokon.vercel.app/" />
        <meta property="og:title" content="db-upload" />
        <meta property="og:description" content="db-uploadのプロトタイプシステムです。" />
        <meta property="og:site_name" content="db-upload" />
        {/* <meta property="og:image" content="/0_head/img.png" /> */}

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="db-upload" />
        <meta name="twitter:description" content="db-uploadのプロトタイプシステムです。" />
        {/* <meta name="twitter:image" content="/0_head/img.png" /> */}
      </Head>

      <Box width={"100%"} bgPosition={"center"} bgSize={"cover"} >
        <Box ml={5} mr={5}>
          <Spacer mt={5} />
          <Stack spacing={4}>
            {/* <Input type="file" accept={".csv"} />
              <Button colorScheme='blue' onClick={async (e) => {
                        handleOnSubmit(e);
                    }}
                >そうしん</Button> */}
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <FaPenNib color='gray.300' />
              </InputLeftElement>
              <Input placeholder='データベースに追加する文章を入力してください。' size='lg' value={chat} onChange={(e) => setChat(e.target.value)} />
            </InputGroup>
            <Button colorScheme='blue' onClick={async () => {
              if (chat != "") {
                const vector = await getEmbeddings(chat);

                // DBへの投稿
                const addRef = collection(db, "vector");
                const addDocRef = await addDoc(addRef, {
                  text: chat,
                  timestamp: new Date(),
                  vector: vector
                });
                setChat("");
              }
            }}>
              送信
            </Button>
          </Stack>
        </Box>
        <Spacer mt={10} />
        <Box ml={5} mr={5}>
          <Spacer mt={5} />
          <Stack height={{ base: "xl", md: "3xl" }} overflow="scroll" bg={"#C2DEDC"} border={"2px"} borderColor={"white"} borderRadius="md" shadow={"md"}>
            {
              messages.map((msg, index) => {
                const timestamp = timeSplit(msg.timestamp.toDate());
                return (
                  <DbCard key={index} text={msg.text} id={id} timestamp={timestamp} />
                );
              })
            }
          </Stack>
        </Box>
      </Box>
    </>
  )
}
