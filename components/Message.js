import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import moment from "moment";
import isBase64 from "is-base64";
import { Dialog } from "@material-ui/core";
import { useState } from "react";

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const [img, setImg] = useState(null);

  const MessageType = user == userLoggedIn.email ? Sender : Receiver;
  return (
    <Container>
      <MessageType>
        {isBase64(message.message, { allowMime: true }) ? (
          <ImgContainer
            src={message.message}
            onClick={() => {
              setOpen(true);
              setImg(message.message);
            }}
          />
        ) : (
          message.message
        )}
        <TimeStamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : ""}
        </TimeStamp>
      </MessageType>
      <Dialog
        onClose={() => {
          setOpen(false);
          setImg(null);
        }}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <img src={img} />
      </Dialog>
    </Container>
  );
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;

const TimeStamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;

const ImgContainer = styled.img`
  height: 100px;
  cursor: pointer;
`;
