import { Circle } from "better-react-spinkit";
function loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <img src="/chat.png" height={200} />
      </div>
      <Circle color="#56acdd" size={60} />
    </center>
  );
}

export default loading;
