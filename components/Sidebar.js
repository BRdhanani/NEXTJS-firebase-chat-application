import styled from "styled-components";
import { Avatar, IconButton, Button, Menu, MenuItem } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";
import { useState } from "react";

function Sidebar() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const [user] = useAuthState(auth);
  const userRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userRef);

  const createChat = () => {
    const input = prompt(
      "Please enter an email address of the user you want to chat"
    );

    if (!input) return null;

    EmailValidator.validate(input) &&
      input !== user.email &&
      !chatExists(input) &&
      db.collection("chats").add({
        users: [user.email, input],
      });
  };

  const chatExists = (email) =>
    !!chatsSnapshot?.docs?.find(
      (chat) => chat.data().users.find((user) => user == email)?.length > 0
    );

  return (
    <Container>
      <Header>
        <UserAvatar
          src={user?.photoURL}
          onClick={(e) => {
            setOpen(true);
            setAnchorEl(e.currentTarget);
          }}
        />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={() => setOpen(false)}
        >
          <MenuItem onClick={() => auth.signOut()}>Logout</MenuItem>
        </Menu>
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search user" />
      </Search>
      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
      {chatsSnapshot?.docs?.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
  display: flex;
  align-item: center;
  padding: 30px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 1px solid whitesmoke;
    border-borrom: 1px solid whitesmoke;
  }
`;
