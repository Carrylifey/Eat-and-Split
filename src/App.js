import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [isShow, setIsShow] = useState(false);
  const [selectFriend, setSelectFriend] = useState(false);

  function handleShowFriend() {
    setIsShow((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setIsShow(!isShow);
  }

  function handleSelect(friend) {
    setSelectFriend((curr) => (curr?.id === friend.id ? null : friend));
    setIsShow(false);
  }

  function handleSpiltBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selectFriend={selectFriend}
          onSelection={handleSelect}
        />
        {isShow && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowFriend}>
          {isShow ? "Close " : "Add Friend"}
        </Button>
      </div>
      {selectFriend && (
        <FormSplitBill
          selectFriend={selectFriend}
          onSpiltBill={handleSpiltBill}
        key={selectFriend.id}/>
      )}
    </div>
  );
}
function FriendList({ friends, onSelection, selectFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectFriend={selectFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectFriend }) {
  const isSelected = selectFriend?.id === friend.id;

  function handleClick() {
    console.log("Select button clicked for:", friend);
    onSelection(friend);
  }

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt=""></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name}
          {Math.abs(friend.balance)} Rs
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you
          {Math.abs(friend.balance)} Rs
        </p>
      )}
      {friend.balance === 0 && (
        <p>
          {` you and ${friend.name}
          are even`}
        </p>
      )}
      <Button className="button" onClick={handleClick}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handlesubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    if (!name || !image) return;
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handlesubmit}>
      <label>👦 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>📸Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectFriend, onSpiltBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [onePaying, setOnePaying] = useState("user ");
  const dostDega = bill ? bill - paidByUser : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSpiltBill(onePaying === "user" ? dostDega : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with With {selectFriend.name}</h2>
      <label>😀Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      ></input>
      <label>💹Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(Number(e.target.value)) > bill
            ? paidByUser
            : Number(e.target.value)
        }
      ></input>
      <label>💵{selectFriend.name} Expense </label>
      <input type="text" disabled value={dostDega}></input>
      <label>😀Who is paying the bill</label>
      <select>
        <option
          value={onePaying}
          onChange={(e) => setOnePaying(e.target.value)}
        >
          you
        </option>
        <option value="friend">{selectFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
export default App;
