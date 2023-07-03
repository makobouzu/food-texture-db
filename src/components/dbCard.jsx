import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { db } from '@/lib/firebase'
import { collection, deleteDoc, doc } from "firebase/firestore";

export default function  DbCard({ text, id, timestamp }) {
  return (
    <Box mt={5}>
      <Box ml={{base: 2, md: 3}} mr={{base: 2, md: 3}} mb={2} display={"flex"} shadow="md" p={{base: 2, md: 3}} justifyContent="space-between" background={"white"} alignItems="center" borderRadius="md">
        <Text mr={0}>
          {text}
        </Text>
        <Box pl={{base: 2, md: 5}} borderRadius="md">
        <Button colorScheme='pink' onClick={async () => {
          const val = id.find(elm => {
            return elm.text == text
          })
          // DBから削除
          const deleteRef = collection(db, "shop");
          await deleteDoc(doc(db, "shop", val.id));
        }}>削除</Button>
        </Box>
      </Box>
    </Box>
  )
}