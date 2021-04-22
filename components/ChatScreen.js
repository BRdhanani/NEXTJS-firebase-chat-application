import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import { useState, useRef } from "react";
import firebase from "firebase";
import { getEmail } from "../utils/util";
import TimeAgo from "timeago-react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import OutsideClickHandler from "react-outside-click-handler";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const router = useRouter();
  const messageRef = useRef(null);
  const imageRef = useRef(null);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const [recepientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getEmail(chat.users, user))
  );
  const loopMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message
          key={message.id}
          user={message.user}
          message={{
            ...message,
            timestamp: message.timestamp,
          }}
        />
      ));
    }
  };

  const sendMessage = (e, imageUrl) => {
    e.preventDefault();
    db.collection("users").doc(user.id).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: imageUrl ?? input,
        user: user.email,
        photoURL: user.photoURL,
      });

    setInput("");
    scrolToBottom();
  };

  const recepient = recepientSnapshot?.docs?.[0]?.data();
  const recepientEmail = getEmail(chat.users, user);

  const scrolToBottom = () => {
    messageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleUpload = () => {
    imageRef.current.click();
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      //const data=(reader.result).split(',')[1]
      callback(reader.result);
    });
    reader.readAsDataURL(img);
  };

  return (
    <Container>
      {console.log(openEmoji)}
      {openEmoji && (
        <OutsideClickHandler
          onOutsideClick={() => {
            setOpenEmoji(false);
          }}
        >
          <Picker
            onSelect={(e) => setInput(`${input}${e.native}`)}
            style={{ position: "absolute", bottom: "0px" }}
          />
        </OutsideClickHandler>
      )}
      <Header>
        {recepient ? (
          <Avatar src={recepient?.photoURL} />
        ) : (
          <Avatar>{recepientEmail[0]}</Avatar>
        )}

        <HeaderInformation>
          <h3>{recepientEmail}</h3>
          {recepientSnapshot ? (
            <p>
              Last active:{" "}
              {recepient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recepient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon onClick={handleUpload} />
            <input
              type="file"
              ref={imageRef}
              className="profile__info--Filetag"
              onChange={(e) => {
                getBase64(e.target.files[0], (imageUrl) => {
                  sendMessage(e, imageUrl);
                });
              }}
              hidden
            />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {loopMessages()}
        <EndOfMessage ref={messageRef} />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticonIcon
          onClick={() => setOpenEmoji(true)}
          style={{ cursor: "pointer" }}
        />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const EndOfMessage = styled.div`
  margin-bottom: px;
`;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
  background-color: whitesmoke;
`;
