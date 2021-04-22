import Head from "next/head";
import Sidebar from "../components/Sidebar";
import styles from "../styles/Home.module.css";
import NoChat from "../components/NoChat";
import styled from "styled-components";

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Chat App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
      <ChatContainer>
        <NoChat />
      </ChatContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
