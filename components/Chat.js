import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import { getEmail } from "../utils/util";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const recepientEmail = getEmail(users, user);
  const [recepientSnapshot] = useCollection(
    db.collection("users").where("email", "==", recepientEmail)
  );
  const recepient = recepientSnapshot?.docs?.[0]?.data();
  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container
      onClick={enterChat}
      className={router.query.id == id ? "selected" : ""}
    >
      {recepient ? (
        <UserAvatar src={recepient?.photoURL} />
      ) : (
        <UserAvatar>{recepientEmail[0]}</UserAvatar>
      )}

      <p>{recepientEmail}</p>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }

  &.selected {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
