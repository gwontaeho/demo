import { useMemo, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

function getRandomWord() {
  const RMS = [
    "Adventure",
    "Abundance",
    "Discovery",
    "Perception",
    "Generation",
    "Celebration",
    "Imagination",
    "Connection",
    "Resolution",
    "Environment",
  ];
  const randomIndex = Math.floor(Math.random() * RMS.length);
  return RMS[randomIndex];
}

function getRandomUser() {
  return window.location.host;

  const RMS = ["A", "B", "C", "D"];
  const randomIndex = Math.floor(Math.random() * RMS.length);
  return RMS[randomIndex];
}

const Test = () => {
  const [gogo, setGogo] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState(null);

  const getRooms = async () => {
    try {
      const response = await axios.get("http://localhost:3000/rooms");
      console.log(response.data);
      setRooms(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const make = async () => {
    try {
      const response = await axios.post("http://localhost:3000/rooms", {
        name: getRandomWord(),
        max: 6,
      });

      getRooms(); // 안해도됨
      setRoom(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <div className="flex flex-col gap-2 items-start">
      <button onClick={getRooms}>get</button>
      <button onClick={make}>make</button>
      <button onClick={() => setRoom(null)}>out room</button>

      <div className="mt-20 flex flex-col gap-2">
        {rooms.map((item, index) => {
          const { roomId, name, max } = item;
          return (
            <div
              key={index + "room"}
              onClick={() => {
                setRoom(roomId);
              }}
            >
              {name}
            </div>
          );
        })}
      </div>

      {room && <Room roomId={room} />}
    </div>
  );
};

const Room = (props) => {
  const { roomId } = props;

  const userId = useMemo(() => {
    return getRandomUser();
  }, []);

  const [roomInfo, setRoomInfo] = useState(null);
  const [users, setUsers] = useState(() => new Set());
  const [text, setText] = useState("");

  const socket = useMemo(() => {
    return io("http://localhost:3000");
  }, []);

  console.log(roomInfo);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join", { roomId, userId });
    });

    socket.on("roomInfo", (data) => {
      const { users, room } = data;
      setRoomInfo(room);
      setUsers(new Set(users));
    });

    socket.on("userJoin", (data) => {
      setUsers((prev) => {
        const next = new Set(prev);
        next.add(data);
        return next;
      });
    });

    socket.on("userLeave", (data) => {
      setUsers((prev) => {
        const next = new Set(prev);
        next.delete(data);
        return next;
      });
    });

    socket.on("start", (data) => {
      console.log(data);
    });

    socket.on("changeTurn", (data) => {
      console.log(data.turn);
    });

    socket.on("error", () => {});

    socket.on("chat", (message) => {
      console.log(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="mt-20 flex gap-40">
      <div>room!!!!!!!!!!!!</div>
      <div className="flex flex-col gap-2">
        {Array.from(users).map((user) => {
          return <div key={user}>{user}</div>;
        })}
      </div>
      <div>
        <input
          className="border"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            socket.emit("chat", text);
            setText("");
          }}
        >
          submit
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          socket.emit("start");
        }}
      >
        start
      </button>
    </div>
  );
};

export { Test };
