import styled from "styled-components";
import {
  Avatar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Switch,
} from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";
import { useState, useEffect } from "react";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import Brightness2Icon from "@material-ui/icons/Brightness2";

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

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    darkMode
      ? document.getElementById("__next").classList.add("black")
      : document.getElementById("__next").classList.remove("black");
    darkMode
      ? localStorage.setItem("dark", true)
      : localStorage.setItem("dark", false);
    darkMode ? console.log("dark", true) : console.log("dark", false);
  }, [darkMode]);
  return (
    <Container>
      <Header className={darkMode && "dark"}>
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
        <Chat
          key={chat.id}
          id={chat.id}
          users={chat.data().users}
          darkMode={darkMode}
        />
      ))}
      <WbSunnyIcon
        style={{
          position: "absolute",
          bottom: "7px",
          left: "2%",
          color: darkMode ? "white" : "black",
        }}
      />
      <SwitchContainer
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
        color="primary"
        className={darkMode ? "dark" : "light"}
      />
      <Brightness2Icon
        style={{
          position: "absolute",
          bottom: "7px",
          left: "11%",
          color: darkMode ? "white" : "black",
        }}
      />
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
  &.dark {
    background-color: #15202b;
  }
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

const SwitchContainer = styled(Switch)`
  position: absolute !important;
  bottom: 0;
  left: 5%;
  &.light {
    .MuiButtonBase-root {
      color: #15202b;
    }
    .MuiSwitch-track {
      background-color: #15202b;
    }
  }
  &.dark {
    .MuiButtonBase-root {
      color: white;
    }
    .MuiSwitch-track {
      background-color: white !important;
    }
  }
`;
