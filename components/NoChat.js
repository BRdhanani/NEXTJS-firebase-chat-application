import styled from "styled-components";

function NoChat() {
  return (
    <Container>
      <Logo src="/chat.png" />
      <h3>Select chat to see the conversation</h3>
    </Container>
  );
}

export default NoChat;

const Container = styled.div`
  text-align: center;
  padding: 100px;
`;

const Logo = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;
